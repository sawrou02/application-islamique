import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Détecte et nettoie les dalils incohérents :
 *  - Extrait les mots significatifs (>4 lettres) de la question
 *  - Vérifie qu'au moins UN apparaît dans le hadith/verset/explication associés
 *  - Sinon : supprime le dalil enrichi (laisse une chance d'avoir un dalil propre plus tard)
 */

const STOPWORDS = new Set([
  'allah', 'islam', 'musulman', 'musulmane', 'musulmans', 'musulmanes',
  'prophete', 'prophète', 'messager', 'celui', 'celle', 'ceux', 'celles',
  'quels', 'quelle', 'quelles', 'comment', 'combien', 'quand', 'pourquoi',
  'lequel', 'laquelle', 'dans', 'pour', 'avec', 'sans', 'sous', 'sur',
  'leur', 'leurs', 'notre', 'votre', 'nos', 'vos', 'mes', 'tes', 'ses',
  'etre', 'être', 'avoir', 'cela', 'cette', 'cetui', 'autre', 'autres',
  'plus', 'moins', 'meme', 'même', 'tout', 'tous', 'toute', 'toutes',
  'sont', 'etait', 'était', 'etaient', 'étaient', 'pas',
  'ainsi', 'donc', 'mais', 'puis', 'alors',
]);

function tokens(text: string): Set<string> {
  if (!text) return new Set();
  const cleaned = text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // retire les accents
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 4 && !STOPWORDS.has(w));
  return new Set(cleaned);
}

function hasOverlap(a: Set<string>, b: Set<string>): boolean {
  for (const w of a) if (b.has(w)) return true;
  return false;
}

export async function cleanupDalil(client: Client): Promise<void> {
  console.log('🔍 Audit des dalils incohérents...');

  const res = await client.query(`
    SELECT id, texte_fr, explication, explication_detaillee,
           hadith_texte_fr, hadith_texte_ar, hadith_ref,
           verset_fr, verset_ar, verset_ref,
           parole_savant_texte, parole_savant_ref
    FROM questions
    WHERE statut = 'valide'
      AND (hadith_texte_fr IS NOT NULL OR verset_fr IS NOT NULL OR parole_savant_texte IS NOT NULL)
  `);

  let clearedHadith = 0;
  let clearedVerset = 0;
  let clearedSavant = 0;

  for (const q of res.rows) {
    const qWords = tokens(q.texte_fr + ' ' + (q.explication || '') + ' ' + (q.explication_detaillee || ''));

    // Hadith
    if (q.hadith_texte_fr) {
      const hWords = tokens(q.hadith_texte_fr);
      if (!hasOverlap(qWords, hWords)) {
        await client.query(
          `UPDATE questions SET hadith_texte_fr = NULL, hadith_texte_ar = NULL, hadith_texte_en = NULL, hadith_ref = NULL WHERE id = $1`,
          [q.id]
        );
        clearedHadith++;
      }
    }

    // Verset
    if (q.verset_fr) {
      const vWords = tokens(q.verset_fr);
      if (!hasOverlap(qWords, vWords)) {
        await client.query(
          `UPDATE questions SET verset_fr = NULL, verset_ar = NULL, verset_en = NULL, verset_ref = NULL WHERE id = $1`,
          [q.id]
        );
        clearedVerset++;
      }
    }

    // Parole savant — moins critique, garde-la par défaut
    if (q.parole_savant_texte) {
      const pWords = tokens(q.parole_savant_texte);
      if (!hasOverlap(qWords, pWords)) {
        await client.query(
          `UPDATE questions SET parole_savant_texte = NULL, parole_savant_en = NULL, parole_savant_ref = NULL WHERE id = $1`,
          [q.id]
        );
        clearedSavant++;
      }
    }
  }

  console.log(`  ✓ ${clearedHadith} hadiths incohérents supprimés`);
  console.log(`  ✓ ${clearedVerset} versets incohérents supprimés`);
  console.log(`  ✓ ${clearedSavant} paroles de savants incohérentes supprimées`);

  // Stats après
  const stats = await client.query(`
    SELECT
      COUNT(*) FILTER (WHERE hadith_texte_fr IS NOT NULL) as nb_hadith,
      COUNT(*) FILTER (WHERE verset_fr IS NOT NULL) as nb_verset,
      COUNT(*) FILTER (WHERE parole_savant_texte IS NOT NULL) as nb_savant,
      COUNT(*) as total
    FROM questions WHERE statut = 'valide'
  `);
  const s = stats.rows[0];
  console.log(`\n📊 Sur ${s.total} questions :`);
  console.log(`   ${s.nb_hadith} ont un hadith authentique associé`);
  console.log(`   ${s.nb_verset} ont un verset coranique`);
  console.log(`   ${s.nb_savant} ont une parole de savant`);
}

if (require.main === module) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  client.connect().then(async () => {
    await cleanupDalil(client);
    await client.end();
  }).catch(err => { console.error(err); process.exit(1); });
}
