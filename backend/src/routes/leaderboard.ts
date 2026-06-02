import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /api/leaderboard
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { type = 'global', period = 'alltime', pays } = req.query;

    let conditions = '';
    const params: unknown[] = [];
    let idx = 1;

    if (type === 'national' && pays) {
      conditions = `WHERE u.pays = $${idx++}`;
      params.push(pays);
    }

    let orderBy = 'u.xp_total DESC';
    if (period === 'weekly') {
      orderBy = 'u.xp_total DESC'; // In production, track weekly XP separately
    }

    params.push(50);
    const query = `
      SELECT
        ROW_NUMBER() OVER (ORDER BY ${orderBy}) AS rank,
        u.id AS user_id, u.pseudo, u.pays, u.niveau, u.xp_total, u.streak_days
      FROM users u
      ${conditions}
      ORDER BY ${orderBy}
      LIMIT $${idx}
    `;

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
