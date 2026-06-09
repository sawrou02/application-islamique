import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Redistribue les questions :
 * 1. madhab-specific → fiqh, madhab = 'general'
 * 2. usul fiqh → fiqh, niveau 4+
 * 3. usul hadith → hadith, niveau 4+
 * 4. domaine 'general' → redistribué par mots-clés, fallback fiqh
 * 5. Tout madhab mis à 'general'
 */
export async function redistribDomaines(client: Client): Promise<void> {
  console.log('Redistribution des domaines et suppression du madhab...');

  // 1. Questions madhab-spécifiques → fiqh
  const r1 = await client.query(`
    UPDATE questions
    SET domaine = 'fiqh', madhab = 'general'
    WHERE madhab IN ('hanafi', 'maliki', 'shafii', 'hanbali')
  `);
  console.log(`  ✓ ${r1.rowCount} questions madhab-spécifiques → fiqh`);

  // 2. Usul Fiqh → fiqh niveau 4+
  const r2 = await client.query(`
    UPDATE questions
    SET domaine = 'fiqh', niveau = GREATEST(niveau, 4), madhab = 'general'
    WHERE domaine = 'usul_fiqh'
       OR sous_domaine ILIKE '%usul%fiqh%'
       OR sous_domaine ILIKE '%sources%droit%'
       OR texte_fr ILIKE '%usul al-fiqh%'
       OR texte_fr ILIKE '%sources de la jurisprudence%'
       OR texte_fr ILIKE '%ijtihad%'
       OR texte_fr ILIKE '%qiyas%'
       OR texte_fr ILIKE '%ijma%'
  `);
  console.log(`  ✓ ${r2.rowCount} questions Usul Fiqh → fiqh niveau 4+`);

  // 3. Usul Hadith → hadith niveau 4+
  const r3 = await client.query(`
    UPDATE questions
    SET domaine = 'hadith', niveau = GREATEST(niveau, 4), madhab = 'general'
    WHERE domaine = 'usul_hadith'
       OR sous_domaine ILIKE '%usul%hadith%'
       OR sous_domaine ILIKE '%sciences%hadith%'
       OR texte_fr ILIKE '%usul al-hadith%'
       OR texte_fr ILIKE '%sciences du hadith%'
       OR texte_fr ILIKE '%isnad%'
       OR texte_fr ILIKE '%matn%'
       OR texte_fr ILIKE '%jarh%'
       OR texte_fr ILIKE '%ta%dil%'
       OR texte_fr ILIKE '%rijal%'
       OR texte_fr ILIKE '%mutawatir%'
       OR texte_fr ILIKE '%ahad%'
  `);
  console.log(`  ✓ ${r3.rowCount} questions Usul Hadith → hadith niveau 4+`);

  // 4. Domaine 'general' → redistribuer par mots-clés (parametres prepares)
  const keywords: Array<{ domaine: string; patterns: string[] }> = [
    { domaine: 'aqida', patterns: ['tawhid', 'aqida', 'croyance', 'foi', 'shirk', 'kufr', 'attributs', 'noms d allah', 'qadar', 'destin', 'predestination', 'paradis', 'enfer', 'resurrection', 'jugement dernier', 'anges', 'prophetes', 'livres reveles'] },
    { domaine: 'hadith', patterns: ['hadith', 'sunnah', 'sahih', 'bukhari', 'muslim', 'abu dawud', 'tirmidhi', 'nasai', 'ibn majah'] },
    { domaine: 'sirah', patterns: ['prophete', 'sirah', 'hijra', 'hegire', 'medine', 'la mecque', 'compagnon', 'sahaba', 'bataille', 'ghazwa', 'mawlid', 'naissance du prophete', 'ascension', 'isra'] },
    { domaine: 'tafsir', patterns: ['coran', 'verset', 'sourate', 'tafsir', 'exegese', 'revelation', 'recitation', 'tajwid', 'qiraat'] },
    { domaine: 'akhlaq', patterns: ['akhlaq', 'moral', 'ethique', 'caractere', 'vertu', 'patience', 'gratitude', 'humilite', 'generosite', 'honnetete', 'sincerite', 'ikhlas', 'tawadu'] },
    { domaine: 'fiqh', patterns: ['salat', 'priere', 'wudu', 'ablution', 'zakat', 'sawm', 'jeune', 'hajj', 'pelerinage', 'halal', 'haram', 'nikah', 'mariage', 'divorce', 'taharah', 'purification', 'janaza', 'funerailles', 'riba', 'usure'] },
  ];

  for (const { domaine, patterns } of keywords) {
    const conditions = patterns
      .map((_, i) => `(texte_fr ILIKE $${i + 2} OR COALESCE(sous_domaine,'') ILIKE $${i + 2})`)
      .join(' OR ');
    const values = [domaine, ...patterns.map(p => `%${p}%`)];
    const res = await client.query(
      `UPDATE questions
       SET domaine = $1, madhab = 'general'
       WHERE domaine = 'general'
         AND (${conditions})`,
      values
    );
    if (res.rowCount && res.rowCount > 0) {
      console.log(`  ✓ ${res.rowCount} questions général → ${domaine}`);
    }
  }

  // Reste de 'general' → fiqh par défaut
  const rFallback = await client.query(`
    UPDATE questions
    SET domaine = 'fiqh', madhab = 'general'
    WHERE domaine = 'general'
  `);
  console.log(`  ✓ ${rFallback.rowCount} questions général restantes → fiqh (fallback)`);

  // 5. S'assurer que tout madhab est 'general'
  const rMadhab = await client.query(`
    UPDATE questions SET madhab = 'general'
    WHERE madhab IS NULL OR madhab NOT IN ('general')
  `);
  console.log(`  ✓ ${rMadhab.rowCount} questions madhab normalisé à 'general'`);

  console.log('Redistribution terminée.');
}

if (require.main === module) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  client.connect().then(async () => {
    await redistribDomaines(client);
    await client.end();
  }).catch(err => { console.error(err); process.exit(1); });
}
