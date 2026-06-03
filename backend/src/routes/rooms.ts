import { Router, Request, Response } from 'express';
import { z } from 'zod';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

function generateRoomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/rooms - Create room
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { config = {} } = req.body;
    const user_id = req.user!.id;

    const code_salle = generateRoomCode();

    const result = await pool.query(
      `INSERT INTO parties (mode, hote_id, code_salle, config, statut)
       VALUES ('prive', $1, $2, $3, 'en_attente')
       RETURNING *`,
      [user_id, code_salle, JSON.stringify(config)]
    );

    const partie = result.rows[0];

    // Add host as player
    await pool.query(
      'INSERT INTO joueurs_partie (partie_id, user_id) VALUES ($1, $2)',
      [partie.id, user_id]
    );

    res.status(201).json({ success: true, data: partie });
  } catch (err) {
    console.error('Create room error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/rooms/join
router.post('/join', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code } = z.object({ code: z.string() }).parse(req.body);
    const user_id = req.user!.id;

    const result = await pool.query(
      "SELECT * FROM parties WHERE code_salle = $1 AND statut = 'en_attente'",
      [code]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Salle non trouvée ou déjà commencée' });
      return;
    }

    const partie = result.rows[0];

    // Check if already in room
    const existing = await pool.query(
      'SELECT id FROM joueurs_partie WHERE partie_id = $1 AND user_id = $2',
      [partie.id, user_id]
    );

    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO joueurs_partie (partie_id, user_id) VALUES ($1, $2)',
        [partie.id, user_id]
      );
    }

    res.json({ success: true, data: partie });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Code invalide' });
      return;
    }
    console.error('Join room error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/rooms/:id
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const partieResult = await pool.query('SELECT * FROM parties WHERE id = $1', [id]);
    if (partieResult.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Salle non trouvée' });
      return;
    }

    const playersResult = await pool.query(
      `SELECT jp.*, u.pseudo, u.niveau, u.pays
       FROM joueurs_partie jp
       JOIN users u ON u.id = jp.user_id
       WHERE jp.partie_id = $1`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...partieResult.rows[0],
        players: playersResult.rows,
      },
    });
  } catch (err) {
    console.error('Get room error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
