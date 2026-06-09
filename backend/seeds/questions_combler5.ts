import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

interface Question {
  texte_fr: string;
  texte_ar?: string;
  domaine: string;
  niveau: number;
  reponses: { texte_fr: string; texte_ar?: string; est_correcte: boolean }[];
  dalil?: { type: string; texte_fr: string; texte_ar?: string; reference?: string; grade_hadith?: string };
  explication_fr?: string;
}

const questions: Question[] = [
  // AKHLAQ N3 (+1)
  {
    texte_fr: "Qu'est-ce que la 'Muruu'a' (virilité morale) en islam ?",
    texte_ar: "ما هي 'المروءة' في الإسلام؟",
    domaine: 'akhlaq', niveau: 3,
    reponses: [
      { texte_fr: "L'ensemble des qualités nobles : générosité, pudeur, courage, loyauté", texte_ar: "مجموعة الصفات النبيلة: الكرم والحياء والشجاعة والوفاء", est_correcte: true },
      { texte_fr: "La force physique uniquement", texte_ar: "القوة الجسدية فقط", est_correcte: false },
      { texte_fr: "La richesse et le prestige social", texte_ar: "الثروة والمكانة الاجتماعية", est_correcte: false },
      { texte_fr: "L'érudition religieuse exclusive", texte_ar: "العلم الديني وحده", est_correcte: false },
    ],
    explication_fr: "La Muruu'a désigne l'ensemble des vertus qui font la dignité de l'homme : générosité, pudeur, loyauté, courage dans la vérité.",
  },

  // AKHLAQ N4 (+4)
  {
    texte_fr: "Quel est le lien entre l'Ihsan et la conscience d'Allah (Muraqaba) ?",
    texte_ar: "ما العلاقة بين الإحسان والمراقبة؟",
    domaine: 'akhlaq', niveau: 4,
    reponses: [
      { texte_fr: "L'Ihsan est défini par la Muraqaba : adorer Allah comme si tu Le voyais", texte_ar: "الإحسان هو عبادة الله كأنك تراه، وهذا هو جوهر المراقبة", est_correcte: true },
      { texte_fr: "La Muraqaba est une pratique soufie sans lien avec l'Ihsan", texte_ar: "المراقبة ممارسة صوفية لا علاقة لها بالإحسان", est_correcte: false },
      { texte_fr: "L'Ihsan concerne les actes extérieurs, la Muraqaba les états intérieurs", texte_ar: "الإحسان للأعمال الظاهرة والمراقبة للأحوال الباطنة", est_correcte: false },
      { texte_fr: "Ce sont deux notions indépendantes", texte_ar: "هما مفهومان مستقلان", est_correcte: false },
    ],
    dalil: { type: 'hadith', texte_fr: "L'Ihsan, c'est adorer Allah comme si tu Le voyais ; si tu ne Le vois pas, certes Lui te voit.", texte_ar: "الإحسان أن تعبد الله كأنك تراه، فإن لم تكن تراه فإنه يراك", reference: "Sahih Muslim 8", grade_hadith: "Sahih" },
  },
  {
    texte_fr: "Qu'est-ce que le 'Qana'a' (contentement) selon les savants ?",
    texte_ar: "ما هو 'القناعة' عند العلماء؟",
    domaine: 'akhlaq', niveau: 4,
    reponses: [
      { texte_fr: "Se satisfaire de ce qu'Allah a accordé sans en demander davantage par convoitise", texte_ar: "الرضا بما قسم الله دون طلب الزيادة بالحرص", est_correcte: true },
      { texte_fr: "Abandonner tout effort de travail", texte_ar: "ترك العمل والكسب", est_correcte: false },
      { texte_fr: "S'abstenir de tout achat", texte_ar: "الامتناع عن أي شراء", est_correcte: false },
      { texte_fr: "Refuser les dons et cadeaux", texte_ar: "رفض الهبات والهدايا", est_correcte: false },
    ],
    dalil: { type: 'hadith', texte_fr: "La véritable richesse n'est pas l'abondance des biens, mais la richesse de l'âme.", texte_ar: "ليس الغنى عن كثرة العَرَض، ولكن الغنى غنى النفس", reference: "Sahih Bukhari 6446", grade_hadith: "Sahih" },
  },
  {
    texte_fr: "Comment l'islam définit-il la 'Najdah' (bravoure altruiste) ?",
    texte_ar: "كيف يعرف الإسلام 'النجدة'؟",
    domaine: 'akhlaq', niveau: 4,
    reponses: [
      { texte_fr: "Secourir autrui au péril de sa propre sécurité par devoir moral", texte_ar: "إغاثة الآخرين على حساب سلامة النفس واجبًا أخلاقيًا", est_correcte: true },
      { texte_fr: "La bravoure militaire uniquement", texte_ar: "الشجاعة العسكرية فقط", est_correcte: false },
      { texte_fr: "L'aide financière aux nécessiteux", texte_ar: "المساعدة المالية للمحتاجين", est_correcte: false },
      { texte_fr: "L'audace dans la parole", texte_ar: "الجرأة في الكلام", est_correcte: false },
    ],
    explication_fr: "La Najdah est la vertu islamique consistant à voler au secours d'autrui sans calcul personnel, incarnée par les Sahaba qui sacrifiaient leur vie pour protéger les autres.",
  },
  {
    texte_fr: "Quel est le rang moral de celui qui abandonne le mal par honte des gens mais pas par crainte d'Allah ?",
    texte_ar: "ما مرتبة من يترك المعصية حياءً من الناس لا خشيةً من الله؟",
    domaine: 'akhlaq', niveau: 4,
    reponses: [
      { texte_fr: "C'est insuffisant : le vrai haya' doit être dirigé vers Allah avant tout", texte_ar: "ذلك غير كافٍ: الحياء الحقيقي يجب أن يكون أولًا من الله", est_correcte: true },
      { texte_fr: "C'est suffisant pour la vertu islamique", texte_ar: "هذا كافٍ للفضيلة الإسلامية", est_correcte: false },
      { texte_fr: "C'est un degré supérieur car il protège la société", texte_ar: "هذا درجة أعلى لأنه يحمي المجتمع", est_correcte: false },
      { texte_fr: "Cela équivaut au haya' envers Allah", texte_ar: "هذا يعادل الحياء من الله", est_correcte: false },
    ],
    explication_fr: "La pudeur (haya') la plus élevée est celle d'Allah. Agir par honte sociale sans conscience divine est une vertu incomplète selon les savants.",
  },

  // AKHLAQ N5 (+2)
  {
    texte_fr: "Qu'est-ce que 'l'Ithar' (altruisme) et quel en est le degré suprême ?",
    texte_ar: "ما هو 'الإيثار' وما أعلى درجاته؟",
    domaine: 'akhlaq', niveau: 5,
    reponses: [
      { texte_fr: "Préférer autrui à soi-même, et son degré suprême est de donner alors qu'on est soi-même dans le besoin", texte_ar: "تفضيل الآخر على النفس، وأعلى درجاته الإعطاء مع الحاجة الشخصية", est_correcte: true },
      { texte_fr: "Donner beaucoup en période d'abondance", texte_ar: "العطاء الكثير في وقت الرخاء", est_correcte: false },
      { texte_fr: "Partager la moitié de ses biens", texte_ar: "مشاركة نصف الممتلكات", est_correcte: false },
      { texte_fr: "Secourir uniquement les proches", texte_ar: "مساعدة الأقارب فقط", est_correcte: false },
    ],
    dalil: { type: 'verset', texte_fr: "Ils préfèrent [les Muhajirin] à eux-mêmes, quand bien même ils seraient dans le besoin.", texte_ar: "وَيُؤْثِرُونَ عَلَىٰ أَنفُسِهِمْ وَلَوْ كَانَ بِهِمْ خَصَاصَةٌ", reference: "Coran 59:9" },
  },
  {
    texte_fr: "Selon Ibn al-Qayyim, quelles sont les causes de la mort du cœur ?",
    texte_ar: "ما أسباب موت القلب عند ابن القيم؟",
    domaine: 'akhlaq', niveau: 5,
    reponses: [
      { texte_fr: "L'ignorance d'Allah, la négligence du dhikr, les péchés accumulés et les mauvaises fréquentations", texte_ar: "الجهل بالله وترك الذكر وتراكم الذنوب وسوء الصحبة", est_correcte: true },
      { texte_fr: "La maladie physique et la pauvreté", texte_ar: "المرض الجسدي والفقر", est_correcte: false },
      { texte_fr: "L'excès d'adoration sans connaissance", texte_ar: "الإفراط في العبادة دون علم", est_correcte: false },
      { texte_fr: "La solitude et l'isolement social", texte_ar: "العزلة والانعزال الاجتماعي", est_correcte: false },
    ],
    explication_fr: "Ibn al-Qayyim dans 'Ighathat al-Lahfan' décrit la mort du cœur comme le fruit de l'accumulation de péchés, de la négligence du dhikr et de la mauvaise compagnie.",
  },

  // HADITH N4 (+4)
  {
    texte_fr: "Qu'est-ce qu'un hadith 'Mawquf' ?",
    texte_ar: "ما هو الحديث الموقوف؟",
    domaine: 'hadith', niveau: 4,
    reponses: [
      { texte_fr: "Un hadith dont la chaîne s'arrête au Compagnon sans remonter au Prophète", texte_ar: "حديث تنتهي سلسلته عند الصحابي دون أن ترفع إلى النبي", est_correcte: true },
      { texte_fr: "Un hadith faible dont la transmission est suspendue", texte_ar: "حديث ضعيف معلق الإسناد", est_correcte: false },
      { texte_fr: "Un hadith dont l'authenticité est controversée", texte_ar: "حديث مختلف في صحته", est_correcte: false },
      { texte_fr: "Un hadith rapporté par un seul transmetteur", texte_ar: "حديث رواه راوٍ واحد", est_correcte: false },
    ],
    explication_fr: "Le Mawquf s'arrête au niveau du Compagnon (Sahabi). S'il s'arrête au Tabi'i, il est dit 'Maqtu''.",
  },
  {
    texte_fr: "Quelle est la différence entre 'Tadlis' et 'Irsal' dans la critique du hadith ?",
    texte_ar: "ما الفرق بين التدليس والإرسال في علم الحديث؟",
    domaine: 'hadith', niveau: 4,
    reponses: [
      { texte_fr: "Le Tadlis masque délibérément une rupture, l'Irsal omet simplement un maillon sans intention de tromper", texte_ar: "التدليس يخفي انقطاعًا عمدًا، والإرسال يحذف حلقة دون قصد التضليل", est_correcte: true },
      { texte_fr: "Ce sont deux termes synonymes pour une chaîne incomplète", texte_ar: "مصطلحان مترادفان للإسناد المنقطع", est_correcte: false },
      { texte_fr: "L'Irsal est plus grave car il concerne le texte du hadith", texte_ar: "الإرسال أشد لأنه يتعلق بمتن الحديث", est_correcte: false },
      { texte_fr: "Le Tadlis concerne uniquement les Compagnons", texte_ar: "التدليس يخص الصحابة فحسب", est_correcte: false },
    ],
    explication_fr: "Le Tadlis implique une dissimulation intentionnelle d'une rupture de chaîne, tandis que l'Irsal (hadith Mursal) est simplement un oubli ou omission de maillon.",
  },
  {
    texte_fr: "Qu'est-ce qu'un hadith 'Ma'lul' (défectueux) ?",
    texte_ar: "ما هو الحديث المعلول؟",
    domaine: 'hadith', niveau: 4,
    reponses: [
      { texte_fr: "Un hadith dont l'apparence est correcte mais qui contient un défaut caché ('illa) décelé par les experts", texte_ar: "حديث ظاهره الصحة لكنه يحمل علة خفية يكتشفها النقاد", est_correcte: true },
      { texte_fr: "Un hadith avec des mots inconnus dans son texte", texte_ar: "حديث يحتوي على ألفاظ غريبة في متنه", est_correcte: false },
      { texte_fr: "Un hadith dont le transmetteur est accusé de mensonge", texte_ar: "حديث اتُّهم راويه بالكذب", est_correcte: false },
      { texte_fr: "Un hadith rapporté une seule fois dans l'histoire", texte_ar: "حديث لم يُروَ إلا مرة واحدة في التاريخ", est_correcte: false },
    ],
    explication_fr: "Le Ma'lul (ou Mu'allal) est l'une des catégories les plus difficiles à identifier ; il nécessite une connaissance approfondie des isnad et des rijal.",
  },
  {
    texte_fr: "Combien de hadiths Anas ibn Malik a-t-il rapportés et quelle est sa particularité ?",
    texte_ar: "كم حديثًا روى أنس بن مالك وما تميّزه؟",
    domaine: 'hadith', niveau: 4,
    reponses: [
      { texte_fr: "2286 hadiths ; il a servi le Prophète pendant 10 ans et fut l'un des derniers Compagnons à mourir", texte_ar: "2286 حديثًا؛ خدم النبي عشر سنوات وكان من آخر الصحابة وفاةً", est_correcte: true },
      { texte_fr: "5374 hadiths ; il était le plus proche des Compagnons", texte_ar: "5374 حديثًا؛ كان أقرب الصحابة", est_correcte: false },
      { texte_fr: "1030 hadiths ; il a surtout transmis des hadiths de Médine", texte_ar: "1030 حديثًا؛ روى أحاديث المدينة خاصةً", est_correcte: false },
      { texte_fr: "890 hadiths ; il était le secrétaire du Prophète", texte_ar: "890 حديثًا؛ كان كاتب النبي", est_correcte: false },
    ],
    explication_fr: "Anas ibn Malik a servi le Prophète ﷺ à partir de l'âge de 10 ans à Médine. Mort vers 93 H, il fut l'un des derniers grands Sahaba vivants.",
  },

  // SIRAH N1 (+1)
  {
    texte_fr: "Dans quelle ville le Prophète Muhammad ﷺ est-il né ?",
    texte_ar: "في أي مدينة وُلد النبي محمد ﷺ؟",
    domaine: 'sirah', niveau: 1,
    reponses: [
      { texte_fr: "La Mecque", texte_ar: "مكة المكرمة", est_correcte: true },
      { texte_fr: "Médine", texte_ar: "المدينة المنورة", est_correcte: false },
      { texte_fr: "Taëf", texte_ar: "الطائف", est_correcte: false },
      { texte_fr: "Jérusalem", texte_ar: "القدس", est_correcte: false },
    ],
    explication_fr: "Le Prophète ﷺ est né à La Mecque, dans le quartier de Banu Hashim, l'année de l'Éléphant (environ 570 EC).",
  },

  // SIRAH N2 (+1)
  {
    texte_fr: "Quel était le métier du Prophète ﷺ avant la Révélation ?",
    texte_ar: "ما كانت مهنة النبي ﷺ قبل البعثة؟",
    domaine: 'sirah', niveau: 2,
    reponses: [
      { texte_fr: "Commerçant (marchand)", texte_ar: "تاجرًا", est_correcte: true },
      { texte_fr: "Agriculteur", texte_ar: "مزارعًا", est_correcte: false },
      { texte_fr: "Artisan potier", texte_ar: "خزّافًا", est_correcte: false },
      { texte_fr: "Pêcheur", texte_ar: "صيّادًا", est_correcte: false },
    ],
    explication_fr: "Le Prophète ﷺ était commerçant, réputé pour son honnêteté (Al-Amin). Il conduisit les caravanes commerciales de Khadija avant de l'épouser.",
  },
];

