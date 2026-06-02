import { Router, Request, Response } from 'express';
import { z } from 'zod';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const submitSchema = z.object({
  partie_id: z.string().uuid().optional(),
  answers: z.array(z.object({
    question_id: z.string().uuid(),
    reponse_id: z.string().uuid(),
    temps_ms: z.number().int().nonnegative(),
  })),
});

// POST /api/quiz/submit
router.post('/submit', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = submitSchema.parse(req.body);
    const { answers } = body;
    const user_id = req.user!.id;

    if (answers.length === 0) {
      res.status(400).json({ success: false, error: 'Aucune réponse fournie' });
      return;
    }

    const questionIds = answers.map(a => a.question_id);
    const questionsResult = await pool.query(
      `SELECT q.id, q.niveau,
        (SELECT r.id FROM reponses r WHERE r.question_id = q.id AND r.est_correcte = true LIMIT 1) AS correct_reponse_id
       FROM questions q WHERE q.id = ANY($1)`,
      [questionIds]
    );

    const questionsMap = new Map(questionsResult.rows.map(q => [q.id, q]));

    let xp_gained = 0;
    let correct_count = 0;
    let consecutive_correct = 0;

    const answers_detail = answers.map(answer => {
      const q = questionsMap.get(answer.question_id);
      if (!q) return { ...answer, est_correcte: false, bonne_reponse_id: '', xp: 0 };

      const est_correcte = q.correct_reponse_id === answer.reponse_id;
      let xp = 0;

      if (est_correcte) {
        correct_count++;
        consecutive_correct++;
        xp = q.niveau * 10;

        // Fast answer bonus (< 5 seconds)
        if (answer.temps_ms < 5000) {
          xp = Math.round(xp * 1.5);
        }

        // Streak bonus: +100 XP per 5 consecutive correct answers
        if (consecutive_correct % 5 === 0) {
          xp += 100;
        }
      } else {
        consecutive_correct = 0;
      }

      xp_gained += xp;

      return {
        question_id: answer.question_id,
        reponse_id: answer.reponse_id,
        est_correcte,
        bonne_reponse_id: q.correct_reponse_id || '',
        xp,
      };
    });

    const score = Math.round((correct_count / answers.length) * 100);

    // Update user XP and streak
    const today = new Date().toISOString().slice(0, 10);
    const userResult = await pool.query(
      'SELECT xp_total, niveau, streak_days, last_daily_challenge FROM users WHERE id = $1',
      [user_id]
    );
    const currentUser = userResult.rows[0];

    // Calculate new level
    const newXp = currentUser.xp_total + xp_gained;
    let newNiveau = currentUser.niveau;
    const thresholds = [0, 500, 2000, 5000, 10000, 20000];
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (newXp >= thresholds[i]) { newNiveau = i + 1; break; }
    }

    // Streak update
    let newStreak = currentUser.streak_days;
    const lastChallenge = currentUser.last_daily_challenge;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (lastChallenge === yesterday) { newStreak += 1; }
    else if (lastChallenge !== today) { newStreak = 1; }

    await pool.query(
      'UPDATE users SET xp_total = $1, niveau = $2, streak_days = $3, last_daily_challenge = $4, updated_at = NOW() WHERE id = $5',
      [newXp, newNiveau, newStreak, today, user_id]
    );

    const level_up = newNiveau > currentUser.niveau;

    res.json({
      success: true,
      data: {
        score,
        xp_gained,
        correct_count,
        total: answers.length,
        answers_detail,
        level_up,
        new_level: level_up ? newNiveau : undefined,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Données invalides', details: err.errors });
      return;
    }
    console.error('Submit quiz error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
