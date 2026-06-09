import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Updates hadith_ref and parole_savant_ref to include narrator and grade
// Format for hadith_ref: "Rapporté par [Sahaba] رضي الله عنه | [Collection] | [Grade]"
// Format for parole_savant_ref: "[Savant] | [Source]"

const HADITH_UPDATES: Array<{
  keywords: string[];
  hadith_narrator: string;
  hadith_collection: string;
  hadith_grade: string;
}> = [
  // AQIDA
  {
    keywords: ['tawhid', 'unicité', 'shahada'],
    hadith_narrator: "Rapporté par Abdullah ibn Umar رضي الله عنهما",
    hadith_collection: "Sahih al-Bukhari n°7372 ; Sahih Muslim n°22",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['shirk', 'associationnisme'],
    hadith_narrator: "Rapporté par Abdullah ibn Masud رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°6001 ; Sahih Muslim n°86",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['noms', 'attributs', 'asma'],
    hadith_narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°2736 ; Sahih Muslim n°2677",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['qadar', 'destin', 'prédestination'],
    hadith_narrator: "Rapporté par Umar ibn al-Khattab رضي الله عنه",
    hadith_collection: "Sahih Muslim n°8 (Hadith de Jibril)",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['arkan', 'cinq piliers', 'pilliers'],
    hadith_narrator: "Rapporté par Abdullah ibn Umar رضي الله عنهما",
    hadith_collection: "Sahih al-Bukhari n°8 ; Sahih Muslim n°16",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['akhira', 'paradis', 'serviteurs', 'récompense'],
    hadith_narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°3244 ; Sahih Muslim n°2824",
    hadith_grade: "Hadith Sahih (Hadith Qudsi)",
  },
  {
    keywords: ['prophetologie', 'prophète', 'sceau', 'khatam'],
    hadith_narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°3535 ; Sahih Muslim n°2286",
    hadith_grade: "Hadith Sahih",
  },
  // FIQH
  {
    keywords: ['salat', 'prière', 'obligation de la prière'],
    hadith_narrator: "Rapporté par Abdullah ibn Masud رضي الله عنه",
    hadith_collection: "Sunan at-Tirmidhi n°2621",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['taharah', 'purification', 'wudu', 'ablution'],
    hadith_narrator: "Rapporté par Abu Malik al-Ash'ari رضي الله عنه",
    hadith_collection: "Sahih Muslim n°223",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['zakat', 'aumône obligatoire'],
    hadith_narrator: "Rapporté par Abdullah ibn Umar رضي الله عنهما",
    hadith_collection: "Sahih al-Bukhari n°8 ; Sahih Muslim n°16",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['sawm', 'jeûne', 'ramadan'],
    hadith_narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°1903",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['hajj', 'pèlerinage'],
    hadith_narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°1521 ; Sahih Muslim n°1350",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['nikah', 'mariage'],
    hadith_narrator: "Rapporté par Abdullah ibn Masud رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°5066 ; Sahih Muslim n°1400",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['riba', 'intérêt', 'usure'],
    hadith_narrator: "Rapporté par Jabir ibn Abdillah رضي الله عنه",
    hadith_collection: "Sahih Muslim n°1598",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['janaza', 'funérailles', 'mort'],
    hadith_narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°1301 ; Sahih Muslim n°944",
    hadith_grade: "Hadith Sahih",
  },
  // AKHLAQ
  {
    keywords: ['birr', 'parents', 'obéissance aux parents'],
    hadith_narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°5971 ; Sahih Muslim n°2548",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['patience', 'sabr'],
    hadith_narrator: "Rapporté par Suhayb ar-Rumi رضي الله عنه",
    hadith_collection: "Sahih Muslim n°2999",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['ghiba', 'médisance', 'calomnie'],
    hadith_narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    hadith_collection: "Sahih Muslim n°2589",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['ikhlas', 'sincérité', 'intention'],
    hadith_narrator: "Rapporté par Umar ibn al-Khattab رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°1 ; Sahih Muslim n°1907",
    hadith_grade: "Hadith Sahih — 1er hadith du Bukhari",
  },
  {
    keywords: ['dhikr', 'rappel', 'invocation'],
    hadith_narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°7405 (Hadith Qudsi)",
    hadith_grade: "Hadith Sahih (Hadith Qudsi)",
  },
  {
    keywords: ['tawba', 'repentir'],
    hadith_narrator: "Rapporté par Abu Musa al-Ash'ari رضي الله عنه",
    hadith_collection: "Sahih Muslim n°2758",
    hadith_grade: "Hadith Sahih",
  },
  // SIRAH
  {
    keywords: ['naissance', 'nativité', 'mawlid'],
    hadith_narrator: "Rapporté par Abu Qatada رضي الله عنه",
    hadith_collection: "Sahih Muslim n°1162",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['révélation', 'wahy', 'première révélation'],
    hadith_narrator: "Rapporté par Aïcha رضي الله عنها",
    hadith_collection: "Sahih al-Bukhari n°3 ; Sahih Muslim n°160",
    hadith_grade: "Hadith Sahih — Hadith de la première révélation",
  },
  {
    keywords: ['hijra', 'migration', 'hégire'],
    hadith_narrator: "Rapporté par Umar ibn al-Khattab رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°1 ; Sahih Muslim n°1907",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['arba\'in', 'quarante', 'intention', 'actions'],
    hadith_narrator: "Rapporté par Umar ibn al-Khattab رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°1 ; Sahih Muslim n°1907",
    hadith_grade: "Hadith Sahih — Base des 40 hadiths de l'Imam Nawawi",
  },
  // TAFSIR
  {
    keywords: ['fatiha', 'ouverture'],
    hadith_narrator: "Rapporté par Abu Sa'id al-Mu'alla رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°5006",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['ayat kursi', 'verset du trône'],
    hadith_narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°5010 ; Sahih Muslim n°810",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['ulum quran', 'sciences du coran', 'tajwid', 'récitation'],
    hadith_narrator: "Rapporté par Uthman ibn Affan رضي الله عنه",
    hadith_collection: "Sahih al-Bukhari n°5027",
    hadith_grade: "Hadith Sahih",
  },
  {
    keywords: ['usul fiqh', 'sources', 'jurisprudence'],
    hadith_narrator: "Rapporté par Muadh ibn Jabal رضي الله عنه",
    hadith_collection: "Sunan Abi Dawud n°3592",
    hadith_grade: "Hadith Hasan — jugé hasan par al-Albani",
  },
];

