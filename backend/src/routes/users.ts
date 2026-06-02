import { Router, Response } from 'express';
import { z } from 'zod';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/users/profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user!.id;

    const userResult = await pool.query(
      `SELECT u.id, u.pseudo, u.email, u.pays, u.ville, u.madhab, u.langue, u.niveau,
              u.xp_total, u.streak_days, u.last_daily_challenge, u.created_at, u.updated_at,
              COUNT(DISTINCT jp.partie_id) AS total_parties
       FROM users u
       LEFT JOIN joueurs_partie jp ON jp.user_id = u.id
       WHERE u.id = $1
       GROUP BY u.id`,
      [user_id]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
      return;
    }

    const badgesResult = await pool.query(
      `SELECT b.*, ub.date_obtention
       FROM user_badges ub
       JOIN badges b ON b.id = ub.badge_id
       WHERE ub.user_id = $1`,
      [user_id]
    );

    res.json({
      success: true,
      data: { ...userResult.rows[0], badges: badgesResult.rows },
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT /api/users/profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const schema = z.object({
      madhab: z.enum(['hanafi', 'maliki', 'shafii', 'hanbali', 'general']).optional(),
      pays: z.string().optional(),
      langue: z.string().optional(),
      ville: z.string().optional(),
    });

    const updates = schema.parse(req.body);
    const user_id = req.user!.id;

    const sets: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (updates.madhab) { sets.push(`madhab = $${idx++}`); params.push(updates.madhab); }
    if (updates.pays) { sets.push(`pays = $${idx++}`); params.push(updates.pays); }
    if (updates.langue) { sets.push(`langue = $${idx++}`); params.push(updates.langue); }
    if (updates.ville) { sets.push(`ville = $${idx++}`); params.push(updates.ville); }

    if (sets.length === 0) {
      res.status(400).json({ success: false, error: 'Aucune donnée à mettre à jour' });
      return;
    }

    sets.push(`updated_at = NOW()`);
    params.push(user_id);

    const result = await pool.query(
      `UPDATE users SET ${sets.join(', ')} WHERE id = $${idx} RETURNING id, pseudo, email, pays, ville, madhab, langue, niveau, xp_total, streak_days`,
      params
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Données invalides' });
      return;
    }
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/users/stats
router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user!.id;

    const statsResult = await pool.query(
      `SELECT
         COUNT(DISTINCT jp.partie_id) AS total_parties,
         SUM(jp.score) AS total_score,
         AVG(jp.score) AS avg_score
       FROM joueurs_partie jp WHERE jp.user_id = $1`,
      [user_id]
    );

    res.json({ success: true, data: statsResult.rows[0] });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
