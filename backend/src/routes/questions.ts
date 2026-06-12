import { Router, Request, Response } from 'express';
import pool from '../db';
import { optionalAuthMiddleware, AuthRequest } from '../middleware/auth';
import { userHasAccess, userCanTournament } from './progression';

const router = Router();

const BATCH_SIZE = 5;
const POOL_CAP = 30;

// GET /api/questions
router.get('/', optionalAuthMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { domaine, niveau, search, limit = '10', offset = '0', exclude_answered } = req.query;

    // Skip progression gating when search is present (browsing/learning mode)
    if (!search) {
      // Gating progression : l'utilisateur ne peut accéder qu'aux niveaux débloqués
      if (req.user && domaine && niveau) {
        const n = Number(niveau);
        if (n >= 1 && n <= 5) {
          const ok = await userHasAccess(req.user.id, String(domaine), n);
          if (!ok) {
            res.status(403).json({ success: false, error: 'Niveau verrouillé : terminez le niveau précédent à 100%.' });
            return;
          }
        }
      }
      // Mode mixte : exige niveau 5 dans tous les domaines
      if (req.user && !niveau) {
        const allMaxed = await userCanTournament(req.user.id);
        if (!allMaxed) {
          res.status(403).json({ success: false, error: 'Mode mixte verrouillé : atteignez le niveau 5 dans tous les domaines.' });
          return;
        }
      }
    }

    // Batch mode: exclude already-answered questions, cap pool to POOL_CAP
    const isBatchMode = exclude_answered === 'true' && req.user && domaine && niveau;

    const conditions: string[] = ["q.statut = 'valide'"];
    const params: unknown[] = [];
    let idx = 1;

    if (domaine) { conditions.push(`q.domaine = $${idx++}`); params.push(domaine); }
    if (niveau) { conditions.push(`q.niveau = $${idx++}`); params.push(Number(niveau)); }
    if (search) {
      conditions.push(`(q.texte_fr ILIKE $${idx++} OR q.texte_ar ILIKE $${idx++})`);
      params.push(`%${search}%`, `%${search}%`);
    }

    // Cap pool at POOL_CAP and exclude already-answered questions
    if (isBatchMode) {
      conditions.push(`q.id IN (
        SELECT id FROM questions
        WHERE statut = 'valide' AND domaine = $${idx++} AND niveau = $${idx++}
        ORDER BY id LIMIT ${POOL_CAP}
      )`);
      params.push(domaine, Number(niveau));
      conditions.push(`q.id NOT IN (
        SELECT question_id FROM historique_reponses
        WHERE user_id = $${idx++} AND est_correcte = true
      )`);
      params.push(req.user!.id);
    }

    params.push(Number(isBatchMode ? BATCH_SIZE : limit), Number(offset));

    const orderBy = search ? 'ORDER BY q.domaine, q.niveau' : (isBatchMode ? 'ORDER BY q.id' : 'ORDER BY RANDOM()');

    const query = `
      SELECT q.*, json_agg(json_build_object(
        'id', r.id, 'texte_fr', r.texte_fr, 'texte_ar', r.texte_ar, 'est_correcte', r.est_correcte
      ) ORDER BY r.id) AS reponses
      FROM questions q
      LEFT JOIN reponses r ON r.question_id = q.id
      WHERE ${conditions.join(' AND ')}
      GROUP BY q.id
      ${orderBy}
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
