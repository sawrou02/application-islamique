import { Router, Response } from 'express';
import { z } from 'zod';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const createRoomSchema = z.object({
  mode: z.enum(['prive', 'tournoi', 'halaqat', 'duo']).default('prive'),
  config: z
    .object({
      domaine: z.string().optional(),
      niveau: z.union([z.number(), z.literal('mixed')]).optional(),
      madhab: z.string().optional(),
      nb_questions: z.number().default(10),
      temps_par_question: z.number().default(30),
    })
    .optional(),
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const body = createRoomSchema.parse(req.body);
    const userId = req.user!.id;

    let code = generateRoomCode();
    // Ensure unique code
    let attempts = 0;
    while (attempts < 10) {
      const existing = await pool.query(
        "SELECT id FROM parties WHERE code_salle = $1 AND statut != 'terminee'",
        [code]
      );
      if (existing.rows.length === 0) break;
      code = generateRoomCode();
      attempts++;
    }

    const result = await pool.query(
      `INSERT INTO parties (mode, hote_id, code_salle, config, statut)
       VALUES ($1, $2, $3, $4, 'en_attente')
       RETURNING *`,
      [body.mode, userId, code, JSON.stringify(body.config || {})]
    );

    const room = result.rows[0];

    // Add host as first player
    await pool.query(
      'INSERT INTO joueurs_partie (partie_id, user_id, score) VALUES ($1, $2, 0)',
      [room.id, userId]
    );

    res.status(201).json({ success: true, data: room });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: err.errors });
      return;
    }
    console.error(err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.post('/join', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { code } = z.object({ code: z.string().min(4) }).parse(req.body);
    const userId = req.user!.id;

    const roomResult = await pool.query(
      "SELECT * FROM parties WHERE code_salle = $1 AND statut = 'en_attente'",
      [code.toUpperCase()]
    );

    if (roomResult.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Salle non trouvée ou déjà commencée' });
      return;
    }

    const room = roomResult.rows[0];

    // Check if already in room
    const alreadyIn = await pool.query(
      'SELECT id FROM joueurs_partie WHERE partie_id = $1 AND user_id = $2',
      [room.id, userId]
    );

    if (alreadyIn.rows.length === 0) {
      await pool.query(
        'INSERT INTO joueurs_partie (partie_id, user_id, score) VALUES ($1, $2, 0)',
        [room.id, userId]
      );
    }

    res.json({ success: true, data: room });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: err.errors });
      return;
    }
    console.error(err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const roomResult = await pool.query('SELECT * FROM parties WHERE id = $1', [id]);
    if (roomResult.rows.length === 0) {
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
      data: { ...roomResult.rows[0], players: playersResult.rows },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
