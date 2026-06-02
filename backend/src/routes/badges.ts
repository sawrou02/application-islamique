import { Router, Response } from 'express';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/badges
router.get('/', async (_, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM badges ORDER BY nom');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Get badges error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/badges/my
router.get('/my', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user!.id;
    const result = await pool.query(
      `SELECT b.*, ub.date_obtention
       FROM user_badges ub
       JOIN badges b ON b.id = ub.badge_id
       WHERE ub.user_id = $1
       ORDER BY ub.date_obtention DESC`,
      [user_id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Get my badges error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
