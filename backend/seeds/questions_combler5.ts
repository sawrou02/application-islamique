import { Client } from 'pg';

interface Q { domaine:string; niveau:number; texte_fr:string; texte_ar?:string; explication:string; dalil_ref?:string; grade_hadith?:string; sous_domaine?:string; reponses:{texte_fr:string;texte_ar?:string;est_correcte:boolean}[]; }

const Q: Q[] = [
  // AKHLAQ N3 (+1)
  { domaine:'akhlaq', niveau:3, texte_fr:"Qu'est-ce que la 'Muruu'a' (virilité morale) en islam ?", texte_ar:"ما هي 'المروءة' في الإسلام؟", explication:"La Muruu'a désigne l'ensemble des vertus qui font la dignité de l'homme : générosité, pudeur, loyauté, courage dans la vérité.", reponses:[{texte_fr:"L'ensemble des qualités nobles : générosité, pudeur, courage, loyauté",texte_ar:"مجموعة الصفات النبيلة: الكرم والحياء والشجاعة والوفاء",est_correcte:true},{texte_fr:"La force physique uniquement",est_correcte:false},{texte_fr:"La richesse et le prestige social",est_correcte:false},{texte_fr:"L'érudition religieuse exclusive",est_correcte:false}] },

  // AKHLAQ N4 (+4)
  { domaine:'akhlaq', niveau:4, texte_fr:"Quel est le lien entre l'Ihsan et la conscience d'Allah (Muraqaba) ?", texte_ar:"ما العلاقة بين الإحسان والمراقبة؟", explication:"L'Ihsan est défini par la Muraqaba selon le hadith de Jibril : adorer Allah comme si tu Le voyais, car si tu ne Le vois pas, Lui te voit.", dalil_ref:"Sahih Muslim n°8", grade_hadith:"Sahih", reponses:[{texte_fr:"L'Ihsan est défini par la Muraqaba : adorer Allah comme si tu Le voyais",texte_ar:"الإحسان هو عبادة الله كأنك تراه، وهذا هو جوهر المراقبة",est_correcte:true},{texte_fr:"La Muraqaba est sans lien avec l'Ihsan",est_correcte:false},{texte_fr:"L'Ihsan concerne uniquement les actes extérieurs",est_correcte:false},{texte_fr:"Ce sont deux notions indépendantes",est_correcte:false}] },
  { domaine:'akhlaq', niveau:4, texte_fr:"Qu'est-ce que le 'Qana'a' (contentement) selon les savants ?", texte_ar:"ما هو 'القناعة' عند العلماء؟", explication:"Se satisfaire de ce qu'Allah a accordé. Le Prophète ﷺ a dit : la vraie richesse est celle de l'âme.", dalil_ref:"Sahih al-Bukhari n°6446", grade_hadith:"Sahih", reponses:[{texte_fr:"Se satisfaire de ce qu'Allah a accordé sans convoiter davantage",texte_ar:"الرضا بما قسم الله دون طلب الزيادة بالحرص",est_correcte:true},{texte_fr:"Abandonner tout effort de travail",est_correcte:false},{texte_fr:"S'abstenir de tout achat",est_correcte:false},{texte_fr:"Refuser les dons et cadeaux",est_correcte:false}] },
  { domaine:'akhlaq', niveau:4, texte_fr:"Comment l'islam définit-il la 'Najdah' (bravoure altruiste) ?", texte_ar:"كيف يعرف الإسلام 'النجدة'؟", explication:"La Najdah est la vertu islamique consistant à voler au secours d'autrui sans calcul personnel, incarnée par les Sahaba.", reponses:[{texte_fr:"Secourir autrui au péril de sa sécurité par devoir moral",texte_ar:"إغاثة الآخرين على حساب سلامة النفس واجبًا أخلاقيًا",est_correcte:true},{texte_fr:"La bravoure militaire uniquement",est_correcte:false},{texte_fr:"L'aide financière aux nécessiteux",est_correcte:false},{texte_fr:"L'audace dans la parole",est_correcte:false}] },
  { domaine:'akhlaq', niveau:4, texte_fr:"Quel est le rang de celui qui délaisse le mal par honte des gens, non par crainte d'Allah ?", texte_ar:"ما مرتبة من يترك المعصية حياءً من الناس لا خشيةً من الله؟", explication:"La pudeur (haya') la plus élevée est celle d'Allah. Agir par honte sociale sans conscience divine est une vertu incomplète selon les savants.", reponses:[{texte_fr:"Insuffisant : le vrai haya' doit être dirigé vers Allah avant tout",texte_ar:"غير كافٍ: الحياء الحقيقي يجب أن يكون أولًا من الله",est_correcte:true},{texte_fr:"Suffisant pour la vertu islamique",est_correcte:false},{texte_fr:"Un degré supérieur car il protège la société",est_correcte:false},{texte_fr:"Équivaut au haya' envers Allah",est_correcte:false}] },

  // AKHLAQ N5 (+2)
  { domaine:'akhlaq', niveau:5, texte_fr:"Qu'est-ce que 'l'Ithar' (altruisme) et quel en est le degré suprême ?", texte_ar:"ما هو 'الإيثار' وما أعلى درجاته؟", explication:"Préférer autrui à soi-même. Allah loue les Ansar : « Ils préfèrent les autres à eux-mêmes, même dans le besoin. » (59:9)", dalil_ref:"Sourate Al-Hashr 59:9", reponses:[{texte_fr:"Préférer autrui à soi, même dans son propre besoin",texte_ar:"تفضيل الآخر على النفس، حتى مع الحاجة الشخصية",est_correcte:true},{texte_fr:"Donner beaucoup en période d'abondance",est_correcte:false},{texte_fr:"Partager la moitié de ses biens",est_correcte:false},{texte_fr:"Secourir uniquement les proches",est_correcte:false}] },
  { domaine:'akhlaq', niveau:5, texte_fr:"Selon Ibn al-Qayyim, quelles sont les causes de la mort du cœur ?", texte_ar:"ما أسباب موت القلب عند ابن القيم؟", explication:"Ibn al-Qayyim dans 'Ighathat al-Lahfan' décrit la mort du cœur : ignorance d'Allah, négligence du dhikr, accumulation de péchés, mauvaises fréquentations.", dalil_ref:"Ighathat al-Lahfan d'Ibn al-Qayyim", reponses:[{texte_fr:"Ignorance d'Allah, négligence du dhikr, péchés et mauvaises fréquentations",texte_ar:"الجهل بالله وترك الذكر وتراكم الذنوب وسوء الصحبة",est_correcte:true},{texte_fr:"La maladie physique et la pauvreté",est_correcte:false},{texte_fr:"L'excès d'adoration sans connaissance",est_correcte:false},{texte_fr:"La solitude et l'isolement social",est_correcte:false}] },

  // HADITH N4 (+4)
  { domaine:'hadith', niveau:4, texte_fr:"Qu'est-ce qu'un hadith 'Mawquf' ?", texte_ar:"ما هو الحديث الموقوف؟", explication:"Le Mawquf s'arrête au niveau du Compagnon (Sahabi). S'il s'arrête au Tabi'i, il est dit 'Maqtu''.", reponses:[{texte_fr:"Un hadith dont la chaîne s'arrête au Compagnon sans remonter au Prophète",texte_ar:"حديث تنتهي سلسلته عند الصحابي دون أن ترفع إلى النبي",est_correcte:true},{texte_fr:"Un hadith faible à transmission suspendue",est_correcte:false},{texte_fr:"Un hadith dont l'authenticité est controversée",est_correcte:false},{texte_fr:"Un hadith rapporté par un seul transmetteur",est_correcte:false}] },
  { domaine:'hadith', niveau:4, texte_fr:"Quelle est la différence entre 'Tadlis' et 'Irsal' ?", texte_ar:"ما الفرق بين التدليس والإرسال؟", explication:"Le Tadlis implique une dissimulation intentionnelle d'une rupture de chaîne, tandis que l'Irsal (Mursal) est une simple omission d'un maillon (souvent le Sahabi).", reponses:[{texte_fr:"Le Tadlis masque délibérément une rupture, l'Irsal omet un maillon sans tromper",texte_ar:"التدليس يخفي انقطاعًا عمدًا، والإرسال يحذف حلقة دون قصد التضليل",est_correcte:true},{texte_fr:"Termes synonymes pour une chaîne incomplète",est_correcte:false},{texte_fr:"L'Irsal concerne le texte du hadith",est_correcte:false},{texte_fr:"Le Tadlis ne concerne que les Compagnons",est_correcte:false}] },
  { domaine:'hadith', niveau:4, texte_fr:"Qu'est-ce qu'un hadith 'Ma'lul' (défectueux) ?", texte_ar:"ما هو الحديث المعلول؟", explication:"Le Ma'lul (ou Mu'allal) est l'une des catégories les plus difficiles à identifier ; il nécessite une connaissance approfondie des isnad et des rijal.", reponses:[{texte_fr:"Un hadith dont l'apparence est correcte mais qui cache un défaut ('illa)",texte_ar:"حديث ظاهره الصحة لكنه يحمل علة خفية يكتشفها النقاد",est_correcte:true},{texte_fr:"Un hadith aux mots inconnus dans son texte",est_correcte:false},{texte_fr:"Un hadith dont le transmetteur est accusé de mensonge",est_correcte:false},{texte_fr:"Un hadith rapporté une seule fois dans l'histoire",est_correcte:false}] },
  { domaine:'hadith', niveau:4, texte_fr:"Combien de hadiths Anas ibn Malik a-t-il rapportés ?", texte_ar:"كم حديثًا روى أنس بن مالك؟", explication:"Anas ibn Malik a servi le Prophète ﷺ à partir de l'âge de 10 ans à Médine. Mort vers 93 H, il fut l'un des derniers grands Sahaba vivants.", reponses:[{texte_fr:"2286 hadiths ; servit le Prophète 10 ans, l'un des derniers Compagnons à mourir",texte_ar:"2286 حديثًا؛ خدم النبي عشر سنوات وكان من آخر الصحابة وفاةً",est_correcte:true},{texte_fr:"5374 hadiths",est_correcte:false},{texte_fr:"1030 hadiths",est_correcte:false},{texte_fr:"890 hadiths",est_correcte:false}] },

  // SIRAH N1 (+1)
  { domaine:'sirah', niveau:1, texte_fr:"Dans quelle ville le Prophète Muhammad ﷺ est-il né ?", texte_ar:"في أي مدينة وُلد النبي محمد ﷺ؟", explication:"Le Prophète ﷺ est né à La Mecque, dans le quartier de Banu Hashim, l'année de l'Éléphant (environ 570 EC).", reponses:[{texte_fr:"La Mecque",texte_ar:"مكة المكرمة",est_correcte:true},{texte_fr:"Médine",texte_ar:"المدينة المنورة",est_correcte:false},{texte_fr:"Taëf",texte_ar:"الطائف",est_correcte:false},{texte_fr:"Jérusalem",texte_ar:"القدس",est_correcte:false}] },

  // SIRAH N2 (+1)
  { domaine:'sirah', niveau:2, texte_fr:"Quel était le métier du Prophète ﷺ avant la Révélation ?", texte_ar:"ما كانت مهنة النبي ﷺ قبل البعثة؟", explication:"Le Prophète ﷺ était commerçant, réputé pour son honnêteté (Al-Amin). Il conduisit les caravanes de Khadija avant de l'épouser.", reponses:[{texte_fr:"Commerçant (marchand)",texte_ar:"تاجرًا",est_correcte:true},{texte_fr:"Agriculteur",texte_ar:"مزارعًا",est_correcte:false},{texte_fr:"Artisan potier",texte_ar:"خزّافًا",est_correcte:false},{texte_fr:"Pêcheur",texte_ar:"صيّادًا",est_correcte:false}] },
];

