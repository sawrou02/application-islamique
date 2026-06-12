import { Router, Response } from 'express';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const DOMAINS = ['fiqh', 'aqida', 'tafsir', 'hadith', 'sirah', 'akhlaq'];
const LEVELS = [1, 2, 3, 4, 5];

type LevelStat = { answered: number; total: number; completed: boolean };
type DomainProgress = { unlocked_max: number; levels: Record<number, LevelStat> };

// GET /api/progression/me
// Renvoie la progression de l'utilisateur : pour chaque (domaine, niveau),
// nombre de questions répondues correctement au moins une fois.
// Un niveau N+1 est débloqué quand le niveau N est à 100 %.
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user!.id;

    const totalsRes = await pool.query(
      `SELECT domaine, niveau, COUNT(*)::int AS total
       FROM questions WHERE statut = 'valide'
       GROUP BY domaine, niveau`
    );

    const correctRes = await pool.query(
      `SELECT q.domaine, q.niveau, COUNT(DISTINCT h.question_id)::int AS answered
       FROM historique_reponses h
       JOIN questions q ON q.id = h.question_id
       WHERE h.user_id = $1 AND h.est_correcte = true AND q.statut = 'valide'
       GROUP BY q.domaine, q.niveau`,
      [user_id]
    );

    const totalsMap = new Map<string, number>();
    for (const r of totalsRes.rows) totalsMap.set(`${r.domaine}-${r.niveau}`, r.total);
    const answeredMap = new Map<string, number>();
    for (const r of correctRes.rows) answeredMap.set(`${r.domaine}-${r.niveau}`, r.answered);

    const domains: Record<string, DomainProgress> = {};
    for (const d of DOMAINS) {
      const levels: Record<number, LevelStat> = {};
      let unlocked_max = 1;
      for (const n of LEVELS) {
        const total = totalsMap.get(`${d}-${n}`) || 0;
        const answered = Math.min(answeredMap.get(`${d}-${n}`) || 0, total);
        const completed = total > 0 && answered >= total;
        levels[n] = { answered, total, completed };
        if (completed && n === unlocked_max && n < 5) unlocked_max = n + 1;
      }
      domains[d] = { unlocked_max, levels };
    }

    const allMaxed = DOMAINS.every(d => domains[d].levels[5].completed);

    res.json({
      success: true,
      data: { domains, can_tournament: allMaxed, can_mixte: allMaxed },
    });
  } catch (err) {
    console.error('Progression error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Vérifie qu'un user a accès à un (domaine, niveau)
export async function userHasAccess(user_id: string, domaine: string, niveau: number): Promise<boolean> {
  if (niveau === 1) return true;
  // Toutes les questions du niveau (niveau - 1) doivent avoir été répondues correctement
  const prev = niveau - 1;
  const r = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM questions WHERE statut='valide' AND domaine=$1 AND niveau=$2)::int AS total,
       (SELECT COUNT(DISTINCT h.question_id) FROM historique_reponses h
          JOIN questions q ON q.id = h.question_id
         WHERE h.user_id = $3 AND h.est_correcte = true
           AND q.statut='valide' AND q.domaine=$1 AND q.niveau=$2)::int AS answered`,
    [domaine, prev, user_id]
  );
  const { total, answered } = r.rows[0];
  if (total === 0) return true;
  if (answered >= total) {
    return niveau === prev + 1 ? true : await userHasAccess(user_id, domaine, prev);
  }
  return false;
}

// Vérifie qu'un user peut accéder au tournoi (niveau 5 dans tous les domaines)
export async function userCanTournament(user_id: string): Promise<boolean> {
  const r = await pool.query(
    `WITH totals AS (
       SELECT domaine, COUNT(*)::int AS total
       FROM questions WHERE statut='valide' AND niveau=5
       GROUP BY domaine
     ), answered AS (
       SELECT q.domaine, COUNT(DISTINCT h.question_id)::int AS n
       FROM historique_reponses h
       JOIN questions q ON q.id = h.question_id
       WHERE h.user_id=$1 AND h.est_correcte=true AND q.statut='valide' AND q.niveau=5
       GROUP BY q.domaine
     )
     SELECT t.domaine, t.total, COALESCE(a.n,0) AS answered
     FROM totals t LEFT JOIN answered a USING (domaine)`,
    [user_id]
  );
  if (r.rows.length < 6) return false;
  return r.rows.every(x => x.answered >= x.total);
}

export default router;