async function seed() {
  const client = await pool.connect();
  let inserted = 0;
  let skipped = 0;
  try {
    for (const q of questions) {
      const exists = await client.query(
        'SELECT id FROM questions WHERE texte_fr = $1',
        [q.texte_fr]
      );
      if (exists.rows.length > 0) { skipped++; continue; }

      const res = await client.query(
        `INSERT INTO questions (texte_fr, texte_ar, domaine, niveau, valide)
         VALUES ($1, $2, $3, $4, true) RETURNING id`,
        [q.texte_fr, q.texte_ar || null, q.domaine, q.niveau]
      );
      const qid = res.rows[0].id;

      for (const r of q.reponses) {
        await client.query(
          `INSERT INTO reponses (question_id, texte_fr, texte_ar, est_correcte)
           VALUES ($1, $2, $3, $4)`,
          [qid, r.texte_fr, r.texte_ar || null, r.est_correcte]
        );
      }

      if (q.dalil) {
        await client.query(
          `INSERT INTO dalils (question_id, type, texte_fr, texte_ar, reference, grade_hadith)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [qid, q.dalil.type, q.dalil.texte_fr, q.dalil.texte_ar || null,
           q.dalil.reference || null, q.dalil.grade_hadith || null]
        );
      }

      if (q.explication_fr) {
        await client.query(
          `UPDATE questions SET explication_fr = $1 WHERE id = $2`,
          [q.explication_fr, qid]
        );
      }
      inserted++;
    }
    console.log(`Lot 5 terminé: ${inserted} insérées, ${skipped} ignorées (doublons)`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
