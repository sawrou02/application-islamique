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
        temps_ms: answer.temps_ms,
      };
    });

    // Enregistre l'historique des réponses (pour le mode Muraja'ah et les stats)
    for (const d of answers_detail) {
      if (!questionsMap.has(d.question_id)) continue;
      await pool.query(
        `INSERT INTO historique_reponses (user_id, question_id, reponse_id, est_correcte, temps_ms, partie_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user_id, d.question_id, d.reponse_id, d.est_correcte, d.temps_ms, body.partie_id || null]
      );
    }

    const score = Math.round((correct_count / answers.length) * 100);

    // Update user XP and streak
    const today = new Date().toISOString().slice(0, 10);
    const userResult = await pool.query(
      'SELECT xp_total, niveau, streak_days, last_daily_challenge, xp_semaine, semaine_ref FROM users WHERE id = $1',
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

    // XP hebdomadaire (réinitialisé chaque lundi)
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const mondayStr = monday.toISOString().slice(0, 10);
    const sameWeek = currentUser.semaine_ref &&
      new Date(currentUser.semaine_ref).toISOString().slice(0, 10) === mondayStr;
    const newXpSemaine = (sameWeek ? (currentUser.xp_semaine || 0) : 0) + xp_gained;

    await pool.query(
      `UPDATE users SET xp_total = $1, niveau = $2, streak_days = $3, last_daily_challenge = $4,
       xp_semaine = $5, semaine_ref = $6, updated_at = NOW() WHERE id = $7`,
      [newXp, newNiveau, newStreak, today, newXpSemaine, mondayStr, user_id]
    );

    // Met à jour les points du tournoi actif si l'utilisateur y est inscrit
    if (xp_gained > 0) {
      await pool.query(
        `UPDATE tournoi_participants tp
         SET points = points + $1
         FROM tournois t
         WHERE tp.tournoi_id = t.id AND tp.user_id = $2
           AND t.statut = 'ouvert' AND CURRENT_DATE BETWEEN t.date_debut AND t.date_fin`,
        [xp_gained, user_id]
      );
    }

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

// GET /api/quiz/mistakes — questions dont la dernière réponse de l'utilisateur était fausse
// (mode Muraja'ah : révision des erreurs non encore corrigées)
router.get('/mistakes', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user!.id;
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const query = `
      WITH derniere_reponse AS (
        SELECT DISTINCT ON (h.question_id)
          h.question_id, h.est_correcte, h.created_at
        FROM historique_reponses h
        WHERE h.user_id = $1
        ORDER BY h.question_id, h.created_at DESC
      )
      SELECT q.*, json_agg(json_build_object(
        'id', r.id, 'texte_fr', r.texte_fr, 'texte_ar', r.texte_ar, 'est_correcte', r.est_correcte
      ) ORDER BY r.id) AS reponses
      FROM derniere_reponse d
      JOIN questions q ON q.id = d.question_id AND q.statut = 'valide'
      LEFT JOIN reponses r ON r.question_id = q.id
      WHERE d.est_correcte = false
      GROUP BY q.id, d.created_at
      ORDER BY d.created_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [user_id, limit]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Get mistakes error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// ---------------------------------------------------------------
// SRS — Répétition espacée (mode Ta'allum)
// ---------------------------------------------------------------

// GET /api/quiz/srs/due — questions à réviser aujourd'hui (cartes échues)
router.get('/srs/due', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user!.id;
    const limit = Math.min(Number(req.query.limit) || 10, 30);

    const query = `
      SELECT q.*, json_agg(json_build_object(
        'id', r.id, 'texte_fr', r.texte_fr, 'texte_ar', r.texte_ar, 'est_correcte', r.est_correcte
      ) ORDER BY r.id) AS reponses
      FROM srs_cards c
      JOIN questions q ON q.id = c.question_id AND q.statut = 'valide'
      LEFT JOIN reponses r ON r.question_id = q.id
      WHERE c.user_id = $1 AND c.due_date <= CURRENT_DATE
      GROUP BY q.id, c.due_date
      ORDER BY c.due_date ASC
      LIMIT $2
    `;

    const result = await pool.query(query, [user_id, limit]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('SRS due error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

const srsReviewSchema = z.object({
  question_id: z.string().uuid(),
  // qualité de rappel : 0 = oublié, 1 = difficile, 2 = correct, 3 = facile
  quality: z.number().int().min(0).max(3),
});

// POST /api/quiz/srs/review — enregistre une révision et reprogramme la carte (SM-2 simplifié)
router.post('/srs/review', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { question_id, quality } = srsReviewSchema.parse(req.body);
    const user_id = req.user!.id;

    const existing = await pool.query(
      'SELECT * FROM srs_cards WHERE user_id = $1 AND question_id = $2',
      [user_id, question_id]
    );

    let ease = existing.rows[0]?.ease_factor ? Number(existing.rows[0].ease_factor) : 2.5;
    let repetitions = existing.rows[0]?.repetitions ?? 0;
    let interval = existing.rows[0]?.interval_days ?? 0;

    if (quality < 2) {
      // Échec : on recommence à zéro
      repetitions = 0;
      interval = 1;
    } else {
      repetitions += 1;
      if (repetitions === 1) interval = 1;
      else if (repetitions === 2) interval = 3;
      else interval = Math.round(interval * ease);
    }

    // Ajuste l'ease factor (borné à 1.3)
    ease = Math.max(1.3, ease + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02)));

    const due = new Date();
    due.setDate(due.getDate() + interval);
    const dueStr = due.toISOString().slice(0, 10);

    await pool.query(
      `INSERT INTO srs_cards (user_id, question_id, ease_factor, interval_days, repetitions, due_date, last_reviewed)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (user_id, question_id)
       DO UPDATE SET ease_factor = $3, interval_days = $4, repetitions = $5, due_date = $6, last_reviewed = NOW()`,
      [user_id, question_id, ease.toFixed(2), interval, repetitions, dueStr]
    );

    res.json({ success: true, data: { next_review: dueStr, interval_days: interval, ease_factor: Number(ease.toFixed(2)) } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Données invalides', details: err.errors });
      return;
    }
    console.error('SRS review error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
