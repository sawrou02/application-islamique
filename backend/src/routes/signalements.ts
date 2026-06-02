import { Router, Response } from 'express';
import { z } from 'zod';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const signalementSchema = z.object({
  question_id: z.string().uuid(),
  motif: z.enum([
    'dalil_incorrect',
    'reponse_incorrecte',
    'traduction_erronee',
    'hors_manhaj',
    'autre',
  ]),
  detail: z.string().max(500).optional(),
});

// POST /api/signalements — signaler une question
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = signalementSchema.parse(req.body);
    const user_id = req.user!.id;

    // Vérifier que la question existe
    const qCheck = await pool.query('SELECT id FROM questions WHERE id = $1', [body.question_id]);
    if (qCheck.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Question non trouvée' });
      return;
    }

    // Empêcher les doublons du même user sur la même question
    const existing = await pool.query(
      "SELECT id FROM signalements WHERE question_id = $1 AND user_id = $2 AND statut = 'en_attente'",
      [body.question_id, user_id]
    );

    if (existing.rows.length > 0) {
      res.status(409).json({ success: false, error: 'Vous avez déjà signalé cette question' });
      return;
    }

    await pool.query(
      `INSERT INTO signalements (question_id, user_id, motif, statut)
       VALUES ($1, $2, $3, 'en_attente')`,
      [body.question_id, user_id, body.motif + (body.detail ? ': ' + body.detail : '')]
    );

    // Si 3 signalements en attente → mettre la question en attente de révision automatiquement
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM signalements WHERE question_id = $1 AND statut = 'en_attente'",
      [body.question_id]
    );

    if (parseInt(countResult.rows[0].count, 10) >= 3) {
      await pool.query(
        "UPDATE questions SET statut = 'en_attente' WHERE id = $1 AND statut = 'valide'",
        [body.question_id]
      );
    }

    res.status(201).json({ success: true, message: 'Signalement enregistré. JazakAllah khayran.' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Données invalides', details: err.errors });
      return;
    }
    console.error('Signalement error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