export async function seedQuestionsCombler5(client: Client): Promise<void> {
  console.log('Seeding lot 5 (combler final cellules manquantes)...');
  let inserted = 0; let skipped = 0;
  for (const q of Q) {
    const exists = await client.query('SELECT id FROM questions WHERE texte_fr = $1', [q.texte_fr]);
    if (exists.rows.length > 0) { skipped++; continue; }
    const r = await client.query(
      `INSERT INTO questions (domaine, sous_domaine, niveau, madhab, texte_fr, texte_ar, dalil_ref, explication, grade_hadith, statut) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'valide') RETURNING id`,
      [q.domaine, q.sous_domaine ?? null, q.niveau, 'general', q.texte_fr, q.texte_ar ?? null, q.dalil_ref ?? null, q.explication, q.grade_hadith ?? null]
    );
    const id = r.rows[0].id;
    for (const rep of q.reponses) {
      await client.query(`INSERT INTO reponses (question_id, texte_fr, texte_ar, est_correcte) VALUES ($1,$2,$3,$4)`, [id, rep.texte_fr, rep.texte_ar ?? null, rep.est_correcte]);
    }
    inserted++;
  }
  console.log(`Combler5: ${inserted} inserted, ${skipped} skipped.`);
}

if (require.main === module) {
  const { Client } = require('pg');
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  c.connect().then(async () => { await seedQuestionsCombler5(c); await c.end(); }).catch((e: unknown) => { console.error(e); process.exit(1); });
}
