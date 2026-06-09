import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /api/questions
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { domaine, niveau, limit = '10', offset = '0' } = req.query;

    const conditions: string[] = ["q.statut = 'valide'"];
    const params: unknown[] = [];
    let idx = 1;

    if (domaine) { conditions.push(`q.domaine = $${idx++}`); params.push(domaine); }
    if (niveau) { conditions.push(`q.niveau = $${idx++}`); params.push(Number(niveau)); }

    params.push(Number(limit), Number(offset));

    const query = `
      SELECT q.*, json_agg(json_build_object(
        'id', r.id, 'texte_fr', r.texte_fr, 'texte_ar', r.texte_ar, 'est_correcte', r.est_correcte
      ) ORDER BY r.id) AS reponses
      FROM questions q
      LEFT JOIN reponses r ON r.question_id = q.id
      WHERE ${conditions.join(' AND ')}
      GROUP BY q.id
      ORDER BY RANDOM()
      LIMIT $${idx++} OFFSET $${idx}
    `;

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Get questions error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/questions/daily
router.get('/daily', async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const seed = today.replace(/-/g, '');

    const query = `
      SELECT q.*, json_agg(json_build_object(
        'id', r.id, 'texte_fr', r.texte_fr, 'texte_ar', r.texte_ar, 'est_correcte', r.est_correcte
      ) ORDER BY r.id) AS reponses
      FROM questions q
      LEFT JOIN reponses r ON r.question_id = q.id
      WHERE q.statut = 'valide'
      GROUP BY q.id
      ORDER BY MD5(q.id::text || $1)
      LIMIT 5
    `;

    const result = await pool.query(query, [seed]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Get daily questions error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/questions/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT q.*, json_agg(json_build_object(
        'id', r.id, 'texte_fr', r.texte_fr, 'texte_ar', r.texte_ar, 'est_correcte', r.est_correcte
      ) ORDER BY r.id) AS reponses
      FROM questions q
      LEFT JOIN reponses r ON r.question_id = q.id
      WHERE q.id = $1
      GROUP BY q.id`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Question non trouvée' });
      return;
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Get question error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
