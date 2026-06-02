import { Router, Response } from 'express';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

function generateToken(): string {
  return randomBytes(24).toString('hex');
}

// POST /api/duels — créer un duel et retourner un token d'invitation
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const config = z.object({
      domaine: z.string().optional(),
      niveau: z.union([z.number(), z.string()]).optional(),
      nb_questions: z.number().int().min(5).max(20).default(10),
      temps_par_question: z.number().int().default(30),
    }).parse(req.body.config ?? {});

    const invite_token = generateToken();

    const result = await pool.query(
      `INSERT INTO duels (challenger_id, statut, config, invite_token)
       VALUES ($1, 'en_attente', $2, $3)
       RETURNING *`,
      [req.user!.id, JSON.stringify(config), invite_token]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Config invalide', details: err.errors });
      return;
    }
    console.error('Create duel error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/duels/accept — accepter un duel via token
router.post('/accept', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token } = z.object({ token: z.string() }).parse(req.body);
    const user_id = req.user!.id;

    const result = await pool.query(
      "SELECT * FROM duels WHERE invite_token = $1 AND statut = 'en_attente'",
      [token]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Invitation invalide ou expirée' });
      return;
    }

    const duel = result.rows[0];

    if (duel.challenger_id === user_id) {
      res.status(400).json({ success: false, error: 'Vous ne pouvez pas rejoindre votre propre duel' });
      return;
    }

    const updated = await pool.query(
      "UPDATE duels SET challenged_id = $1, statut = 'accepte' WHERE id = $2 RETURNING *",
      [user_id, duel.id]
    );

    res.json({ success: true, data: updated.rows[0] });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Token invalide' });
      return;
    }
    console.error('Accept duel error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/duels/my — mes duels (en cours + terminés)
router.get('/my', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user!.id;

    const result = await pool.query(
      `SELECT d.*,
         uc.pseudo AS challenger_pseudo, uc.niveau AS challenger_niveau,
         uu.pseudo AS challenged_pseudo, uu.niveau AS challenged_niveau,
         ug.pseudo AS gagnant_pseudo
       FROM duels d
       LEFT JOIN users uc ON uc.id = d.challenger_id
       LEFT JOIN users uu ON uu.id = d.challenged_id
       LEFT JOIN users ug ON ug.id = d.gagnant_id
       WHERE d.challenger_id = $1 OR d.challenged_id = $1
       ORDER BY d.created_at DESC
       LIMIT 20`,
      [user_id]
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Get my duels error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/duels/:id — détails d'un duel
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user_id = req.user!.id;

    const result = await pool.query(
      `SELECT d.*,
         uc.pseudo AS challenger_pseudo, uc.niveau AS challenger_niveau,
         uu.pseudo AS challenged_pseudo, uu.niveau AS challenged_niveau
       FROM duels d
       LEFT JOIN users uc ON uc.id = d.challenger_id
       LEFT JOIN users uu ON uu.id = d.challenged_id
       WHERE d.id = $1 AND (d.challenger_id = $2 OR d.challenged_id = $2)`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Duel non trouvé' });
      return;
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Get duel error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
