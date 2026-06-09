import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Nettoyage :
 * 1. Détecte et supprime les doublons (même texte_fr)
 * 2. Détecte et supprime les quasi-doublons (texte_fr identique en ignorant ponctuation/casse)
 * 3. Audit : compte les questions par domaine/niveau après nettoyage
 */
export async function cleanupDuplicates(client: Client): Promise<void> {
  console.log('🔍 Recherche des doublons...');

  // 1. Doublons exacts (même texte_fr)
  const exact = await client.query(`
    SELECT texte_fr, COUNT(*) as nb, array_agg(id) as ids
    FROM questions
    WHERE statut = 'valide'
    GROUP BY texte_fr
    HAVING COUNT(*) > 1
  `);
  console.log(`  ${exact.rows.length} groupes de doublons exacts détectés`);

  let deleted = 0;
  for (const row of exact.rows) {
    // Garde l'ID le plus enrichi (avec hadith_texte_ar / verset_ar / explication_detaillee)
    const ids: string[] = row.ids;
    const scored = await client.query(
      `SELECT id,
              (CASE WHEN hadith_texte_ar IS NOT NULL AND hadith_texte_ar <> '' THEN 1 ELSE 0 END +
               CASE WHEN verset_ar IS NOT NULL AND verset_ar <> '' THEN 1 ELSE 0 END +
               CASE WHEN parole_savant_texte IS NOT NULL AND parole_savant_texte <> '' THEN 1 ELSE 0 END +
               CASE WHEN explication_detaillee IS NOT NULL AND explication_detaillee <> '' THEN 1 ELSE 0 END +
               CASE WHEN texte_ar IS NOT NULL AND texte_ar <> '' THEN 1 ELSE 0 END) as score
       FROM questions WHERE id = ANY($1::uuid[])
       ORDER BY score DESC, id ASC`,
      [ids]
    );
    const keep = scored.rows[0].id;
    const toDelete = ids.filter(id => id !== keep);
    if (toDelete.length > 0) {
      await client.query(`DELETE FROM reponses WHERE question_id = ANY($1::uuid[])`, [toDelete]);
      await client.query(`DELETE FROM questions WHERE id = ANY($1::uuid[])`, [toDelete]);
      deleted += toDelete.length;
    }
  }
  console.log(`  ✓ ${deleted} doublons exacts supprimés`);

  // 2. Quasi-doublons (texte normalisé : minuscules, sans ponctuation, sans espaces multiples)
  const fuzzy = await client.query(`
    SELECT
      LOWER(REGEXP_REPLACE(REGEXP_REPLACE(texte_fr, '[[:punct:]]', '', 'g'), '\\s+', ' ', 'g')) as norm,
      COUNT(*) as nb,
      array_agg(id) as ids
    FROM questions
    WHERE statut = 'valide'
    GROUP BY norm
    HAVING COUNT(*) > 1
  `);
  console.log(`  ${fuzzy.rows.length} groupes de quasi-doublons détectés`);

  let deletedFuzzy = 0;
  for (const row of fuzzy.rows) {
    const ids: string[] = row.ids;
    const scored = await client.query(
      `SELECT id,
              (CASE WHEN hadith_texte_ar IS NOT NULL AND hadith_texte_ar <> '' THEN 1 ELSE 0 END +
               CASE WHEN verset_ar IS NOT NULL AND verset_ar <> '' THEN 1 ELSE 0 END +
               CASE WHEN explication_detaillee IS NOT NULL AND explication_detaillee <> '' THEN 1 ELSE 0 END) as score
       FROM questions WHERE id = ANY($1::uuid[])
       ORDER BY score DESC, id ASC`,
      [ids]
    );
    const keep = scored.rows[0].id;
    const toDelete = ids.filter(id => id !== keep);
    if (toDelete.length > 0) {
      await client.query(`DELETE FROM reponses WHERE question_id = ANY($1::uuid[])`, [toDelete]);
      await client.query(`DELETE FROM questions WHERE id = ANY($1::uuid[])`, [toDelete]);
      deletedFuzzy += toDelete.length;
    }
  }
  console.log(`  ✓ ${deletedFuzzy} quasi-doublons supprimés`);

  // 3. Vérification incohérence dalil : nettoyer les dalil ambigus
  // Si le hadith_ref contient un narrateur mais pas le hadith_texte_ar, on retire le narrateur
  const fixRef = await client.query(`
    UPDATE questions
    SET hadith_ref = NULL, hadith_texte_ar = NULL, hadith_texte_fr = NULL
    WHERE (hadith_texte_ar IS NULL OR hadith_texte_ar = '')
      AND (hadith_texte_fr IS NULL OR hadith_texte_fr = '')
      AND hadith_ref IS NOT NULL
      AND hadith_ref LIKE '%Rapporté par%'
  `);
  console.log(`  ✓ ${fixRef.rowCount} références hadith vides nettoyées`);

  // 4. Total final
  const total = await client.query(`SELECT COUNT(*) FROM questions WHERE statut = 'valide'`);
  console.log(`\n📊 Total questions après nettoyage : ${total.rows[0].count}`);
}

if (require.main === module) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  client.connect().then(async () => {
    await cleanupDuplicates(client);
    await client.end();
  }).catch(err => { console.error(err); process.exit(1); });
}
