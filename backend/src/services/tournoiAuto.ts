import pool from '../db';

const THEMES_PAR_JOUR = ['fiqh', 'aqida', 'sirah', 'akhlaq', 'tafsir', 'fiqh', 'aqida'];

const THEMES_NOM_AR: Record<string, string> = {
  fiqh: 'الفقه',
  aqida: 'العقيدة',
  sirah: 'السيرة',
  akhlaq: 'الأخلاق',
  tafsir: 'التفسير',
};

/**
 * Vérifie qu'un tournoi public est actif ; sinon en crée un nouveau pour 24h.
 */
export async function ensureTournoiPublicActif(): Promise<void> {
  try {
    const existing = await pool.query(
      `SELECT id FROM tournois
       WHERE est_public = true
         AND date_debut <= NOW()
         AND date_fin   >  NOW()
       ORDER BY date_debut DESC LIMIT 1`
    );
    if (existing.rows.length > 0) return;

    const now = new Date();
    const fin = new Date(now.getTime() + 24 * 3600 * 1000);
    const theme = THEMES_PAR_JOUR[now.getDay()];
    const dateStr = now.toISOString().slice(0, 10);
    const nom = `Tournoi Mondial — ${dateStr}`;
    const nomAr = `بطولة عالمية — ${dateStr}`;

    await pool.query(
      `INSERT INTO tournois
        (nom, nom_ar, theme, description, date_debut, date_fin, statut, est_public, auto_genere)
       VALUES ($1, $2, $3, $4, $5, $6, 'ouvert', true, true)`,
      [
        nom,
        nomAr,
        theme,
        `Compétition ouverte à tous les utilisateurs — thème : ${THEMES_NOM_AR[theme] || theme}`,
        now,
        fin,
      ]
    );
    console.log(`[tournoiAuto] Nouveau tournoi public créé : ${nom} (${theme})`);
  } catch (err) {
    console.error('[tournoiAuto] erreur ensureTournoiPublicActif:', err);
  }
}

/**
 * Clôt les tournois publics expirés et calcule les rangs finaux.
 */
export async function cloturerTournoisExpires(): Promise<void> {
  try {
    const expires = await pool.query(
      `SELECT id FROM tournois
       WHERE est_public = true AND statut = 'ouvert' AND date_fin <= NOW()`
    );
    for (const row of expires.rows) {
      await pool.query(
        `WITH ranked AS (
           SELECT id, ROW_NUMBER() OVER (ORDER BY points DESC, joined_at ASC) AS r
           FROM tournoi_participants WHERE tournoi_id = $1
         )
         UPDATE tournoi_participants tp
         SET rang = ranked.r
         FROM ranked WHERE tp.id = ranked.id`,
        [row.id]
      );
      await pool.query("UPDATE tournois SET statut = 'termine' WHERE id = $1", [row.id]);
      console.log(`[tournoiAuto] Tournoi clôturé : ${row.id}`);
    }
  } catch (err) {
    console.error('[tournoiAuto] erreur cloturerTournoisExpires:', err);
  }
}

/**
 * Démarre la boucle de surveillance : check immédiat puis toutes les heures.
 */
export function startTournoiAuto(): void {
  const tick = async () => {
    await cloturerTournoisExpires();
    await ensureTournoiPublicActif();
  };
  tick();
  setInterval(tick, 60 * 60 * 1000);
  console.log('[tournoiAuto] Service démarré (check horaire)');
}
