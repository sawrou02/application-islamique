import { Router, Response } from 'express';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Middleware admin : vérifie que l'utilisateur a le rôle 'admin'
function adminMiddleware(req: AuthRequest, res: Response, next: Function): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Accès réservé aux administrateurs' });
    return;
  }
  next();
}

// GET /api/admin/signalements — liste les signalements en attente avec détails question
router.get('/signalements', authMiddleware, adminMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.raison, s.details, s.statut, s.created_at,
              u.pseudo AS signaleur,
              q.id AS question_id, q.texte AS question_texte, q.categorie, q.difficulte, q.est_valide
       FROM signalements s
       JOIN users u ON u.id = s.user_id
       JOIN questions q ON q.id = s.question_id
       WHERE s.statut = 'en_attente'
       ORDER BY s.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Admin signalements error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/admin/signalements/:id/traiter — traiter un signalement
router.post('/signalements/:id/traiter', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action } = req.body as { action: 'valider' | 'suspendre' | 'rejeter' };

    if (!['valider', 'suspendre', 'rejeter'].includes(action)) {
      res.status(400).json({ success: false, error: "Action invalide. Valeurs acceptées : 'valider', 'suspendre', 'rejeter'" });
      return;
    }

    const signalement = await pool.query('SELECT * FROM signalements WHERE id = $1', [id]);
    if (signalement.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Signalement introuvable' });
      return;
    }

    const questionId = signalement.rows[0].question_id;

    if (action === 'valider') {
      // Signalement validé : question confirmée comme problématique, on la suspend (est_valide = false)
      await pool.query('UPDATE questions SET est_valide = false WHERE id = $1', [questionId]);
    } else if (action === 'rejeter') {
      // Signalement rejeté : question réhabilitée (est_valide = true)
      await pool.query('UPDATE questions SET est_valide = true WHERE id = $1', [questionId]);
    }
    // 'suspendre' : on met juste à jour le statut du signalement sans toucher à la question

    await pool.query('UPDATE signalements SET statut = $1 WHERE id = $2', [action === 'valider' ? 'traite' : action, id]);

    res.json({ success: true, message: `Signalement traité : ${action}` });
  } catch (err) {
    console.error('Admin traiter signalement error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/admin/questions/en-attente — questions non validées
router.get('/questions/en-attente', authMiddleware, adminMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT q.*, u.pseudo AS auteur
       FROM questions q
       LEFT JOIN users u ON u.id = q.created_by
       WHERE q.est_valide = false
       ORDER BY q.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Admin questions en-attente error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/admin/questions/:id/valider — valider une question
router.post('/questions/:id/valider', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE questions SET est_valide = true WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Question introuvable' });
      return;
    }
    res.json({ success: true, message: 'Question validée' });
  } catch (err) {
    console.error('Admin valider question error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/admin/questions/:id/rejeter — supprimer une question
router.post('/questions/:id/rejeter', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM questions WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Question introuvable' });
      return;
    }
    res.json({ success: true, message: 'Question supprimée' });
  } catch (err) {
    console.error('Admin rejeter question error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
