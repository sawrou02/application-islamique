import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { domaine, niveau, madhab, limit = '10', offset = '0' } = req.query;

    const conditions: string[] = ["q.statut = 'valide'"];
    const params: unknown[] = [];
    let paramIdx = 1;

    if (domaine) {
      conditions.push(`q.domaine = $${paramIdx++}`);
      params.push(domaine);
    }
    if (niveau) {
      conditions.push(`q.niveau = $${paramIdx++}`);
      params.push(Number(niveau));
    }
    if (madhab) {
      conditions.push(`(q.madhab = $${paramIdx++} OR q.madhab = 'general')`);
      params.push(madhab);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    params.push(Number(limit));
    params.push(Number(offset));

    const result = await pool.query(
      `SELECT q.*, json_agg(
        json_build_object(
          'id', r.id, 'texte_fr', r.texte_fr, 'texte_ar', r.texte_ar, 'est_correcte', r.est_correcte
        )
      ) as reponses
      FROM questions q
      LEFT JOIN reponses r ON r.question_id = q.id
      ${whereClause}
      GROUP BY q.id
      ORDER BY RANDOM()
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      params
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.get('/daily', async (req: Request, res: Response) => {
  try {
    // Use current date as seed for consistent daily questions
    const today = new Date().toISOString().split('T')[0];
    const seed = today.replace(/-/g, '');

    const result = await pool.query(
      `SELECT q.*, json_agg(
        json_build_object(
          'id', r.id, 'texte_fr', r.texte_fr, 'texte_ar', r.texte_ar, 'est_correcte', r.est_correcte
        )
      ) as reponses
      FROM questions q
      LEFT JOIN reponses r ON r.question_id = q.id
      WHERE q.statut = 'valide'
      GROUP BY q.id
      ORDER BY MD5(q.id::text || $1)
      LIMIT 5`,
      [seed]
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT q.*, json_agg(
        json_build_object(
          'id', r.id, 'texte_fr', r.texte_fr, 'texte_ar', r.texte_ar, 'est_correcte', r.est_correcte
        )
      ) as reponses
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
    console.error(err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
