import { Router, Response } from 'express';
import { z } from 'zod';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const submitSchema = z.object({
  partie_id: z.string().uuid().optional(),
  answers: z.array(
    z.object({
      question_id: z.string().uuid(),
      reponse_id: z.string().uuid(),
      temps_ms: z.number(),
    })
  ),
});

const XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 500,
  3: 2000,
  4: 5000,
  5: 10000,
  6: 20000,
};

function computeLevel(xp: number): number {
  let level = 1;
  for (let l = 6; l >= 1; l--) {
    if (xp >= XP_THRESHOLDS[l]) {
      level = l;
      break;
    }
  }
  return level;
}

router.post('/submit', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const body = submitSchema.parse(req.body);
    const userId = req.user!.id;

    const questionIds = body.answers.map((a) => a.question_id);
    const questionsResult = await pool.query(
      `SELECT q.id, q.niveau, r.id as rep_id, r.est_correcte
       FROM questions q
       JOIN reponses r ON r.question_id = q.id
       WHERE q.id = ANY($1)`,
      [questionIds]
    );

    // Build map: question_id -> { niveau, correct_reponse_id, reponse_map }
    const questionMap: Record<
      string,
      { niveau: number; correct_reponse_id: string; reponses: Record<string, boolean> }
    > = {};

    for (const row of questionsResult.rows) {
      if (!questionMap[row.id]) {
        questionMap[row.id] = { niveau: row.niveau, correct_reponse_id: '', reponses: {} };
      }
      questionMap[row.id].reponses[row.rep_id] = row.est_correcte;
      if (row.est_correcte) {
        questionMap[row.id].correct_reponse_id = row.rep_id;
      }
    }

    let totalXp = 0;
    let correctCount = 0;
    let consecutiveCorrect = 0;

    const answersDetail = body.answers.map((answer) => {
      const qData = questionMap[answer.question_id];
      if (!qData) return { ...answer, est_correcte: false, correct_reponse_id: '', xp: 0 };

      const isCorrect = qData.reponses[answer.reponse_id] === true;
      let xp = 0;

      if (isCorrect) {
        correctCount++;
        consecutiveCorrect++;
        xp = qData.niveau * 10;
        // Fast answer bonus
        if (answer.temps_ms < 5000) xp = Math.floor(xp * 1.5);
        // Streak bonus: +100 every 5 consecutive correct
        if (consecutiveCorrect % 5 === 0) xp += 100;
        totalXp += xp;
      } else {
        consecutiveCorrect = 0;
      }

      return {
        question_id: answer.question_id,
        reponse_id: answer.reponse_id,
        est_correcte: isCorrect,
        correct_reponse_id: qData.correct_reponse_id,
        xp,
      };
    });

    // Update user XP and level
    const userResult = await pool.query(
      'SELECT xp_total, streak_days, last_daily_challenge FROM users WHERE id = $1',
      [userId]
    );
    const currentUser = userResult.rows[0];
    const newXp = currentUser.xp_total + totalXp;
    const newLevel = computeLevel(newXp);

    // Update streak
    const today = new Date().toISOString().split('T')[0];
    const lastChallenge = currentUser.last_daily_challenge;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = currentUser.streak_days;
    if (lastChallenge === yesterday) {
      newStreak += 1;
    } else if (lastChallenge !== today) {
      newStreak = 1;
    }

    await pool.query(
      `UPDATE users SET xp_total = $1, niveau = $2, streak_days = $3, last_daily_challenge = $4, updated_at = NOW()
       WHERE id = $5`,
      [newXp, newLevel, newStreak, today, userId]
    );

    // Save party result if partie_id provided
    if (body.partie_id) {
      await pool.query(
        `UPDATE joueurs_partie SET score = $1 WHERE partie_id = $2 AND user_id = $3`,
        [totalXp, body.partie_id, userId]
      );
    }

    // Check badges
    const earnedBadges: unknown[] = [];

    // Al-Mujahid: 7 consecutive days
    if (newStreak >= 7) {
      const badge = await pool.query("SELECT id FROM badges WHERE nom = 'Al-Mujahid'");
      if (badge.rows.length > 0) {
        try {
          await pool.query(
            'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [userId, badge.rows[0].id]
          );
          earnedBadges.push(badge.rows[0]);
        } catch {}
      }
    }

    res.json({
      success: true,
      data: {
        score: totalXp,
        xp_gained: totalXp,
        correct_count: correctCount,
        total: body.answers.length,
        new_level: newLevel !== req.user!.niveau ? newLevel : undefined,
        badges_earned: earnedBadges,
        answers_detail: answersDetail,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: err.errors });
      return;
    }
    console.error(err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
