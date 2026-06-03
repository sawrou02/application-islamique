import { Router, Response } from 'express';
import { z } from 'zod';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { generateHalaqaPDF } from '../services/pdfExport';

const router = Router();

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// POST /api/halaqat — créer une halaqa (l'utilisateur devient enseignant)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nom, description } = z.object({
      nom: z.string().min(2).max(150),
      description: z.string().max(500).optional(),
    }).parse(req.body);
    const user_id = req.user!.id;

    let code_acces = generateCode();
    // Évite une collision improbable
    for (let i = 0; i < 5; i++) {
      const exists = await pool.query('SELECT id FROM halaqat WHERE code_acces = $1', [code_acces]);
      if (exists.rows.length === 0) break;
      code_acces = generateCode();
    }

    const result = await pool.query(
      `INSERT INTO halaqat (nom, description, enseignant_id, code_acces)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nom, description ?? null, user_id, code_acces]
    );

    await pool.query(
      `INSERT INTO halaqat_membres (halaqa_id, user_id, role)
       VALUES ($1, $2, 'enseignant')`,
      [result.rows[0].id, user_id]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Données invalides', details: err.errors });
      return;
    }
    console.error('Create halaqa error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/halaqat/join — rejoindre via code d'accès
router.post('/join', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code } = z.object({ code: z.string() }).parse(req.body);
    const user_id = req.user!.id;

    const halaqa = await pool.query('SELECT * FROM halaqat WHERE code_acces = $1', [code.toUpperCase()]);
    if (halaqa.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Halaqa introuvable' });
      return;
    }

    await pool.query(
      `INSERT INTO halaqat_membres (halaqa_id, user_id, role)
       VALUES ($1, $2, 'eleve') ON CONFLICT (halaqa_id, user_id) DO NOTHING`,
      [halaqa.rows[0].id, user_id]
    );

    res.json({ success: true, data: halaqa.rows[0] });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Code invalide' });
      return;
    }
    console.error('Join halaqa error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/halaqat/my — mes halaqat (enseignant ou élève)
router.get('/my', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user!.id;
    const result = await pool.query(
      `SELECT h.*, hm.role,
         (SELECT COUNT(*) FROM halaqat_membres m WHERE m.halaqa_id = h.id) AS nb_membres
       FROM halaqat h
       JOIN halaqat_membres hm ON hm.halaqa_id = h.id
       WHERE hm.user_id = $1
       ORDER BY h.created_at DESC`,
      [user_id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('My halaqat error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/halaqat/:id — détails + membres + résultats (réservé aux membres)
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user_id = req.user!.id;

    const membre = await pool.query(
      'SELECT role FROM halaqat_membres WHERE halaqa_id = $1 AND user_id = $2',
      [id, user_id]
    );
    if (membre.rows.length === 0) {
      res.status(403).json({ success: false, error: 'Accès réservé aux membres' });
      return;
    }

    const halaqa = await pool.query('SELECT * FROM halaqat WHERE id = $1', [id]);
    if (halaqa.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Halaqa introuvable' });
      return;
    }

    const membres = await pool.query(
      `SELECT hm.role, hm.joined_at, u.id AS user_id, u.pseudo, u.niveau, u.xp_total
       FROM halaqat_membres hm JOIN users u ON u.id = hm.user_id
       WHERE hm.halaqa_id = $1 ORDER BY hm.role DESC, u.pseudo`,
      [id]
    );

    res.json({
      success: true,
      data: { ...halaqa.rows[0], mon_role: membre.rows[0].role, membres: membres.rows },
    });
  } catch (err) {
    console.error('Get halaqa error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/halaqat/:id/rapport-pdf — télécharger le rapport PDF (membres uniquement)
router.get('/:id/rapport-pdf', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user_id = req.user!.id;

    const membre = await pool.query(
      'SELECT role FROM halaqat_membres WHERE halaqa_id = $1 AND user_id = $2',
      [id, user_id]
    );
    if (membre.rows.length === 0) {
      res.status(403).json({ success: false, error: 'Accès réservé aux membres' });
      return;
    }

    const halaqa = await pool.query('SELECT * FROM halaqat WHERE id = $1', [id]);
    if (halaqa.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Halaqa introuvable' });
      return;
    }

    const resultats = await pool.query(
      `SELECT u.pseudo, hr.score, hr.nb_correctes, hr.nb_questions, hr.xp_gagne, hr.created_at as date
       FROM halaqat_resultats hr
       JOIN users u ON u.id = hr.user_id
       WHERE hr.halaqa_id = $1
       ORDER BY hr.score DESC`,
      [id]
    );

    const h = halaqa.rows[0];
    const report = {
      nom: h.nom,
      code_acces: h.code_acces,
      date_generation: new Date().toLocaleDateString('fr-FR'),
      membres: resultats.rows.map((r: any) => ({
        pseudo: r.pseudo,
        score: Number(r.score),
        nb_correctes: Number(r.nb_correctes),
        nb_questions: Number(r.nb_questions),
        xp_gagne: Number(r.xp_gagne),
        date: r.date,
      })),
    };

    generateHalaqaPDF(report, res);
  } catch (err) {
    console.error('PDF rapport error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