export async function enrichHadithNarrator(client: Client): Promise<void> {
  console.log('Enriching hadith_ref with narrator and authenticity...');
  let updated = 0;

  for (const rule of HADITH_UPDATES) {
    const newRef = `${rule.hadith_narrator} | ${rule.hadith_collection} | ${rule.hadith_grade}`;

    // Update questions matching these keywords that have hadith_texte_ar
    const keywordConditions = rule.keywords.map((_, i) => `(q.texte_fr ILIKE $${i + 2} OR q.domaine ILIKE $${i + 2})`).join(' OR ');
    const values = [newRef, ...rule.keywords.map(k => `%${k}%`)];

    const res = await client.query(
      `UPDATE questions q SET hadith_ref = $1
       WHERE hadith_texte_ar IS NOT NULL AND hadith_texte_ar != ''
       AND hadith_ref IS NOT NULL
       AND (${keywordConditions})
       AND hadith_ref NOT LIKE '%|%'`,
      values
    );
    updated += res.rowCount || 0;
  }

  // Also update parole_savant_ref to ensure format: "Savant (dates) | Ouvrage"
  await client.query(`
    UPDATE questions
    SET parole_savant_ref = REGEXP_REPLACE(
      parole_savant_ref,
      '^(.+?),\\s*(.+)$',
      '\\1 | \\2'
    )
    WHERE parole_savant_ref IS NOT NULL
    AND parole_savant_ref NOT LIKE '%|%'
    AND parole_savant_ref LIKE '%,%'
  `);

  console.log(`Hadith narrator enrichment: ${updated} questions updated.`);
}

// Run standalone
if (require.main === module) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  client.connect().then(async () => {
    await enrichHadithNarrator(client);
    await client.end();
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
