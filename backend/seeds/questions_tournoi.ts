/**
 * Questions spéciales TOURNOI — niveau expert/mufti (is_tournoi = TRUE)
 * Difficulté extrême : divergences entre imams, terminologie technique arabe,
 * isnads précis, subtilités de fiqh avancé, positions minoritaires documentées.
 * 5 questions × 6 domaines = 30 questions tournoi exclusives
 */
import pool from '../src/db';

interface TournoiQuestion {
  domaine: string;
  niveau: number;
  texte_fr: string;
  texte_ar: string;
  reponses: { texte_fr: string; texte_ar: string; correct: boolean }[];
  explication: string;
  dalil_ref: string;
}

const questions: TournoiQuestion[] = [

  // ════════════════════════════════════════════════════════════
  // FIQH — questions de niveau mufti
  // ════════════════════════════════════════════════════════════
  {
    domaine: 'fiqh', niveau: 5,
    texte_fr: "Selon Imam Malik, pourquoi l''amal ahl al-Madinah' (pratique des gens de Médine) prime-t-il sur un hadith ahad en matière de fiqh ?",
    texte_ar: "لماذا يُقدِّم الإمام مالك عمل أهل المدينة على خبر الآحاد في الفقه؟",
    reponses: [
      { texte_fr: "La pratique médinoise est une Sunna en acte transmise par tawatur depuis le Prophète ﷺ, supérieure à la transmission verbale d'un seul", texte_ar: "عمل أهل المدينة سنة فعلية متواترة عن النبي ﷺ فتقدم على الرواية اللفظية لآحاد", correct: true },
      { texte_fr: "Les Médinois sont les plus savants en hadith, donc leur opinion est plus fiable", texte_ar: "أهل المدينة أعلم الناس بالحديث فرأيهم أوثق", correct: false },
      { texte_fr: "Un consensus des Compagnons est obligatoirement enregistré à Médine uniquement", texte_ar: "إجماع الصحابة ينعقد بالمدينة حصراً", correct: false },
      { texte_fr: "Imam Malik acceptait les hadiths ahad sans restriction sur les pratiques médinoises", texte_ar: "مالك كان يقبل حديث الآحاد دون قيد على عمل أهل المدينة", correct: false },
    ],
    explication: "Imam Malik considère que la pratique continue des Médinois est une Sunna transmise de génération en génération directement du Prophète ﷺ — c'est une forme de tawatur pratique (al-'amal al-mutawatir). Un hadith ahad, même sahih dans son isnad, est une transmission verbale individuelle qui peut contenir une erreur de mémoire ou d'interprétation. L'acte collectif ininterrompu prévaut sur la parole d'un seul. C'est la doctrine exposée dans Al-Muwatta' et expliquée par Ibn Al-Qasim dans Al-Mudawwana.",
    dalil_ref: "Al-Muwatta' — Imam Malik · Al-Mudawwana — Sahnun · I'lam al-Muwaqqi'in — Ibn Al-Qayyim 2/271",
  },
  {
    domaine: 'fiqh', niveau: 5,
    texte_fr: "Qu'est-ce que la règle du 'darar wa dirar' (لا ضرر ولا ضرار) et quelle est la différence entre les deux termes dans la jurisprudence islamique ?",
    texte_ar: "ما قاعدة 'لا ضرر ولا ضرار' وما الفرق الفقهي بين اللفظين؟",
    reponses: [
      { texte_fr: "'Darar' = porter préjudice à autrui sans raison valable ; 'Dirar' = ripostes causant un préjudice par vengeance ou malice délibérée", texte_ar: "الضرر: إيقاع الأذى ابتداءً بغير حق. الضرار: المضارة قصداً وانتقاماً", correct: true },
      { texte_fr: "Les deux termes sont synonymes et cette répétition est stylistique (ta'kid)", texte_ar: "اللفظان مترادفان والتكرار للتوكيد فقط", correct: false },
      { texte_fr: "'Darar' est matériel, 'dirar' est moral — la nuance est uniquement d'ordre spirituel", texte_ar: "الضرر مادي والضرار معنوي والفرق روحي فحسب", correct: false },
      { texte_fr: "'Darar' s'applique aux biens uniquement, 'dirar' s'applique aux personnes uniquement", texte_ar: "الضرر خاص بالأموال والضرار خاص بالنفوس", correct: false },
    ],
    explication: "Les savants distinguent : 'La darar' (sans compément) = nuire à autrui sans cause légitime. 'Wa la dirar' = répliquer avec un préjudice disproportionné ou malveillant par désir de vengeance. Ibn Rajab : le darar est le préjudice initial, le dirar est le contre-préjudice injuste. Cette règle (hadith Sahih — Ibn Majah 2340, Daraqutni — isnad hassan) est l'une des cinq règles majeures du fiqh islamique et fonde toute la théorie de la responsabilité civile en droit musulman.",
    dalil_ref: "Ibn Majah 2340 · Daraqutni 3/77 · Al-Ashbah wan-Naza'ir — As-Suyuti · Sharh Al-Arba'in — Ibn Rajab",
  },
  {
    domaine: 'fiqh', niveau: 5,
    texte_fr: "Pourquoi le madhab hanafite refuse-t-il le hadith de la chatte de Abu Hurayra pour accepter sa pureté (tahara), contrairement aux autres madhahibs ?",
    texte_ar: "لماذا يرفض المذهب الحنفي حديث هرة أبي هريرة في طهارتها خلافاً لبقية المذاهب؟",
    reponses: [
      { texte_fr: "Les hanafites appliquent la règle qu'un hadith ahad ne peut contredire le qiyas établi sur un texte fort (la salive de tout animal avec du sang coulant est impure par analogie)", texte_ar: "الحنفية يقدّمون القياس الظاهر على خبر الآحاد عند التعارض", correct: true },
      { texte_fr: "Le hadith de la chatte est faible (da'if) selon Abu Hanifa personnellement", texte_ar: "أبو حنيفة ضعّف حديث الهرة شخصياً", correct: false },
      { texte_fr: "Abu Hurayra lui-même s'est rétracté sur ce hadith selon les hanafites", texte_ar: "أبو هريرة نفسه رجع عن هذا الحديث عند الحنفية", correct: false },
      { texte_fr: "Le madhab hanafite considère toutes les bêtes à quatre pattes comme impures", texte_ar: "المذهب الحنفي يعتبر كل ذوات الأربع نجسة", correct: false },
    ],
    explication: "Le hadith (Tirmidhi 92, Abu Dawud 75 — sahih) dit que le chat est 'tawwaf alaykum' (circule chez vous) et ses restes (su'r) sont purs. La majorité (malikites, shafiites, hanbalites) l'acceptent. Les hanafites appliquent leur principe méthodologique : un hadith ahad ne peut pas invalider un qiyas fort. Le qiyas : tout animal dont le sang coule (dhu dam sa'il) a une salive impure. La règle générale prime sur le cas particulier rapporté par un seul. Cette divergence illustre la méthodologie hanafite (tarjih al-qiyas 'ala khabar al-ahad).",
    dalil_ref: "Sunan Abi Dawud 75 · Tirmidhi 92 · Fath al-Qadir — Ibn Al-Humam 1/61 · Al-Mabsut — As-Sarakhsi",
  },
  {
    domaine: 'fiqh', niveau: 5,
    texte_fr: "Dans la théorie du 'maqasid ash-shari'a' d'Al-Ghazali et d'Ash-Shatibi, quelle est la distinction entre 'daruriyyat', 'hajiyyat' et 'tahsiniyyat' avec un exemple de chacune ?",
    texte_ar: "ما الفرق بين الضروريات والحاجيات والتحسينيات في مقاصد الشريعة مع مثال لكل مستوى؟",
    reponses: [
      { texte_fr: "Daruriyyat (sans lesquels l'ordre social s'effondre: vie, raison, religion, honneur, biens) · Hajiyyat (sans lesquels on est dans la gêne: voyages, contrats) · Tahsiniyyat (embellissement: propreté, morale)", texte_ar: "ضروريات (تختل الحياة بدونها: النفس والعقل والدين والعرض والمال) · حاجيات (ترفع الحرج: السفر والعقود) · تحسينيات (مكارم الأخلاق والطهارة)", correct: true },
      { texte_fr: "Les trois niveaux concernent uniquement les actes d'adoration ('ibadat), pas les transactions (mu'amalat)", texte_ar: "المستويات الثلاثة تخص العبادات فقط دون المعاملات", correct: false },
      { texte_fr: "Al-Ghazali et Ash-Shatibi divergent totalement sur cette classification — aucun consensus entre eux", texte_ar: "الغزالي والشاطبي يختلفان كلياً في هذا التصنيف ولا اتفاق بينهما", correct: false },
      { texte_fr: "Les tahsiniyyat peuvent invalider les daruriyyat en cas de conflit selon Ash-Shatibi", texte_ar: "التحسينيات تُبطل الضروريات عند التعارض عند الشاطبي", correct: false },
    ],
    explication: "Al-Ghazali (Al-Mustasfa) et Ash-Shatibi (Al-Muwafaqat) distinguent : (1) Daruriyyat = les 5 nécessités sans lesquelles la société s'effondre (al-kulliyyat al-khams) : religion, vie, raison, descendance, biens. Exemple : interdiction du meurtre protège la vie. (2) Hajiyyat = enlèvent la gêne (haraj) sans être vitales. Exemple : contrat de salam (vente à terme) prévu pour les agriculteurs. (3) Tahsiniyyat = perfectionnements éthiques et esthétiques. Exemple : port de vêtements couvrants. Ordre de priorité : daruriyyat > hajiyyat > tahsiniyyat en cas de conflit.",
    dalil_ref: "Al-Mustasfa — Al-Ghazali 1/286 · Al-Muwafaqat — Ash-Shatibi 2/17",
  },
  {
    domaine: 'fiqh', niveau: 5,
    texte_fr: "Qu'est-ce que le 'talfiq' (التلفيق) en fiqh islamique et dans quel cas les savants le considèrent-ils interdit ?",
    texte_ar: "ما التلفيق في الفقه الإسلامي ومتى يعتبره العلماء ممنوعاً؟",
    reponses: [
      { texte_fr: "Le talfiq = combiner deux positions de deux madhahibs différents pour obtenir un résultat qu'aucun n'autoriserait seul. Interdit quand il résulte en une facilité sans fondement ('abath)", texte_ar: "التلفيق: الجمع بين قولَي مذهبَين للوصول لنتيجة لا يجيزها أي منهما منفرداً. يُمنع إن أفضى إلى عبثية أو الاستخفاف", correct: true },
      { texte_fr: "Le talfiq = choisir un madhab différent de son madhab d'origine pour une fatwa. Toujours interdit", texte_ar: "التلفيق: الخروج عن المذهب الأصلي لأخذ فتوى من مذهب آخر. ممنوع مطلقاً", correct: false },
      { texte_fr: "Le talfiq = adopter plusieurs madhahibs simultanément. Toujours permis pour le commun des croyants", texte_ar: "التلفيق: انتساب عدة مذاهب في آنٍ واحد. مباح مطلقاً للعوام", correct: false },
      { texte_fr: "Le talfiq est une innovation (bid'a) inventée après les quatre imams et rejetée unanimement", texte_ar: "التلفيق بدعة أُحدثت بعد الأئمة الأربعة ومرفوضة إجماعاً", correct: false },
    ],
    explication: "Le talfiq consiste à prendre la position de l'imam Shafi'i sur un élément A et la position de l'imam Malik sur un élément B dans la même action — aboutissant à une combinaison qu'aucun des deux n'autoriserait. Exemple : faire ses ablutions en touchant sa femme (hanafite = pas d'annulation) puis prier sans se laver les pieds (malikite = frottement suffit) = ablutions invalides pour les deux! Les savants comme Ibn Abidin (Hashiyat Radd al-Muhtar) distinguent le talfiq défendable (suivre la facilité ponctuelle avec preuve) du talfiq interdit (abath = obtenir le permis de tout sans fondement).",
    dalil_ref: "Hashiyat Radd al-Muhtar — Ibn Abidin · Al-Muwafaqat — Ash-Shatibi 4/141 · Fatawa Al-Azhar",
  },

  // ════════════════════════════════════════════════════════════
  // AQIDA — questions de niveau mufti
  // ════════════════════════════════════════════════════════════
  {
    domaine: 'aqida', niveau: 5,
    texte_fr: "Quelle est la thèse mu'tazilite du 'amr bayna amrayn' (منزلة بين المنزلتين) et qui l'a formulée en réaction à quelle controverse ?",
    texte_ar: "ما مقالة المعتزلة 'المنزلة بين المنزلتين' ومن صاغها وفي سياق أي خلاف؟",
    reponses: [
      { texte_fr: "Wasil ibn Ata' l'a formulée : le pécheur majeur n'est ni croyant ni incroyant, il occupe un statut intermédiaire — en rupture avec son maître Al-Hasan Al-Basri qui le traitait de 'munafiq'", texte_ar: "صاغها واصل بن عطاء: الفاسق لا مؤمن ولا كافر بل في منزلة وسط، خلافاً لشيخه الحسن الذي سمّاه منافقاً", correct: true },
      { texte_fr: "Al-Ash'ari l'a formulée comme concession aux mu'tazilites avant de les réfuter", texte_ar: "صاغها الأشعري تنازلاً للمعتزلة قبل الرد عليهم", correct: false },
      { texte_fr: "Elle a été formulée pour traiter du statut de 'Uthman ibn Affan après sa mort", texte_ar: "صيغت لبيان حكم عثمان بن عفان بعد مقتله", correct: false },
      { texte_fr: "Cette thèse concerne le statut du Coran (créé ou non créé), pas le croyant pécheur", texte_ar: "تخص هذه المقالة القرآن (مخلوق أم لا) لا الفاسق", correct: false },
    ],
    explication: "Wasil ibn Ata' (m. 748) fut l'élève d'Al-Hasan Al-Basri. La question : quel est le statut du musulman qui commet un grand péché (kabira) ? Le Khawarij disait : kafir. Al-Hasan disait : munafiq. Wasil rompit (i'tizal = se séparer, d'où 'mu'tazila') avec Al-Hasan et proclama la 'manzila bayna al-manzilatayn' : le fasiq n'est ni mu'min ni kafir — catégorie intermédiaire. Les sunnites (Ash'arites/Maturidites) répondent : il reste mu'min déficient dans sa foi, ahl as-sunna ne le sortent pas de l'Islam.",
    dalil_ref: "Al-Milal wan-Nihal — Ash-Shahrastani · Al-Farq bayn al-Firaq — Al-Baghdadi · Maqalat al-Islamiyyin — Al-Ash'ari",
  },
  {
    domaine: 'aqida', niveau: 5,
    texte_fr: "Qu'est-ce que la doctrine du 'wujub as-salah' (وجوب الصلاح) chez les mu'tazilites et quelle est la réfutation ash'arite principale ?",
    texte_ar: "ما عقيدة وجوب الصلاح عند المعتزلة وما أبرز ردود الأشاعرة عليها؟",
    reponses: [
      { texte_fr: "Mu'tazila : Allah est obligé (wajib) de faire ce qui est le mieux pour les créatures. Ash'arites : rien n'est obligatoire sur Allah, Sa Volonté est absolue — 'la yus'al amma yaf'al' (21:23)", texte_ar: "المعتزلة: يجب على الله فعل الصلاح. الأشاعرة: لا يجب على الله شيء إذ مشيئته مطلقة — لا يُسأل عما يفعل (21:23)", correct: true },
      { texte_fr: "La doctrine concerne uniquement les prophètes, pas tous les hommes", texte_ar: "العقيدة تخص الأنبياء فحسب لا جميع الناس", correct: false },
      { texte_fr: "Les ash'arites acceptaient cette doctrine mais refusaient son application au Paradis et l'Enfer", texte_ar: "الأشاعرة قبلوا المبدأ لكن رفضوا تطبيقه على الجنة والنار", correct: false },
      { texte_fr: "C'est une doctrine inventée par les Khawarij, non les mu'tazilites", texte_ar: "هذه عقيدة الخوارج لا المعتزلة", correct: false },
    ],
    explication: "Les mu'tazilites affirmaient qu'Allah est rationellement obligé de faire le 'aslah' (le plus bénéfique) pour Ses créatures — sinon il serait 'qabih' (laid/mauvais) de Sa part. Cela implique que la raison humaine peut juger les actes divins. Les ash'arites réfutent : la souveraineté d'Allah est absolue, Sa Volonté transcende les jugements de la raison créée. Prouves : 'Il n'est pas interrogé sur ce qu'Il fait, ce sont eux qui seront interrogés' (21:23). Si Allah était obligé de quelque chose envers les créatures, Sa divinité absolue serait limitée.",
    dalil_ref: "Al-Iqtisad fil I'tiqad — Al-Ghazali · Ash-Shamil — Al-Juwayni · Luma' — Al-Ash'ari",
  },
  {
    domaine: 'aqida', niveau: 5,
    texte_fr: "Quel est le concept de 'fitra' (الفطرة) en Islam, quelles sont les interprétations des savants sur sa signification précise, et quel hadith l'établit ?",
    texte_ar: "ما الفطرة في الإسلام وما التفسيرات العلمية لمعناها الدقيق وما الحديث المؤسِّس لها؟",
    reponses: [
      { texte_fr: "Hadith Muslim 2658. Fitra = disposition naturelle à reconnaître Allah. Débat : (a) Islam au sens large (Tabarî) (b) Tawhid inné (Ibn Taymiyya) (c) simple capacité à embrasser l'Islam (Ash'arî)", texte_ar: "حديث مسلم 2658. الفطرة = الاستعداد الفطري لمعرفة الله. الخلاف: (أ) الإسلام بالمعنى الواسع (الطبري) (ب) التوحيد الفطري (ابن تيمية) (ج) القابلية للإسلام (الأشعري)", correct: true },
      { texte_fr: "Fitra = les rites de la sunna (taille de moustache, circumcision, etc.) selon tous les savants", texte_ar: "الفطرة = سنن الفطرة فقط (قص الشارب والختان ...) باتفاق العلماء", correct: false },
      { texte_fr: "La fitra concerne uniquement les prophètes et non l'ensemble de l'humanité", texte_ar: "الفطرة تخص الأنبياء فقط لا عموم البشر", correct: false },
      { texte_fr: "Le terme n'est mentionné qu'une seule fois dans le Coran et les avis sont unanimes sur son sens", texte_ar: "اللفظ مذكور مرة واحدة في القرآن وآراء العلماء في معناه متفقة", correct: false },
    ],
    explication: "Hadith : 'Kullu mawludin yuladu 'ala-l-fitra' (Tout enfant naît sur la fitra — Muslim 2658, Bukhari 1358). Débat des savants sur 'fitra' : (1) At-Tabari : Islam au sens large de soumission à Allah ; (2) Ibn Taymiyya (Majmu' 4/245) : connaissance innée du Tawhid, preuve de la 'mithaq' (7:172) ; (3) Al-Ash'ari et Al-Ghazali : simple capacité/prédisposition à accepter l'Islam, actualisée par l'éducation. Ces interprétations influencent directement la question du statut des enfants des non-musulmans (masa'lat atfal al-mushrikin).",
    dalil_ref: "Sahih Muslim 2658 · Sahih al-Bukhari 1358 · Majmu' Fatawa Ibn Taymiyya 4/245 · Sharh an-Nawawi 'ala Muslim",
  },
  {
    domaine: 'aqida', niveau: 5,
    texte_fr: "Qu'est-ce que la doctrine 'Ahl as-Sunna' sur l''isma des prophètes (العصمة) et quelles sont ses limites précises selon les kalâm-savants ?",
    texte_ar: "ما عقيدة أهل السنة في عصمة الأنبياء وما حدودها الدقيقة عند علماء الكلام؟",
    reponses: [
      { texte_fr: "'Isma = protection de toute erreur intentionnelle dans la transmission du message (tabligh). Possible : erreurs d'ijtihad (corrigées), peccadilles involontaires avant nubuwwa. Débattu : zalla Adame, qiblat Yunus", texte_ar: "العصمة في التبليغ والكبائر قطعاً. يجوز الخطأ في الاجتهاد (يُصحَّح). مختلف فيه: زلة آدم وغيوب يونس قبل النبوة أو بعدها", correct: true },
      { texte_fr: "Les prophètes sont infaillibles en tout — y compris dans leurs affaires personnelles et mondaines sans exception", texte_ar: "الأنبياء معصومون في كل شيء بما في ذلك أمورهم الشخصية والدنيوية دون استثناء", correct: false },
      { texte_fr: "L''isma concerne seulement les prophètes après la révélation (nubuwwa) et pas avant", texte_ar: "العصمة تخص ما بعد النبوة فقط لا ما قبلها", correct: false },
      { texte_fr: "'Isma signifie que les prophètes ne peuvent jamais être tentés par le mal sous aucune forme", texte_ar: "العصمة تعني أن الأنبياء لا يتعرضون للإغراء بالمعصية قطعياً", correct: false },
    ],
    explication: "Ash-Shahrastani, Al-Razi, Ibn Hazm : la 'isma des prophètes est absolue pour : (1) la transmission du message (tabligh) — erreur impossible, (2) les grands péchés (kaba'ir) après la nubuwwa. Possible selon la majorité : (a) erreurs d'ijtihad mondaines (le Prophète ﷺ avait tort sur la pollinisation des palmiers — Muslim 2363), immédiatement corrigées. Débattu : la 'zalla Adame (Coran 20:121) — fut-ce avant sa prophétie ? Ibn Al-Qayyim dit oui, les mu'tazilites l'utilisent pour critiquer l''isma. Point ferme : jamais de mensonge intentionnel dans la transmission divine.",
    dalil_ref: "Nihayat al-Iqdam — Ash-Shahrastani · Arba'un fil Usul — Ar-Razi · Mafatih al-Ghayb — Ar-Razi · Sahih Muslim 2363",
  },
  {
    domaine: 'aqida', niveau: 5,
    texte_fr: "Selon la théologie maturidite (Imam Al-Maturidi de Samarkand), en quoi diffère-t-elle de l'ash'arisme sur la 'husn wa qubh 'aqli' (beau/laid rationnel) ?",
    texte_ar: "كيف يختلف المذهب الماتريدي عن الأشعري في مسألة الحسن والقبح العقلي؟",
    reponses: [
      { texte_fr: "Maturidites : la raison peut percevoir le bien et le mal mais seule la shari'a les rend obligatoires. Ash'arites : la raison ne perçoit rien — seul le shar' définit le bien et le mal", texte_ar: "الماتريدية: العقل يدرك الحسن والقبح لكن الإلزام بالشرع وحده. الأشاعرة: لا إدراك عقلي مستقل للحسن والقبح", correct: true },
      { texte_fr: "Les deux écoles sont identiques sur ce point — la divergence est purement terminologique", texte_ar: "المذهبان متطابقان في هذه المسألة والخلاف لفظي محض", correct: false },
      { texte_fr: "Les maturidites rejoignent les mu'tazilites en disant que la raison oblige (yujib) à faire le bien", texte_ar: "الماتريدية يوافقون المعتزلة في أن العقل يوجب فعل الحسن", correct: false },
      { texte_fr: "Al-Maturidi était personnellement ash'arite mais réformateur de l'ash'arisme", texte_ar: "الماتريدي كان أشعرياً شخصياً لكن مُصلحاً للأشعرية", correct: false },
    ],
    explication: "Position maturidite (Kitab at-Tawhid — Al-Maturidi) : la raison humaine peut percevoir ('idrak) certaines vérités morales (le mensonge est mauvais, la gratitude est bonne) mais elle n'est pas source d'obligation religieuse. L'obligation (wujub) vient de la shari'a. Position ash'arite extrême : la raison ne peut pas juger intrinsèquement — 'bien' et 'mal' sont définis par le commandement divin. Cette nuance explique pourquoi les maturidites sont majoritaires dans le monde turc, d'Asie Centrale et d'Inde (hanafites), et les ash'arites dans le monde arabe, nord-africain et malayo-indonésien.",
    dalil_ref: "Kitab at-Tawhid — Al-Maturidi · At-Tamhid — Al-Baqillani · Maqasid — At-Taftazani",
  },

  // ════════════════════════════════════════════════════════════
  // TAFSIR — questions de niveau mufti
  // ════════════════════════════════════════════════════════════
  {
    domaine: 'tafsir', niveau: 5,
    texte_fr: "Qu'est-ce que les 'huruf muqatta'at' (الحروف المقطعة) comme Alif-Lam-Mim, et quelle est l'opinion la plus solide des savants sur leur sens ?",
    texte_ar: "ما الحروف المقطعة كالم وما أرجح أقوال العلماء في معناها؟",
    reponses: [
      { texte_fr: "Opinion la plus solide (Ibn Kathir, Ibn Taymiyya) : leur sens appartient à la science d'Allah, nous affirmons qu'elles ont un sens sans prétendre le connaître — c'est un défi à la langue arabe", texte_ar: "أرجحها (ابن كثير، ابن تيمية): علمها عند الله نُثبت لها معنى دون ادعاء الإحاطة، وهي تحدٍّ للغة العربية", correct: true },
      { texte_fr: "Elles sont les noms d'Allah selon le consensus des savants anciens", texte_ar: "هي أسماء الله تعالى بإجماع السلف", correct: false },
      { texte_fr: "Elles représentent l'année de la révélation en code numérique abjadi — c'est l'opinion de la majorité des savants", texte_ar: "هي تواريخ النزول بنظام أبجدي وهو رأي جمهور العلماء", correct: false },
      { texte_fr: "Az-Zamakhshari a prouvé définitivement qu'elles sont les initiales des noms des Compagnons copistes du Coran", texte_ar: "الزمخشري أثبت قطعاً أنها أحرف أوائل أسماء كُتّاب الصحابة", correct: false },
    ],
    explication: "Ibn Kathir (dans son tafsir) répertorie +20 opinions sur les huruf muqatta'at. Opinion la plus répandue et solide chez les ahl as-sunna wa-l-jama'a (Ibn Taymiyya, Ibn Kathir, As-Suyuti) : 'Allah a'lam bimuradi biha' — seul Allah en connaît le sens précis, c'est un défi à la langue arabe montrant que le Coran est composé de ces mêmes lettres que vous utilisez et vous êtes incapables de l'imiter. Certaines positions classiques : noms d'Allah (Ibn 'Abbas), abréviations de noms divins ou coraniques (Ibn Masud), début de chaque sourate indiquant une thématique. La règle des usul : sur ce qui relève du tawaqqufi (à ne trancher que par texte), le silence est préférable au ta'wil gratuit.",
    dalil_ref: "Tafsir Ibn Kathir (introduction) · Majmu' Fatawa Ibn Taymiyya 17/267 · Al-Itqan — As-Suyuti type 21",
  },
  {
    domaine: 'tafsir', niveau: 5,
    texte_fr: "Que signifie le terme 'isra'iliyyat' (إسرائيليات) dans les sciences du Coran et quelles sont les trois catégories établies par Ibn Kathir pour les juger ?",
    texte_ar: "ما الإسرائيليات في علوم القرآن وما أقسامها الثلاثة عند ابن كثير؟",
    reponses: [
      { texte_fr: "Récits juifs/chrétiens rapportés dans le tafsir. Ibn Kathir : (1) confirmé par la Shari'a → accepté, (2) contredit par la Shari'a → rejeté, (3) ni confirmé ni infirmé → narré sans jugement ('on raconte')", texte_ar: "روايات أهل الكتاب في التفسير. ابن كثير: (١) وافق الشريعة قُبل، (٢) خالفها رُدَّ، (٣) مسكوت عنه يُحكى دون حكم", correct: true },
      { texte_fr: "Les isra'iliyyat sont toutes faibles (da'if) et rejetées sans exception selon Ibn Kathir", texte_ar: "الإسرائيليات كلها ضعيفة ومردودة بالكلية عند ابن كثير", correct: false },
      { texte_fr: "Le terme désigne uniquement les récits tirés de la Torah, pas des Évangiles", texte_ar: "المصطلح يخص ما أُخذ من التوراة فحسب لا من الإنجيل", correct: false },
      { texte_fr: "Ibn Kathir interdit catégoriquement toute mention des isra'iliyyat dans le tafsir", texte_ar: "ابن كثير حرّم الاستشهاد بالإسرائيليات في التفسير تحريماً مطلقاً", correct: false },
    ],
    explication: "Ibn Kathir (muqaddimat tafsirihi) classe les isra'iliyyat en trois : (1) Muwafiq lil-Qur'an was-Sunna → accepté et narré. Exemple : récit de Dawud et Jalut selon la Torah s'accordant avec 2:249-251. (2) Mukhalif → rejeté fermement. Exemple : descriptions anthropomorphiques de Dieu dans des textes talmudiques. (3) La dalil 'alayhi (ni confirmation ni infirmation) → narré sans affirmer ni nier, suivi du hadith 'Racontez [les Ahl al-Kitab] sans les croire ni les démentir' (Bukhari 3461). Cette méthodologie est fondamentale pour évaluer les tafsirs anciens comme celui d'At-Tabari.",
    dalil_ref: "Muqaddima Tafsir Ibn Kathir · Sahih al-Bukhari 3461 · Al-Bidaya wan-Nihaya — Ibn Kathir 1/9",
  },
  {
    domaine: 'tafsir', niveau: 5,
    texte_fr: "Quel est le concept de 'sabab an-nuzul' (سبب النزول) et pourquoi le savant al-Wahidi affirme-t-il qu'il est 'impossible' de comprendre certains versets sans lui ?",
    texte_ar: "ما سبب النزول ولماذا يرى الواحدي استحالة فهم بعض الآيات بدونه؟",
    reponses: [
      { texte_fr: "Sabab an-nuzul = circonstance historique de révélation d'un verset. Al-Wahidi : certains versets ont des pronoms, conditions ou termes qui n'ont de sens que si on connaît l'événement qui les a déclenchés", texte_ar: "سبب النزول = الحادثة التي نزل الوحي بسببها. الواحدي: ثمة آيات تحتوي ضمائر أو شروطاً لا معنى لها إلا بمعرفة الحدث المُستوجِب", correct: true },
      { texte_fr: "Al-Wahidi affirme que chaque verset coranique a un sabab an-nuzul identifiable et documenté", texte_ar: "الواحدي يرى أن كل آية قرآنية لها سبب نزول محدد موثّق", correct: false },
      { texte_fr: "Le sabab an-nuzul remplace le sens général du verset et le limite à son contexte historique unique", texte_ar: "سبب النزول يحلّ محل المعنى العام للآية ويقيدها بسياقها التاريخي", correct: false },
      { texte_fr: "Al-Wahidi est le premier à avoir utilisé ce terme dans l'histoire du tafsir", texte_ar: "الواحدي هو أول من استخدم مصطلح سبب النزول في تاريخ التفسير", correct: false },
    ],
    explication: "Al-Wahidi (m. 468 AH) dans son livre 'Asbab an-Nuzul' : 'La connaissance des asbab an-nuzul est indispensable pour comprendre l'exégèse — on ne peut interpréter correctement un verset sans connaître son histoire et la raison de sa révélation.' Exemples : le verset 'inna shani'aka huwa-l-abtar' (108:3) — sans savoir qu'il fut révélé contre Al-'As ibn Wa'il qui traitait le Prophète ﷺ d''abtar' (sans postérité), le sens est flou. Règle fondamentale : 'al-'ibra bi 'umum al-lafz la bi khusus as-sabab' (la portée est celle du terme général, pas du cas particulier déclencheur).",
    dalil_ref: "Asbab an-Nuzul — Al-Wahidi · Al-Burhan — Az-Zarkashi 1/22 · Al-Itqan — As-Suyuti type 9",
  },
  {
    domaine: 'tafsir', niveau: 5,
    texte_fr: "Dans la sourate Al-Kahf (18:65-82), Moussa et Al-Khidr : quelle est la position des savants sur la prophétie d'Al-Khidr, et que signifient les trois actes qu'il accomplit ?",
    texte_ar: "في سورة الكهف ما موقف العلماء من نبوة الخضر وما دلالة أفعاله الثلاثة؟",
    reponses: [
      { texte_fr: "Débat : prophète (Ibn Hajar, majorité) ou wali (Ibn Al-Qayyim). Les 3 actes = dommage préventif / meurtre pour épargner une pire fitna / service gratuit = les 3 niveaux du 'ilm ladunni (science divine révélée directement)", texte_ar: "خلاف: نبي (ابن حجر والأكثر) أو ولي (ابن القيم). الأفعال الثلاثة: ضرر وقائي / قتل لدفع فتنة أشد / خدمة مجانية = مستويات العلم اللدني", correct: true },
      { texte_fr: "Al-Khidr était simplement un sage humain sans statut prophétique ni particulier selon Ibn Kathir", texte_ar: "الخضر كان حكيماً بشرياً عادياً بلا مكانة نبوية خاصة وفق ابن كثير", correct: false },
      { texte_fr: "Les trois actes symbolisent les trois piliers de l'Islam (foi, prière, zakat) selon le tafsir allégorique dominant", texte_ar: "الأفعال الثلاثة ترمز للأركان الثلاثة (إيمان وصلاة وزكاة) في التفسير الإشاري السائد", correct: false },
      { texte_fr: "La sourate Al-Kahf ne mentionne pas Al-Khidr par son nom, ce n'est donc pas lui selon les savants", texte_ar: "سورة الكهف لا تذكر الخضر باسمه لذا لا يعتبره العلماء شخصاً حقيقياً", correct: false },
    ],
    explication: "Sur la prophétie d'Al-Khidr : Ibn Hajar (Fath al-Bari 6/434) et la majorité : prophète, prouvé par la réception directe de la 'ilm ladunni (18:65 'wa 'allamnahu min ladunna 'ilman'). Ibn Al-Qayyim (Manar al-Munif) : wali (saint), car un prophète ne peut pas agir contre la shari'a. Les 3 actes et leurs symboles : (1) Trouer la barque = endommager volontairement pour épargner un confiscation par un roi injuste (priorité du moindre mal). (2) Tuer le garçon = le garçon allait devenir un rebelle qui entraînerait ses parents dans l'impiété (prévention d'une fitna plus grande). (3) Redresser le mur = serviabilité envers des orphelins sans contrepartie. Leçon : la science divine dépasse le jugement humain immédiat.",
    dalil_ref: "Tafsir Ibn Kathir 18:60-82 · Fath al-Bari — Ibn Hajar 6/434 · Manar al-Munif — Ibn Al-Qayyim",
  },
  {
    domaine: 'tafsir', niveau: 5,
    texte_fr: "Qu'est-ce que la 'qira'at mutawatirah' (القراءات المتواترة) et quelles sont les sept lectures (al-Qira'at as-Sab') codifiées par Ibn Mujahid ?",
    texte_ar: "ما القراءات المتواترة وما القراءات السبع التي دوّنها ابن مجاهد؟",
    reponses: [
      { texte_fr: "7 lectures authentiques codifiées par Ibn Mujahid (m. 324 AH) : Nafi', Ibn Kathir, Abu 'Amr, Ibn 'Amir, 'Asim, Hamzah, Al-Kisa'i — chacune avec deux sous-lectures (riwayatan)", texte_ar: "سبع قراءات متواترة دوّنها ابن مجاهد (ت324هـ): نافع وابن كثير وأبو عمرو وابن عامر وعاصم وحمزة والكسائي، لكل منها روايتان", correct: true },
      { texte_fr: "Les 7 lectures correspondent aux 7 ahruf mentionnés dans le hadith — c'est le consensus des savants", texte_ar: "القراءات السبع هي الأحرف السبعة المذكورة في الحديث بإجماع العلماء", correct: false },
      { texte_fr: "Il y a exactement 7 lectures car le Coran a 7 niveaux de sens selon la tradition soufie", texte_ar: "هناك سبع قراءات لأن للقرآن سبع طبقات معنوية وفق التراث الصوفي", correct: false },
      { texte_fr: "Ibn Mujahid a inventé les 7 lectures — elles n'existaient pas avant lui", texte_ar: "ابن مجاهد اخترع القراءات السبع ولم تكن موجودة قبله", correct: false },
    ],
    explication: "Ibn Mujahid (m. 324 AH) dans son livre 'Kitab as-Sab'a' a codifié 7 lectures canoniques tirées de 7 imam de récitation : (1) Nafi' (Médine, deux riwayat : Warsh et Qalun) (2) Ibn Kathir (Mecque) (3) Abu 'Amr al-Basri (Bassora) (4) Ibn 'Amir (Damas) (5) 'Asim al-Kufi (Kufa — riwayat Hafs et Shu'ba, la plus répandue aujourd'hui) (6) Hamzah al-Kufi (7) Al-Kisa'i (Kufa). ATTENTION : les savants précisent que les 7 qira'at ne sont PAS les 7 ahruf du hadith (Bukhari 4991) — erreur fréquente. Les qira'at sont des modalités de récitation, les ahruf sont un concept théologique plus large.",
    dalil_ref: "Kitab as-Sab'a — Ibn Mujahid · Al-Nashr fil Qira'at al-'Ashr — Ibn Al-Jazari · An-Nashr — Ibn Al-Jazari",
  },

  // ════════════════════════════════════════════════════════════
  // HADITH — questions de niveau mufti
  // ════════════════════════════════════════════════════════════
  {
    domaine: 'hadith', niveau: 5,
    texte_fr: "Qu'est-ce que le 'hadith mawdu'' (الحديث الموضوع) et quelles sont les trois preuves utilisées par les muhaddithin pour le détecter ?",
    texte_ar: "ما الحديث الموضوع وما الأدلة الثلاثة التي يستخدمها المحدثون لكشفه؟",
    reponses: [
      { texte_fr: "Mawdu' = forgé. Détection : (1) aveu du falsificateur, (2) contexte historique impossible (anachronisme), (3) contenu contredit par le Coran/Sunna mutawatira ou la raison", texte_ar: "موضوع = مكذوب. الكشف: (١) اعتراف الوضّاع، (٢) استحالة تاريخية، (٣) متن مناقض للقرآن والسنة المتواترة أو العقل", correct: true },
      { texte_fr: "Le mawdu' est détecté uniquement par des tests linguistiques sur le style arabe du texte", texte_ar: "الموضوع يُعرف بالتحليل اللغوي للأسلوب العربي فحسب", correct: false },
      { texte_fr: "Un hadith mawdu' est rejeté uniquement si les savants modernes l'ont tous classifié ainsi", texte_ar: "لا يُرد الحديث الموضوع إلا بإجماع المحدثين المعاصرين", correct: false },
      { texte_fr: "Les hadiths mawdu' sont reconnaissables car ils mentionnent uniquement des récompenses excessives", texte_ar: "الحديث الموضوع يُعرف بكثرة الثواب المبالغ فيه دائماً", correct: false },
    ],
    explication: "Les muhaddithin utilisent plusieurs méthodes pour détecter le mawdu' : (1) PREUVE DIRECTE : le faussaire avoue (ex: Ibn Abi Yahya, Waddah ibn Khaythama — confessions documentées). (2) PREUVE CONTEXTUELLE : le texte mentionne un événement historiquement impossible (ex: hadith prétendant que le Prophète ﷺ a rencontré Ali Zayn al-Abidin avant sa nubuwwa). (3) PREUVE TEXTUELLE : le matn (texte) contredit des axiomes coraniques, des hadiths mutawatir, ou la logique élémentaire. Ibn Al-Jawzi (Al-Mawdu'at) a répertorié des milliers de mawdu'at. Règle fondamentale de Ibn Al-Qayyim (Al-Manar al-Munif) : les hadiths sur les vertus des sourates spécifiques sont presque tous mawdu'.",
    dalil_ref: "Al-Mawdu'at — Ibn Al-Jawzi · Al-Manar al-Munif — Ibn Al-Qayyim · Nuzhat an-Nazhar — Ibn Hajar",
  },
  {
    domaine: 'hadith', niveau: 5,
    texte_fr: "Quelle est la différence entre 'al-jarh al-mubham' (الجرح المبهم) et 'al-jarh al-mufassar' (الجرح المفسَّر) et lequel prévaut sur l'autre ?",
    texte_ar: "ما الفرق بين الجرح المبهم والجرح المفسَّر وأيهما يُقدَّم على الآخر؟",
    reponses: [
      { texte_fr: "'Al-jarh al-mubham' = critique vague ('faible', 'rejeté') sans explication. 'Al-mufassar' = critique détaillée ('mentait', 'inversait les isnads'). Le mufassar prévaut sur le mubham ET sur le ta'dil (éloge)", texte_ar: "مبهم: جرح بلا بيان ('ضعيف، متروك'). مفسَّر: جرح بعلة ('كان يكذب، يقلب الأسانيد'). المفسَّر يُقدَّم على المبهم وعلى التعديل", correct: true },
      { texte_fr: "Le jarh mubham prévaut toujours car il représente la prudence maximale des savants", texte_ar: "الجرح المبهم يُقدَّم دائماً لأنه الأحوط عند العلماء", correct: false },
      { texte_fr: "Les deux types de jarh sont traités de la même façon et aucun ne prévaut sur l'autre", texte_ar: "النوعان يُعاملان بالتساوي ولا يُقدَّم أحدهما على الآخر", correct: false },
      { texte_fr: "Le ta'dil (éloge du narrateur) prévaut toujours sur tout type de jarh selon Imam Shafi'i", texte_ar: "التعديل يُقدَّم دائماً على كل أنواع الجرح عند الإمام الشافعي", correct: false },
    ],
    explication: "Règle fondamentale de 'ilm ar-rijal : le jarh al-mufassar (détaillé, précisant le défaut exact) prévaut sur : (a) le jarh al-mubham (vague) et (b) le ta'dil (éloge de fiabilité). Raison : l'imam qui éloge un narrateur a peut-être ignoré son défaut ; celui qui détaille son mensonge ou son erreur systématique a une connaissance supérieure. EXCEPTION : si le ta'dil vient de savants plus nombreux ou plus proches du narrateur, certains le font prévaloir sur un jarh isolé. Débat classique : jarh ou ta'dil en premier ? Al-Khatib al-Baghdadi (Al-Kifaya) : le jarh mufassar prévaut toujours.",
    dalil_ref: "Al-Kifaya fi 'Ilm ar-Riwaya — Al-Khatib al-Baghdadi · Nuzhat an-Nazhar — Ibn Hajar · Sharh Nukhba al-Fikar",
  },
  {
    domaine: 'hadith', niveau: 5,
    texte_fr: "Qu'est-ce que le hadith 'qudsi' (القدسي) et quelles sont ses deux caractéristiques qui le distinguent à la fois du Coran et du hadith nabawi ordinaire ?",
    texte_ar: "ما الحديث القدسي وما خاصيتاه اللتان يتميز بهما عن القرآن والحديث النبوي العادي؟",
    reponses: [
      { texte_fr: "Qudsi = sens vient d'Allah, formulation du Prophète ﷺ. Différence du Coran : non-mu'jiz, non-récité en salat, non-mutawatir dans sa totalité. Différence du nabawi : son sens est attribué directement à Allah",  texte_ar: "قدسي: المعنى من الله والصياغة للنبي ﷺ. يختلف عن القرآن: لا إعجاز ولا تلاوة ولا تواتر شامل. يختلف عن النبوي: ينسب المعنى لله مباشرة", correct: true },
      { texte_fr: "Le hadith qudsi est identique au Coran mais non-récité en prière — il jouit du même statut juridique", texte_ar: "الحديث القدسي مماثل للقرآن غير أنه لا يُتلى في الصلاة وله نفس الحكم الشرعي", correct: false },
      { texte_fr: "Le hadith qudsi est le terme pour désigner les hadiths dont l'isnad remonte directement à l'Ange Jibril", texte_ar: "الحديث القدسي مصطلح للأحاديث المسندة مباشرة إلى جبريل عليه السلام", correct: false },
      { texte_fr: "Tous les hadiths qudsis sont d'authenticité garantie (sahih) par définition", texte_ar: "كل الأحاديث القدسية صحيحة بتعريفها", correct: false },
    ],
    explication: "Le hadith qudsi : le sens (ma'na) vient d'Allah par inspiration (ilham) ou rêve au Prophète ﷺ, mais la formulation (lafzh) est du Prophète ﷺ lui-même. Différences avec le Coran : (1) le Coran est mu'jiz (inimitable), le hadith qudsi non ; (2) le Coran est récité en salat (obligatoire), le hadith qudsi non ; (3) le Coran est entièrement transmis par tawatur, les hadiths qudsis ont des niveaux d'authenticité variables. Différences avec le hadith nabawi ordinaire : dans le qudsi, le Prophète ﷺ dit explicitement 'Allah dit' (qala Allah) ou 'fima rawahu 'an Rabbihi' (ce qu'il rapporte de son Seigneur).",
    dalil_ref: "Al-Ithafat as-Saniyya — Al-Madani · Al-Manhaj as-Sawi — Al-Halfawi · Nuzhat an-Nazhar — Ibn Hajar",
  },
  {
    domaine: 'hadith', niveau: 5,
    texte_fr: "Qu'est-ce que la méthode du 'ta'arud wa tarjih' (التعارض والترجيح) et citez les 4 premières étapes dans l'ordre hiérarchique pour résoudre une contradiction apparente entre deux hadiths sahih ?",
    texte_ar: "ما منهج التعارض والترجيح بين الأحاديث وما أول أربع مراتبه في حل التعارض الظاهر بين حديثين صحيحين؟",
    reponses: [
      { texte_fr: "(1) Al-jam' = réconciliation (sens différents, contextes différents) → (2) An-nasikh wal-mansukh (le plus récent abroge le plus ancien) → (3) At-tarjih (préférer le plus solide dans l'isnad ou le matn) → (4) At-tawaqquf (suspension du jugement)", texte_ar: "(١) الجمع (السياقان مختلفان) ← (٢) الناسخ والمنسوخ (الأحدث ينسخ القديم) ← (٣) الترجيح (بقوة السند أو المتن) ← (٤) التوقف", correct: true },
      { texte_fr: "On commence toujours par le tarjih (préférence d'un hadith sur l'autre) puis la réconciliation", texte_ar: "يُبدأ دائماً بالترجيح ثم بالجمع", correct: false },
      { texte_fr: "Deux hadiths sahih ne peuvent jamais être en contradiction — toute contradiction apparente indique que l'un est en réalité da'if", texte_ar: "لا يمكن لحديثين صحيحين أن يتعارضا أبداً وكل تعارض ظاهر دليل على ضعف أحدهما", correct: false },
      { texte_fr: "On applique le ta'wil (interprétation allégorique) en premier avant tout autre méthode", texte_ar: "يُقدَّم التأويل على غيره من المراتب كأول خطوة", correct: false },
    ],
    explication: "Méthodologie de résolution des hadiths contradictoires établie par Ash-Shafi'i (Ar-Risala), Ibn Hazm (Al-Ihkam) et Ibn Hajar : (1) AL-JAM' : essayer de réconcilier les deux hadiths en montrant qu'ils parlent de situations différentes (priorité absolue car les deux hadiths sont alors tous les deux appliqués). (2) AN-NASIKH WAL-MANSUKH : si la réconciliation est impossible, le hadith chronologiquement postérieur abroge l'antérieur (nécessite une preuve de datation). (3) AT-TARJIH : si la date est inconnue, préférer le hadith le plus solide (isnad plus fort, narrateur plus précis, plus conforme au Coran). (4) AT-TAWAQQUF : si aucune méthode ne s'applique, suspendre le jugement.",
    dalil_ref: "Ar-Risala — Ash-Shafi'i § 200-360 · Al-Ihkam — Ibn Hazm · Sharh Nukhba al-Fikar — Ibn Hajar",
  },
  {
    domaine: 'hadith', niveau: 5,
    texte_fr: "Qui était Al-Imam Ad-Daraqutni (الدارقطني) et quelle est son œuvre majeure qui révolutionna la critique des hadiths à la fin du 3ème siècle hijri ?",
    texte_ar: "من الإمام الدارقطني وما مؤلَّفه الكبير الذي أحدث ثورة في نقد الحديث آخر القرن الثالث الهجري؟",
    reponses: [
      { texte_fr: "'Ali ibn 'Umar Ad-Daraqutni (m. 385 AH), hafiz de Bagdad, auteur de 'Al-'Ilal al-Warida fil-Ahadith an-Nabawiyya' (11 volumes sur les défauts cachés des hadiths) et du 'Sunan Ad-Daraqutni'", texte_ar: "علي بن عمر الدارقطني (ت385هـ) حافظ بغداد، صاحب 'العلل الواردة في الأحاديث النبوية' (١١ مجلداً) و'سنن الدارقطني'", correct: true },
      { texte_fr: "Ad-Daraqutni est l'auteur de 'Sunan al-Kubra' — le plus grand recueil de hadiths de l'école hanafite", texte_ar: "الدارقطني هو صاحب السنن الكبرى أعظم مصنفات الحديث الحنفي", correct: false },
      { texte_fr: "C'est un savant du 5ème siècle hijri connu uniquement pour sa critique du Sahih al-Bukhari", texte_ar: "هو عالم من القرن الخامس الهجري مشهور فقط بنقد صحيح البخاري", correct: false },
      { texte_fr: "Ad-Daraqutni a compilé les 7 lectures coraniques dans un seul ouvrage", texte_ar: "الدارقطني جمع القراءات السبع في مؤلَّف واحد", correct: false },
    ],
    explication: "'Ali ibn 'Umar Ad-Daraqutni (m. 385 AH / 995 CE), hafiz de Bagdad surnommé 'Amir al-Mu'minin fil-Hadith' de son époque. Son chef-d'œuvre 'Al-'Ilal al-Warida fil-Ahadith' (11 volumes) est la référence suprême sur les 'ilal — défauts cachés qui rendent un hadith en apparence sahih mais en réalité problématique. Chaque entrée analyse les multiples chaînes d'un hadith, détecte les confusions entre narrateurs, irsals dissimulés, etc. Son 'Sunan' complète les 'Kutub as-Sitta' en ajoutant des hadiths de rulings juridiques avec critique approfondie. Ad-Dhahabi : 'La science des 'ilal finit avec Ad-Daraqutni.'",
    dalil_ref: "'Al-'Ilal — Ad-Daraqutni · Siyar A'lam an-Nubala' — Ad-Dhahabi 16/449 · Tarikh Baghdad — Al-Khatib",
  },

  // ════════════════════════════════════════════════════════════
  // SIRAH — questions de niveau mufti
  // ════════════════════════════════════════════════════════════
  {
    domaine: 'sirah', niveau: 5,
    texte_fr: "Quel événement déclencha le boycott économique et social des Banu Hashim et des Banu Al-Muttalib à La Mecque (shi'b Abi Talib), et combien de temps dura-t-il ?",
    texte_ar: "ما الحدث الذي أفضى إلى الحصار الاقتصادي والاجتماعي لبني هاشم وبني المطلب في شعب أبي طالب وكم امتدّ؟",
    reponses: [
      { texte_fr: "Après l'échec des Quraysh à faire taire le Prophète ﷺ (~7ème année de nubuwwa), ils signèrent une charte de boycott complet (achat, vente, mariage, contact). Durée : ~3 ans. Fin : charte rongée aux fourmis sauf 'bismi-llah', découverte par Mut'im ibn Adi", texte_ar: "بعد فشل قريش في إسكات النبي ﷺ (نحو السنة 7) كتبوا وثيقة مقاطعة شاملة. مدتها: نحو 3 سنوات. انتهت بنبأ نقر النمل لها وبقاء 'بسم الله' — اكتشفها مطعم بن عدي", correct: true },
      { texte_fr: "Le boycott dura 7 ans et fut levé grâce à l'intervention d'Abu Sufyan qui négocia avec les musulmans", texte_ar: "استمر الحصار 7 سنوات وانتهى بتوسط أبي سفيان مع المسلمين", correct: false },
      { texte_fr: "Le boycott commença après la mort d'Abu Talib et fut levé par le Prophète ﷺ après l'Hégire", texte_ar: "بدأ الحصار بعد وفاة أبي طالب وانتهى بعد الهجرة", correct: false },
      { texte_fr: "La charte de boycott était une punition ciblant uniquement les Compagnons convertis, pas la famille du Prophète ﷺ", texte_ar: "وثيقة المقاطعة كانت عقوبة تستهدف المسلمين المتحولين فحسب لا آل النبي ﷺ", correct: false },
    ],
    explication: "Vers l'an 7 de la nubuwwa (~615 CE), les Quraysh rédigèrent une charte que 40+ chefs signèrent, suspendue à la Ka'ba. Elle interdisait : acheter, vendre, se marier avec, fréquenter ou accueillir les Banu Hashim et Banu Al-Muttalib tant qu'ils ne livreraient pas Muhammad ﷺ. Toute la famille, y compris les non-musulmans comme Abu Talib, fut enfermée dans le 'Shi'b Abi Talib'. Durée : ~3 ans de privations extrêmes. Fin : plusieurs Qurayshites (Hisham ibn 'Amr, Mut'im ibn Adi, Zubayr ibn Abi Umayya) proposèrent d'annuler la charte. Le Prophète ﷺ informa Abu Talib que les fourmis avaient rongé la charte sauf 'bismi-llah' — vérification confirma, la charte fut annulée.",
    dalil_ref: "As-Sirah An-Nabawiyya — Ibn Hisham 2/14 · Ar-Rahiq al-Makhtum — Al-Mubarakfuri · Al-Bidaya wan-Nihaya — Ibn Kathir 3/84",
  },
  {
    domaine: 'sirah', niveau: 5,
    texte_fr: "Quel est le contenu exact du document de l'Isra et du Mi'raj (الإسراء والمعراج) et quelles sont les trois principales controverses des savants sur leur nature ?",
    texte_ar: "ما مضمون حادثة الإسراء والمعراج وما الخلافات العلمية الثلاثة الكبرى حول طبيعتها؟",
    reponses: [
      { texte_fr: "Isra' (Mecque → Jérusalem) + Mi'raj (Jérusalem → 7 cieux). Controverses : (1) corps ou âme? (2) état de veille ou rêve? (3) avant ou après la hijra? — Majorité : corporel, éveillé, ~18 mois avant l'Hégire", texte_ar: "إسراء (مكة → القدس) + معراج (القدس → السماوات). الخلافات: (١) جسداً أم روحاً؟ (٢) يقظة أم رؤيا؟ (٣) قبل الهجرة بكم؟ — الجمهور: جسداً يقظة قبل الهجرة بنحو 18 شهراً", correct: true },
      { texte_fr: "Il n'y a aucun désaccord parmi les savants : il s'agit d'un voyage physique corporel en état de veille, 5 ans avant l'Hégire", texte_ar: "لا خلاف بين العلماء: رحلة جسدية في اليقظة قبل الهجرة بخمس سنوات", correct: false },
      { texte_fr: "Le Mi'raj s'est produit trois fois selon les sources les plus fiables de la Sirah", texte_ar: "المعراج وقع ثلاث مرات وفق أوثق مصادر السيرة", correct: false },
      { texte_fr: "La prière obligatoire de 5 prières par jour n'a pas été instituée lors du Mi'raj — c'est une méprise historique", texte_ar: "الصلوات الخمس لم تُفرض في المعراج وهذا مجرد خطأ تاريخي", correct: false },
    ],
    explication: "L'Isra' (17:1) : voyage nocturne de la masjid al-haram à la masjid al-aqsa. Le Mi'raj : ascension aux sept cieux, rencontre des prophètes, jusqu'au 'sidrat al-muntaha', institution des 5 prières (réduit de 50 grâce à Moussa ﷺ). Trois controverses classiques : (1) CORPS ET ÂME ou ÂME SEULE? Majorité (Ibn 'Abbas, Ibn Hisham) : corps et âme éveillés. Mu'awiya et 'A'isha (selon certaines narrations) : rêve. Preuve que c'était physique : 'la ville de La Mecque aurait immédiatement démenti s'il n'avait décrit Jérusalem qu'en rêve' (Ibn Ishaq). (2) MOMENT : avant ou après la hijra? Consensus : ~12-18 mois avant l'Hégire. (3) LIEU DE DÉPART : Maison de Khadija ou Masjid al-Haram? Ibn Hajar : ces deux traditions se complètent.",
    dalil_ref: "Sourate Al-Isra' (17:1) · An-Najm (53:13-18) · Sahih al-Bukhari 3887 · As-Sirah — Ibn Hisham 2/34",
  },
  {
    domaine: 'sirah', niveau: 5,
    texte_fr: "Quelles furent les conditions exactes du traité de Hudaybiyya (6 AH) et pourquoi 'Umar ibn Al-Khattab les jugea-t-il initialement humiliantes ?",
    texte_ar: "ما بنود صلح الحديبية (6هـ) تفصيلاً ولماذا رأى عمر بن الخطاب في بادئ الأمر أنها مُجحفة؟",
    reponses: [
      { texte_fr: "Conditions : (1) 10 ans de trêve, (2) retour des convertis de Médine à La Mecque si interceptés, (3) retour des apostats à La Mecque libre, (4) pèlerinage l'année suivante seulement. 'Umar : 'pourquoi accepter l'humiliation alors que nous sommes sur la vérité ?' — Abu Bakr lui rappela la confiance en Allah", texte_ar: "البنود: (١) هدنة 10 سنوات، (٢) رد المهاجرين المسلمين إن عادوا، (٣) لا رد المرتدين، (٤) العمرة العام القادم. عمر: 'لماذا نقبل الضيم ونحن على الحق؟' — أبو بكر ذكّره بالتوكل", correct: true },
      { texte_fr: "'Umar jugea les conditions humiliantes uniquement à cause de l'interdiction de la Umra cette année-là", texte_ar: "عمر رأى الإجحاف في منع العمرة ذلك العام فحسب", correct: false },
      { texte_fr: "Le traité fut rejeté par les Compagnons et le Prophète ﷺ l'imposa par sa seule autorité", texte_ar: "رفض الصحابة الصلح وفرضه النبي ﷺ بسلطته وحده", correct: false },
      { texte_fr: "La condition du retour des musulmans de Médine ne s'appliquait qu'aux femmes, pas aux hommes", texte_ar: "بند رد المهاجرين المسلمين كان يخص النساء فحسب لا الرجال", correct: false },
    ],
    explication: "Conditions détaillées du traité (Ibn Hisham · Bukhari 2731) : (1) Cessez-le-feu 10 ans (trêve complète). (2) Tout musulman fuyant de Médine vers La Mecque reste à La Mecque — non rendu. (3) Tout Médinois fuyant à La Mecque est RENDU aux Quraysh (condition la plus amère). (4) Chaque tribu peut s'allier librement aux deux camps. (5) Les musulmans rebroussent chemin cette année — umra l'an prochain. 'Umar interrogea Abu Bakr : 'N'est-il pas le Messager d'Allah ? Ne sommes-nous pas sur la vérité ? Pourquoi accepter cette abjection ?' Abu Bakr lui répondit de faire confiance au Prophète ﷺ. Suha yl ibn 'Amr (négociateur qurayshite) exigea aussi d'écrire 'Muhammad ibn Abdillah' au lieu de 'Muhammad Rasulullah' — le Prophète ﷺ l'accepta.",
    dalil_ref: "Sahih al-Bukhari 2731-2732 · As-Sirah — Ibn Hisham 3/308 · Sahih Muslim 1784",
  },
  {
    domaine: 'sirah', niveau: 5,
    texte_fr: "Qui était Waraqah ibn Nawfal (ورقة بن نوفل), quel rôle joua-t-il lors de la première Révélation, et quel était son statut religieux avant l'Islam ?",
    texte_ar: "من ورقة بن نوفل وما دوره عند نزول أول الوحي وما كان دينه قبل الإسلام؟",
    reponses: [
      { texte_fr: "Cousin de Khadija, ḥanif converti au christianisme, avait traduit l'Évangile en arabe. Quand Khadija le consulta, il identifia le 'namus' (l'Ange) qui vint à Moussa ﷺ et prédit la persécution du Prophète ﷺ. Mort peu après, statut eschatologique : débattu", texte_ar: "ابن عم خديجة، حنيف تنصّر وترجم الإنجيل للعربية. لما استشارته خديجة أثبت أنه الناموس الذي جاء لموسى وتنبّأ بإخراج النبي ﷺ. مات بعد ذلك بقليل وحاله في الآخرة مختلف فيه", correct: true },
      { texte_fr: "Waraqah était un rabbin juif de Médine qui voyagea à La Mecque spécialement pour rencontrer le Prophète ﷺ", texte_ar: "كان ورقة حاخاماً يهودياً من المدينة سافر خصيصاً للقاء النبي ﷺ بمكة", correct: false },
      { texte_fr: "Il était un simple marchand sans formation religieuse qui reconnut le Prophète ﷺ grâce à ses voyages en Syrie", texte_ar: "كان تاجراً عادياً بلا تكوين ديني عرف النبي ﷺ من أسفاره في الشام", correct: false },
      { texte_fr: "Waraqah fut le premier homme à embrasser officiellement l'Islam en récitant la shahada devant le Prophète ﷺ", texte_ar: "كان ورقة أول رجل أعلن إسلامه بالشهادة أمام النبي ﷺ رسمياً", correct: false },
    ],
    explication: "Waraqah ibn Nawfal ibn Asad Al-Qurashi — cousin de Khadija (ibn 'ammiha). Il était ḥanif (monothéiste abrahamique) puis se convertit au christianisme, apprit le syriaque et traduisit des parties de l'Évangile en arabe. Quand Khadija lui rapporta le récit de la première Révélation (ghar Hira'), il dit : 'C'est le Namus (الناموس — l'Ange de Révélation) qui vint à Moussa.' Puis : 'Tu seras traité de menteur, persécuté, chassé et combattu — si je vis jusqu'à ce jour, je te soutiendrai de tout.' Il mourut peu de temps après, avant que la persécution ne commence vraiment. Débat : le Prophète ﷺ dit qu'il était vu en rêve portant des vêtements blancs (symbole de bien) — Ibn Hajar penche pour sa récompense dans l'Au-delà sans conclure formellement.",
    dalil_ref: "Sahih al-Bukhari 3 (premier hadith) · Sahih Muslim 160 · As-Sirah — Ibn Hisham 1/238 · Fath al-Bari — Ibn Hajar 1/21",
  },

  // ════════════════════════════════════════════════════════════
  // FIQH — set 2
  // ════════════════════════════════════════════════════════════
  {
    domaine: 'fiqh', niveau: 5,
    texte_fr: "Qu'est-ce que l'istihsan selon les Hanafis, et en quoi diffère-t-il fondamentalement du qiyas ?",
    texte_ar: "ما الاستحسان عند الحنفية وكيف يختلف جوهرياً عن القياس؟",
    reponses: [
      { texte_fr: "L'istihsan est un abandon du qiyas apparent au profit d'un qiyas caché plus fort, d'un nass ou d'un ijma' — il ne s'agit pas d'une opinion libre mais d'un dalil concurrent plus puissant", texte_ar: "الاستحسان عدول عن القياس الظاهر لقياس خفي أقوى أو نص أو إجماع، وليس رأياً حراً بل دليل مُعارِض أقوى", correct: true },
      { texte_fr: "L'istihsan est une forme de ra'y (opinion personnelle) sans fondement textuel — c'est ce que lui reprochait Ash-Shafi'i", texte_ar: "الاستحسان نوع من الرأي الشخصي بلا أصل نصي وهذا ما أنكره الشافعي عليه", correct: false },
      { texte_fr: "L'istihsan est identique à la masalih mursala de Malik — les deux procédés sont interchangeables en fiqh comparé", texte_ar: "الاستحسان مطابق للمصالح المرسلة عند مالك والمصطلحان متبادلان في الفقه المقارن", correct: false },
      { texte_fr: "L'istihsan Hanafi signifie adopter l'opinion la plus facile pour faciliter la vie des gens (taysir)", texte_ar: "الاستحسان الحنفي يعني اختيار الأيسر تيسيراً على الناس", correct: false },
    ],
    explication: "Pour les Hanafis, l'istihsan n'est pas une opinion libre mais un raisonnement structuré : le mujtahid identifie deux qiyas possibles — l'un apparent/général, l'autre caché/particulier — et choisit le second car il est plus conforme à l'esprit du nass ou évite un résultat absurde. Ash-Shafi'i a critiqué l'istihsan en croyant qu'il s'agit d'une opinion sans base (cf. Ar-Risala), mais les Hanafis répondent que leur istihsan a toujours un support dalil. Ibn Al-Qudama (Al-Mughni) et Al-Sarakhsi (Al-Mabsut 10/144) exposent ces nuances.",
    dalil_ref: "Al-Mabsut — As-Sarakhsi 10/144 · Usul al-Fiqh — Al-Bazdawi · Ar-Risala — Ash-Shafi'i §1479",
  },
  {
    domaine: 'fiqh', niveau: 5,
    texte_fr: "Quelle est la doctrine de la 'sadd adh-dhara'i'' (سد الذرائع) et dans quel madhab est-elle la plus développée ?",
    texte_ar: "ما مذهب سد الذرائع وفي أي مذهب بلغت أوسع تطبيقاتها؟",
    reponses: [
      { texte_fr: "Sadd adh-dhara'i' = interdire les actes licites qui mènent probablement à l'illicite. Plus développée chez les Malikites (Al-Qarafi, Ibn Rushd), adoptée aussi par les Hanbalites, restreinte chez les Hanafis et Shafi'is", texte_ar: "سد الذرائع: تحريم المباح الذي يُفضي غالباً للحرام. أوسعها عند المالكية (القرافي، ابن رشد)، وأخذ بها الحنابلة، وضيّقها الحنفية والشافعية", correct: true },
      { texte_fr: "Sadd adh-dhara'i' est un principe exclusivement Hanafi non reconnu par les autres madhahibs", texte_ar: "سد الذرائع مبدأ حنفي حصري لا يعترف به سائر المذاهب", correct: false },
      { texte_fr: "Ce principe interdit tout acte dont l'intention finale est mauvaise, mais ne concerne pas les actes extérieurement licites", texte_ar: "هذا المبدأ يحرم كل فعل نيته النهائية سيئة لكن لا يتعلق بالأفعال المباحة ظاهراً", correct: false },
      { texte_fr: "Sadd adh-dhara'i' est le nom donné à l'istihsan dans l'école Malikite", texte_ar: "سد الذرائع هو تسمية الاستحسان في المذهب المالكي", correct: false },
    ],
    explication: "Al-Qarafi (Al-Furuq 2/32) définit quatre catégories de dhara'i' selon la probabilité de mener à l'interdit : rare (ignoré), probable mais faible (débattu), fréquent/prévisible (interdit), certain (définitivement interdit). Exemples classiques : interdire la vente de raisin à un fabricant de vin connu, interdit les nikah at-tahlil (mariage de complaisance). Ibn Al-Qayyim (I'lam al-Muwaqqi'in 3/109) consacre un chapitre entier aux dhara'i' et leurs conditions.",
    dalil_ref: "Al-Furuq — Al-Qarafi 2/32 · I'lam al-Muwaqqi'in — Ibn Al-Qayyim 3/109 · Al-Muwafaqat — Ash-Shatibi 4/198",
  },
  {
    domaine: 'fiqh', niveau: 5,
    texte_fr: "Dans la jurisprudence Shafi'ite, qu'est-ce que la 'qawl qadim' et la 'qawl jadid' d'Imam Ash-Shafi'i, et laquelle fait autorité ?",
    texte_ar: "ما القول القديم والقول الجديد للإمام الشافعي وأيهما المعتمد؟",
    reponses: [
      { texte_fr: "Qawl qadim = opinions irakiennes (avant l'Égypte), qawl jadid = opinions égyptiennes (révisées après son déménagement). En principe, le jadid prévaut. Exception : une quinzaine de qawl qadim sont retenus par les mutaakhkhirin car le jadid sur ces points est jugé plus faible", texte_ar: "القول القديم آراؤه العراقية، والجديد آراؤه المصرية المراجَعة. الأصل تقديم الجديد. استثناء: نحو خمسة عشر قولاً قديماً أبقاه المتأخرون لضعف الجديد في تلك المسائل", correct: true },
      { texte_fr: "Le qawl qadim concerne les questions d'adoration, le qawl jadid les transactions — les deux sont obligatoires selon le domaine", texte_ar: "القول القديم في العبادات والجديد في المعاملات وكلاهما ملزم حسب الباب", correct: false },
      { texte_fr: "Ash-Shafi'i lui-même a ordonné de brûler ses qawl qadim — ils ne font plus partie du madhab", texte_ar: "الشافعي أمر بإحراق قوله القديم وهو لم يعد من المذهب أصلاً", correct: false },
      { texte_fr: "Le qawl jadid est réservé aux fatawas en Égypte uniquement — pour les autres régions le qawl qadim est préférable", texte_ar: "القول الجديد للفتوى في مصر فحسب وفي سائر البلاد يُفضَّل القديم", correct: false },
    ],
    explication: "Ash-Shafi'i s'est installé en Égypte vers 199H et a révisé nombre de ses positions irakiennes (influencées par les Hanafis) à la lumière des hadiths trouvés en Égypte et au Hijaz. An-Nawawi (Al-Majmu' 1/65) liste une quinzaine de positions où les Shafi'ites tardifs maintiennent le qawl qadim : ex. la question de la prière du voyageur résident temporaire. Ibn Hajar Al-Haytami et Ar-Ramli ont chacun retenu parfois des positions différentes, d'où les deux branches du madhab (Shuyukh al-Hijaz vs Shuyukh ash-Sham).",
    dalil_ref: "Al-Majmu' Sharh al-Muhadhdhab — An-Nawawi 1/65 · Tuhfat al-Muhtaj — Ibn Hajar Al-Haytami 1/12 · Minhaj at-Talibin — An-Nawawi",
  },
  {
    domaine: 'fiqh', niveau: 5,
    texte_fr: "Quelle est la condition de la 'kafa'a' (compatibilité/égalité) dans le mariage selon les quatre madhahibs ?",
    texte_ar: "ما شرط الكفاءة في النكاح عند المذاهب الأربعة؟",
    reponses: [
      { texte_fr: "Hanafi/Hanbali : la kafa'a inclut nasab, dîn, hirfa, hurriyya, yusra. Maliki : seul le dîn compte (taqwa). Shafi'i : nasab + dîn uniquement. Tous : la kafa'a est un droit de la femme et des awliya', non du mari — elle peut y renoncer avec l'accord du wali", texte_ar: "حنفي/حنبلي: النسب والدين والحرفة والحرية واليسار. مالكي: الدين فحسب (التقوى). شافعي: النسب والدين. الجميع: حق للمرأة والأولياء لا للزوج", correct: true },
      { texte_fr: "Tous les madhahibs s'accordent que la kafa'a est obligatoire uniquement dans le nasab (généalogie tribale)", texte_ar: "المذاهب الأربعة متفقة أن الكفاءة واجبة في النسب فحسب", correct: false },
      { texte_fr: "La kafa'a est considérée nulle et non avenue dans tous les madhahibs selon le verset 'inna akramakum'", texte_ar: "الكفاءة ملغاة في المذاهب الأربعة بدلالة آية (إن أكرمكم)", correct: false },
      { texte_fr: "Seul l'Imam Malik exigeait la kafa'a — les autres imams la rejetaient totalement comme bid'a", texte_ar: "مالك وحده اشترط الكفاءة وسائر الأئمة رفضوها كلياً كبدعة", correct: false },
    ],
    explication: "La kafa'a est une condition de perfectionnement (shart kamal) non de validité (shart sihha) selon la majorité — un mariage sans kafa'a est valide mais les awliya' peuvent le faire résilier. Les Hanafis sont les plus larges en définissant 6 critères. Les Malikites (Ibn Rushd, Bidayat al-Mujtahid 2/12) se limitent au dîn car le Prophète ﷺ a dit 'si quelqu'un dont vous agréez la religion et le caractère vous demande, mariez-le' (Ibn Majah 1967). Les Shafi'ites ajoutent le nasab pour protéger les intérêts tribaux documentés dans les hadiths sur les Quraysh.",
    dalil_ref: "Bidayat al-Mujtahid — Ibn Rushd 2/12 · Al-Mabsut — As-Sarakhsi 5/24 · Ibn Majah 1967",
  },
  {
    domaine: 'fiqh', niveau: 5,
    texte_fr: "Qu'est-ce que la règle 'al-umur bi-maqasidiha' (الأمور بمقاصدها) et comment s'applique-t-elle à un acte d'adoration avec double intention ?",
    texte_ar: "ما قاعدة الأمور بمقاصدها وكيف تُطبَّق على عبادة نُويت بها نيتان؟",
    reponses: [
      { texte_fr: "Les actes sont jugés selon leurs intentions (niyyat). Si quelqu'un jeûne le 9 Dhu'l-Hijja en cumulant l'intention de jeûne volontaire + kaффара, les fuqaha' divergent : les Hanafis admettent la double intention pour les ibadats élargies ; les Shafi'ites exigent une intention pure pour chaque ibadat obligatoire distincte", texte_ar: "الأعمال بالنيات. من صام يوم عرفة بنية التطوع والكفارة معاً: الحنفية تجيز الجمع في الإبادات الموسعة. الشافعية تشترط نية خالصة لكل عبادة مستقلة", correct: true },
      { texte_fr: "La règle 'al-umur bi-maqasidiha' s'applique uniquement aux transactions (mu'amalat) et non aux ibadats selon l'ijma'", texte_ar: "قاعدة الأمور بمقاصدها تتعلق بالمعاملات فحسب دون العبادات بالإجماع", correct: false },
      { texte_fr: "Deux intentions pour un seul acte sont toujours valides en fiqh islamique — c'est la règle générale sans exception", texte_ar: "نيتان لعمل واحد صحيحتان دائماً في الفقه الإسلامي وهي القاعدة العامة بلا استثناء", correct: false },
      { texte_fr: "Cette règle signifie que l'intention annule l'acte extérieur — seule la niyya intérieure compte, l'acte physique est secondaire", texte_ar: "القاعدة تعني أن النية تلغي الفعل الظاهر وأن النية الداخلية هي المعتبرة فحسب", correct: false },
    ],
    explication: "Cette règle fondamentale (tirée du hadith 'Innamal a'malu bin-niyyat' — Bukhari 1, Muslim 1907) est la première des cinq qawa'id kubra du fiqh islamique selon As-Suyuti (Al-Ashbah wan-Naza'ir p.8). Son application aux ibadats multiples est débattue : les Hanafis permettent de cumuler ex. la prière de tahiyyat al-masjid avec la sunna ratiba (car l'une absorbe l'autre). Les Shafi'ites distinguent selon que l'ibadat est maqsuda li-nafsiha (visée pour elle-même) ou wasi'a (élargie). Ibn Rajab (Jami' al-'Ulum p.17) détaille 30+ applications de cette règle.",
    dalil_ref: "Bukhari 1 · Al-Ashbah wan-Naza'ir — As-Suyuti p.8 · Jami' al-'Ulum wal-Hikam — Ibn Rajab p.17",
  },

  // ════════════════════════════════════════════════════════════
  // AQIDA — set 2
  // ════════════════════════════════════════════════════════════
  {
    domaine: 'aqida', niveau: 5,
    texte_fr: "Quelle est la distinction entre 'tawhid ar-rububiyya', 'tawhid al-uluhiyya' et 'tawhid al-asma' was-sifat' selon Ibn Taymiyya ?",
    texte_ar: "ما الفرق بين توحيد الربوبية والألوهية والأسماء والصفات عند ابن تيمية؟",
    reponses: [
      { texte_fr: "Rububiyya = unicité d'Allah dans la création/sustentation/gouvernance. Uluhiyya = unicité dans l'adoration (le but visé par les prophètes). Asma' was-sifat = affirmer les attributs d'Allah tels que transmis sans ta'til ni takyif. La rububiyya sans uluhiyya ne suffit pas — les mushrikun l'admettaient (Q.31:25)", texte_ar: "الربوبية: إفراده بالخلق والرزق والتدبير. الألوهية: إفراده بالعبادة (المقصود الأساسي للرسالات). الأسماء والصفات: إثباتها كما جاءت بلا تعطيل ولا تكييف. الربوبية وحدها لا تكفي لأن المشركين أقروا بها (31:25)", correct: true },
      { texte_fr: "Les trois formes de tawhid sont interchangeables et cette classification tripartite est une innovation d'Ibn Taymiyya non admise par les Ash'arites", texte_ar: "أنواع التوحيد الثلاثة متداخلة وهذا التقسيم الثلاثي ابتداع ابن تيمية لا يقبله الأشاعرة", correct: false },
      { texte_fr: "Tawhid ar-rububiyya est le plus élevé des trois car il inclut automatiquement les deux autres", texte_ar: "توحيد الربوبية أعلى الأنواع الثلاثة لأنه يتضمن الآخرَين تلقائياً", correct: false },
      { texte_fr: "Cette classification est tirée du Sahih Bukhari et était connue de tous les Compagnons sous ces termes exacts", texte_ar: "هذا التقسيم مأخوذ من صحيح البخاري وعُرف به الصحابة بهذه المصطلحات الدقيقة", correct: false },
    ],
    explication: "Ibn Taymiyya (Majmu' al-Fatawa 1/5) systématise ce que le Quran enseigne implicitement. La rububiyya seule ne sauve pas — Abou Soufyan avant l'Islam admettait qu'Allah crée et sustente mais adorait des idoles. La uluhiyya (ou tawhid al-'ibada) est l'objectif central des prophètes : 'Nous n'avons envoyé avant toi aucun messager sans lui révéler : il n'y a de dieu que Moi, adorez-Moi' (21:25). Les Ash'arites structurent le tawhid différemment (sifat dhatiyya vs fi'liyya) — les deux approches sont légitimes mais Ibn Taymiyya argumente que la sienne est plus conforme à l'usage coranique.",
    dalil_ref: "Majmu' al-Fatawa — Ibn Taymiyya 1/5 · Al-'Aqida al-Wasitiyya · Q.31:25, Q.21:25",
  },
  {
    domaine: 'aqida', niveau: 5,
    texte_fr: "Qu'est-ce que le débat 'ta'wil vs tafwid' concernant les attributs divins anthropomorphiques entre les mutaqaddimun et les mutaakhkhirun ?",
    texte_ar: "ما الجدل بين التأويل والتفويض في الصفات المتشابهة بين المتقدمين والمتأخرين؟",
    reponses: [
      { texte_fr: "Les mutaqaddimun (Salaf) pratiquaient le tafwid du kayf (comment) en affirmant le sens lexical. Les mutaakhkhirun Ash'arites pratiquaient le ta'wil (réinterprétation vers un sens figuré). Ibn Taymiyya critique le tafwid du sens comme une bid'a — les Salaf affirmaient le sens tout en niant la ressemblance", texte_ar: "المتقدمون (السلف) فوّضوا الكيف مع إثبات المعنى اللغوي. المتأخرون الأشاعرة أوّلوا (حمل على المعنى المجازي). ابن تيمية ينتقد تفويض المعنى كبدعة — السلف أثبتوا المعنى ونفوا المشابهة", correct: true },
      { texte_fr: "Le tafwid consiste à nier tous les attributs d'Allah — c'est la position des Jahmiyya acceptée par les premiers Ash'arites", texte_ar: "التفويض يعني نفي جميع صفات الله وهو موقف الجهمية قَبِله الأشاعرة الأوائل", correct: false },
      { texte_fr: "Tous les Salaf pratiquaient le ta'wil des attributs anthropomorphiques — c'est la position d'Ibn Al-Jawzi dans Daf' Shubah at-Tashbih", texte_ar: "جميع السلف أوّلوا الصفات المتشابهة وهو ما يؤكده ابن الجوزي في دفع شبه التشبيه", correct: false },
      { texte_fr: "Le débat ta'wil/tafwid est purement théorique et n'a aucune implication pratique sur l'adoration quotidienne", texte_ar: "الجدل بين التأويل والتفويض نظري بحت وليس له أثر عملي على العبادة اليومية", correct: false },
    ],
    explication: "Ibn Taymiyya (Dar' Ta'arud al-'Aql wan-Naql, Al-Fatwa al-Hamawiyya) distingue : tafwid al-kayf (nier comment Allah 'monte' sur le Trône — admis par le Salaf) vs tafwid al-ma'na (nier que 'istawwa' signifie quoi que ce soit — rejeté comme agnosticisme théologique). Al-Bayhaqi et Al-Asqalani représentent le ta'wil Ash'arite modéré. Cette controverse est centrale pour comprendre pourquoi les ouvrages d'aqida du 7e-8e siècle H (Ibn Qudama, Adh-Dhahabi) prennent des positions nuancées entre les deux écoles.",
    dalil_ref: "Dar' Ta'arud — Ibn Taymiyya · Al-Fatwa al-Hamawiyya al-Kubra · Al-Asma' was-Sifat — Al-Bayhaqi",
  },
  {
    domaine: 'aqida', niveau: 5,
    texte_fr: "Quelle est la position Ash'arite sur la 'ru'ya' (vision d'Allah au Paradis) et quels sont les versets coraniques utilisés de part et d'autre ?",
    texte_ar: "ما الموقف الأشعري من رؤية الله في الجنة وما الآيات المستدل بها من الفريقين؟",
    reponses: [
      { texte_fr: "Les Ash'arites affirment la ru'ya comme haqq (vérité établie) par le hadith 'tara'wna rabbakum' (Bukhari 554) et Q.75:23. Ils réfutent la Mu'tazila qui cite Q.7:143 (Musa ne voit pas) en précisant que 'lan tarani' concernait ce bas-monde, pas l'Au-delà", texte_ar: "الأشاعرة يثبتون الرؤية حقاً بحديث 'ترون ربكم' (بخاري 554) وآية 75:23. يردون المعتزلة الذين احتجوا بـ7:143 بأن 'لن تراني' في الدنيا لا الآخرة", correct: true },
      { texte_fr: "Les Ash'arites nient la ru'ya car elle implique une direction (jiha) pour Allah — c'est la position de Al-Juwayni dans Al-Irshad", texte_ar: "الأشاعرة ينفون الرؤية لأنها تستلزم الجهة لله وهو موقف الجويني في الإرشاد", correct: false },
      { texte_fr: "La ru'ya est affirmée par les Mu'tazilites et niée par les Ash'arites — c'est l'inverse de la position populaire connue", texte_ar: "المعتزلة يثبتون الرؤية والأشاعرة ينفونها عكس المعروف شعبياً", correct: false },
      { texte_fr: "La ru'ya est une métaphore spirituelle (kashf) non une vision physique — c'est le consensus Ash'arite et Maturidite", texte_ar: "الرؤية معنوية كشفية لا بصرية جسدية وهذا إجماع الأشاعرة والماتريدية", correct: false },
    ],
    explication: "Q.75:22-23 : 'Wujuhun yawma'idhin nadirah, ila rabbiha nadhirah' — verbes de vision directe. Bukhari 554/555 : analogie du soleil/pleine lune sans nuages pour la clarté de la vision divine. Les Mu'tazilites s'appuient sur Q.6:103 'la tudrikuhu al-absar' et Q.7:143 pour nier la ru'ya. Les Ash'arites (Al-Ghazali, Iqtisad ; Al-Juwayni, Al-Irshad chap.15) répondent que 'idrak' ≠ 'ru'ya' (la vision ne nécessite pas l'encompassement) et que Q.7:143 est contextuel à Musa en ce monde. C'est l'un des points de fracture majeurs entre Sunnites et Mu'tazilites.",
    dalil_ref: "Bukhari 554-555 · Q.75:22-23, Q.7:143, Q.6:103 · Al-Irshad — Al-Juwayni chap.15 · Al-Iqtisad — Al-Ghazali",
  },
  {
    domaine: 'aqida', niveau: 5,
    texte_fr: "Quelle est la doctrine de la 'shafa'a al-'uzma' (grande intercession) et qui y a droit selon les catégories établies par les savants ?",
    texte_ar: "ما عقيدة الشفاعة العظمى وما أنواع الشفاعة الثابتة للنبي ﷺ؟",
    reponses: [
      { texte_fr: "La shafa'a al-'uzma : le Prophète ﷺ intercède pour que le Jugement commence (maqam mahmud, Q.17:79). Autres shafa'at : pour les pécheurs de sa umma, pour l'élévation des degrés au Paradis, pour entrer au Paradis sans reddition de comptes. Condition : permission d'Allah (Q.2:255) et agrément envers l'intercesseur et l'intercédé", texte_ar: "الشفاعة العظمى: يشفع للفصل بالقضاء (المقام المحمود، 17:79). غيرها: لمذنبي أمته، لرفع درجات، للدخول بغير حساب. شرطها: إذن الله (2:255) ورضاه عن الشافع والمشفوع", correct: true },
      { texte_fr: "La shafa'a al-'uzma est réservée aux prophètes sans rang — tous les prophètes intercèdent en même temps le Jour du Jugement", texte_ar: "الشفاعة العظمى للأنبياء جميعاً دون ترتيب وكلهم يشفعون في آنٍ واحد يوم القيامة", correct: false },
      { texte_fr: "La Mu'tazila accepte la shafa'a al-'uzma uniquement car elle est citée dans le Quran — les autres formes de shafa'a sont bid'a selon eux", texte_ar: "المعتزلة تقبل الشفاعة العظمى فقط لورودها في القرآن وسائر أنواعها بدعة عندهم", correct: false },
      { texte_fr: "Selon Ibn Taymiyya, la shafa'a ne bénéficie qu'aux non-pécheurs (mu'minun purs) — les pécheurs de l'umma en sont exclus", texte_ar: "الشفاعة عند ابن تيمية خاصة بالمؤمنين الأتقياء دون المذنبين من الأمة", correct: false },
    ],
    explication: "Hadith al-maqam al-mahmud (Bukhari 4718) : le Prophète ﷺ sera le premier à intercéder pour que le Jugement commence après que tous les autres prophètes se récusent ('nafsi nafsi'). An-Nawawi (Sharh Muslim 3/58) répertorie 5 types de shafa'a. La Mu'tazila nie toute shafa'a pour les pécheurs (car ils méritent l'enfer éternellement), s'appuyant sur Q.2:48. Les Sunnites répondent avec Q.2:255 et 20:109 qui conditionnent la shafa'a à la permission divine — elle ne contredit pas la justice mais est accordée par la grâce d'Allah.",
    dalil_ref: "Bukhari 4718 · Q.17:79, Q.2:255, Q.20:109 · Sharh Muslim — An-Nawawi 3/58",
  },
  {
    domaine: 'aqida', niveau: 5,
    texte_fr: "Quelle est la position de l'école Maturidite sur la question 'est-ce qu'Allah peut faire des actes injustes (qabih) ?' — et comment diffère-t-elle de l'école Ash'arite ?",
    texte_ar: "ما موقف الماتريدية في مسألة 'هل يقدر الله على القبيح؟' وكيف يختلف عن الأشاعرة؟",
    reponses: [
      { texte_fr: "Maturidites : Allah est capable de faire ce qui est théoriquement qabih mais ne le fait pas — la question porte sur le pouvoir (qudra) séparé de l'acte. Ash'arites : ce qui vient d'Allah est par définition hasan — le qubh est conceptuellement impossible de Sa part. Les deux nient l'injustice divine mais divergent sur le cadre conceptuel", texte_ar: "الماتريدية: الله قادر نظرياً على القبيح لكنه لا يفعله. الأشاعرة: ما يصدر من الله حسن بتعريف — القبح منه مستحيل مفهومياً. كلاهما ينفي الظلم الإلهي لكن الإطار المفاهيمي مختلف", correct: true },
      { texte_fr: "Les Maturidites et Ash'arites sont identiques sur cette question — Ibn 'Abidin (Hanafi) confirme qu'il n'y a aucune différence entre les deux écoles", texte_ar: "الماتريدية والأشاعرة متطابقان في هذه المسألة وابن عابدين الحنفي يؤكد عدم الفرق", correct: false },
      { texte_fr: "Les Maturidites rejoignent la Mu'tazila en disant qu'Allah est 'obligé' de faire le bien (wujub al-aslah)", texte_ar: "الماتريدية يوافقون المعتزلة في القول بوجوب الأصلح على الله", correct: false },
      { texte_fr: "Les Ash'arites affirment qu'Allah peut agir injustement mais ne le fait pas — c'est leur distinction avec les Mu'tazilites", texte_ar: "الأشاعرة يقولون إن الله يمكنه الظلم لكن لا يفعله وهو فارقهم عن المعتزلة", correct: false },
    ],
    explication: "Cette divergence subtile entre Maturidites (école de Samarcande, suivie par les Hanafis d'Asie centrale) et Ash'arites (école de Bagdad/Caire, suivie par Malikites et Shafi'ites) touche à la théologie du pouvoir divin. Al-Maturidi (Kitab at-Tawhid p.234) : Allah a la qudra sur tout, mais Sa sagesse (hikma) l'empêche de faire le qabih. Al-Ash'ari (Al-Luma') : le qubh est défini par opposition à la volonté divine — donc l'acte d'Allah ne peut être qabih par définition. Pratiquement, les deux concluent la même chose (Allah ne fait pas injustice) mais le chemin philosophique diffère.",
    dalil_ref: "Kitab at-Tawhid — Al-Maturidi p.234 · Al-Luma' — Al-Ash'ari · Al-Musayara — Ibn al-Humam",
  },

  // ════════════════════════════════════════════════════════════
  // TAFSIR — set 2
  // ════════════════════════════════════════════════════════════
  {
    domaine: 'tafsir', niveau: 5,
    texte_fr: "Quelle est la distinction entre 'nasikh wa mansukh' dans le Quran et quels sont ses trois types selon les usuliyyun ?",
    texte_ar: "ما الفرق بين الناسخ والمنسوخ في القرآن وما أنواعه الثلاثة عند الأصوليين؟",
    reponses: [
      { texte_fr: "Trois types : (1) mansukh at-tilawa wa-l-hukm (verset et loi abrogés — ex. 'dix tétées') ; (2) baqiy at-tilawa, mansukh al-hukm (verset reste mais loi abrogée — ex. verset de l'attente 4 mois 10j) ; (3) mansukh at-tilawa, baqiy al-hukm (verset effacé mais loi reste — ex. hadith rajm selon Ibn 'Umar)", texte_ar: "ثلاثة أنواع: (1) منسوخ التلاوة والحكم (آية العشر رضعات). (2) باقي التلاوة منسوخ الحكم (آية عدة الوفاة). (3) منسوخ التلاوة باقي الحكم (حديث الرجم عن ابن عمر)", correct: true },
      { texte_fr: "Il n'existe qu'un seul type de naskh : le verset remplaçant est postérieur et annule totalement le verset antérieur (tilawa + hukm ensemble)", texte_ar: "النسخ نوع واحد فقط: الآية المتأخرة تلغي المتقدمة تلاوةً وحكماً معاً", correct: false },
      { texte_fr: "Le naskh dans le Quran est rejeté par les quatre madhahibs car cela implique que le Quran contient des erreurs", texte_ar: "النسخ في القرآن مرفوض عند المذاهب الأربعة لأنه يستلزم وجود أخطاء فيه", correct: false },
      { texte_fr: "Le nasikh est toujours un verset mecquois remplaçant un verset médinois — l'ordre chronologique est constant", texte_ar: "الناسخ دائماً مكي ينسخ المدني والترتيب الزمني ثابت دائماً", correct: false },
    ],
    explication: "Ibn Al-Jawzi (Nawasikh al-Quran) et As-Suyuti (Al-Itqan 2/20) détaillent les trois types. Type 1 : 'dix tétées interdisent le mariage' abrogé par 'cinq tétées' — ni le premier verset ni le premier hukm ne sont dans le Mushaf final. Type 2 : Q.2:240 (attente d'un an pour la veuve) abrogé dans le hukm par Q.2:234 (4 mois 10j) mais le verset reste pour récitation. Type 3 : le plus controversé — le Prophète ﷺ aurait récité un verset sur le rajm (lapidation) ultérieurement retiré du Mushaf mais le hukm reste en vigueur via la Sunna. Az-Zarkashi (Al-Burhan 2/29) donne 20 exemples vérifiés.",
    dalil_ref: "Al-Itqan — As-Suyuti 2/20 · Al-Burhan fi 'Ulum al-Qur'an — Az-Zarkashi 2/29 · Nawasikh al-Quran — Ibn Al-Jawzi",
  },
  {
    domaine: 'tafsir', niveau: 5,
    texte_fr: "Qu'est-ce que le 'I'jaz al-balaghiy' (inimitabilité rhétorique) du Quran et quels éléments Al-Jurjani utilise-t-il pour le démontrer ?",
    texte_ar: "ما الإعجاز البلاغي للقرآن وما العناصر التي استند إليها الجرجاني في إثباته؟",
    reponses: [
      { texte_fr: "Al-Jurjani (Dala'il al-I'jaz) argumente via la 'nazm' (structure syntaxique unique) : l'ordre des mots coranique crée des significations impossibles à reproduire. Il distingue la nazm de la rhétorique ordinaire par ses effets cognitifs et spirituels cumulatifs sur l'auditeur arabe expert", texte_ar: "الجرجاني (دلائل الإعجاز) يحتج بالنظم (البنية التركيبية الفريدة): ترتيب الكلمات القرآني يُولد دلالات يعجز عن محاكاتها. يُميز النظم عن البلاغة العادية بآثاره المعرفية والروحية التراكمية على السامع العربي الخبير", correct: true },
      { texte_fr: "Al-Jurjani fonde l'I'jaz uniquement sur le vocabulaire (mufradat) rare du Quran — sa théorie ignore la structure syntaxique", texte_ar: "الجرجاني أسس الإعجاز على المفردات النادرة فحسب ونظريته تتجاهل البنية التركيبية", correct: false },
      { texte_fr: "L'I'jaz al-balaghiy est une invention des orientalistes — les savants classiques fondaient l'I'jaz exclusivement sur les prophéties (I'jaz al-ilmi)", texte_ar: "الإعجاز البلاغي اختراع المستشرقين والعلماء الكلاسيكيون أسسوا الإعجاز على النبوءات فحسب", correct: false },
      { texte_fr: "La théorie de la nazm d'Al-Jurjani a été rejetée par consensus des linguistes arabes classiques comme trop subjective", texte_ar: "نظرية النظم عند الجرجاني رُفضت بإجماع اللغويين الكلاسيكيين لذاتيتها الزائدة", correct: false },
    ],
    explication: "Abd Al-Qahir Al-Jurjani (mort 471H) dans 'Dala'il al-I'jaz' et 'Asrar al-Balagha' développe la théorie de la nazm : l'inimitabilité n'est pas dans les mots isolément mais dans leur arrangement syntaxique unique qui produit des effets de sens hors de portée humaine. Il analyse des tournures comme le iltifat (changement de personne grammaticale), le hazf (ellipse signifiante), et la taqdim/ta'khir (antéposition/postposition). Az-Zamakhshari (Al-Kashshaf) applique cette méthode au tafsir lexical-rhétorique. Ibn 'Ashur (At-Tahrir wat-Tanwir) la modernise au 20e siècle.",
    dalil_ref: "Dala'il al-I'jaz — Al-Jurjani · Asrar al-Balagha — Al-Jurjani · At-Tahrir wat-Tanwir — Ibn 'Ashur 1/74",
  },
  {
    domaine: 'tafsir', niveau: 5,
    texte_fr: "Quelle est la règle des 'wujuh wa naza'ir' (الوجوه والنظائر) dans les sciences du Quran et qui en a écrit le traité classique ?",
    texte_ar: "ما قاعدة الوجوه والنظائر في علوم القرآن ومن ألّف فيها الكتاب الكلاسيكي؟",
    reponses: [
      { texte_fr: "Wujuh = un même mot coranique avec plusieurs significations selon le contexte. Naza'ir = plusieurs mots différents partageant un même sens. Muqatil ibn Sulayman (mort 150H) a écrit 'Al-Wujuh wan-Naza'ir' — premier ouvrage systématique sur ce sujet, répertoriant ~180 wujuh", texte_ar: "الوجوه: كلمة واحدة بمعانٍ متعددة حسب السياق. النظائر: كلمات مختلفة بمعنى واحد. مقاتل بن سليمان (ت150هـ) ألّف 'الوجوه والنظائر' أول مؤلَّف منهجي — نحو 180 وجهاً", correct: true },
      { texte_fr: "Wujuh et naza'ir sont des termes synonymes désignant les hapax legomena (mots uniques) dans le Quran — Ibn Kathir en liste 75", texte_ar: "الوجوه والنظائر مترادفان يدلان على مفردات الإعجاز النادرة في القرآن وابن كثير يحصيها 75", correct: false },
      { texte_fr: "Ce domaine a été inventé par Az-Zarkashi dans Al-Burhan au 8e siècle H — aucun traité antérieur n'existe", texte_ar: "هذا الفن ابتكره الزركشي في البرهان القرن الثامن ولا توجد مؤلفات سابقة فيه", correct: false },
      { texte_fr: "Les naza'ir sont des versets abrogés dont le sens reste identique au verset abrogeant — c'est la définition qu'utilise As-Suyuti", texte_ar: "النظائر آيات منسوخة معناها مطابق للناسخ وهذا تعريف السيوطي", correct: false },
    ],
    explication: "Muqatil ibn Sulayman Al-Balkhi (mort 150H) est le pionnier de ce domaine. Exemple : le mot 'umma' dans le Quran a ~11 wujuh : communauté, génération, imam (Q.16:120), période de temps (Q.12:45), religion/milla. As-Suyuti (Al-Itqan 1/180) reprend et élargit ce travail. Ibn Al-Jawzi (Nuzhat al-A'yun) liste 326 wujuh. Cette science est fondamentale pour éviter l'uniformisation du sens : traduire 'umma' par 'communauté' à chaque occurrence serait une erreur de tafsir.",
    dalil_ref: "Al-Wujuh wan-Naza'ir — Muqatil ibn Sulayman · Al-Itqan — As-Suyuti 1/180 · Nuzhat al-A'yun — Ibn Al-Jawzi",
  },
  {
    domaine: 'tafsir', niveau: 5,
    texte_fr: "Que sont les 'mubhamat al-Quran' (المبهمات) et quelle est la méthodologie des mufassirin pour les identifier ?",
    texte_ar: "ما مبهمات القرآن وما منهج المفسرين في تحديدها؟",
    reponses: [
      { texte_fr: "Les mubhamat sont les personnes, lieux ou groupes mentionnés dans le Quran sans être nommés explicitement (ex. 'rajul', 'imra'a', 'qaryah'). La méthodologie : hadith, asbab an-nuzul, isra'iliyyat (avec réserve), 'ilm ar-rijal pour les transmetteurs d'identification. Ibn 'Askir et As-Suyuti (Al-Mubhamat) en ont fait des ouvrages spécialisés", texte_ar: "المبهمات: الأشخاص والأماكن والجماعات المذكورة دون تسمية صريحة (رجل، امرأة، قرية). المنهج: الحديث، أسباب النزول، الإسرائيليات بحذر، علم الرجال. ابن عساكر والسيوطي ألّفا فيها مصنفات متخصصة", correct: true },
      { texte_fr: "Les mubhamat désignent les versets dont le sens est obscur et ambigu (mutashabih) — terme équivalent à al-mutashabih", texte_ar: "المبهمات هي الآيات الغامضة المعنى (المتشابه) وهي مصطلح مرادف للمتشابه", correct: false },
      { texte_fr: "Les mubhamat ne peuvent être identifiées que par les prophètes et donc toute tentative d'identification par les savants est interdite", texte_ar: "المبهمات لا يعرفها إلا الأنبياء وكل محاولة لتحديدها من العلماء محظورة", correct: false },
      { texte_fr: "Les mubhamat al-Quran font référence exclusivement aux noms des anges et djinns non mentionnés explicitement", texte_ar: "مبهمات القرآن تشير حصراً إلى أسماء الملائكة والجن غير المذكورة صراحةً", correct: false },
    ],
    explication: "Exemple classique : Q.2:260 'wa idh qala Ibrahimu rabbi ...' — qui était le 'rajul' qui passa devant une ville détruite en Q.2:259 ? Les mufassirin divergent : 'Uzayr, Irmiya, ou un autre. Q.18:60-82 : 'abd من عبادنا' non nommé = Al-Khidr selon le hadith (Bukhari 122). Ibn 'Askir (At-Ta'rif bil-Mubhamat) et As-Suyuti (Al-Mubhamat dans Al-Itqan) systématisent cette science. La règle : on n'identifie un mubham que si le hadith sahih ou le consensus des mufassirin l'établit — les conjectures non fondées sont rejetées.",
    dalil_ref: "Al-Itqan — As-Suyuti 2/456 (Nawu' 67) · Bukhari 122 (Al-Khidr) · At-Ta'rif bil-Mubhamat — Ibn 'Askir",
  },
  {
    domaine: 'tafsir', niveau: 5,
    texte_fr: "Quelle est la différence entre 'tafsir bil-ma'thur' et 'tafsir bir-ra'y' et lequel est considéré comme plus fiable par Ibn Kathir ?",
    texte_ar: "ما الفرق بين تفسير المأثور وتفسير الرأي وأيهما أرجح عند ابن كثير؟",
    reponses: [
      { texte_fr: "Tafsir bil-ma'thur : interpréter le Quran par le Quran, puis la Sunna, puis les Sahaba, puis les Tabi'in. Tafsir bir-ra'y : interpréter par le raisonnement linguistique/contextuel. Ibn Kathir préfère le bil-ma'thur mais accepte le ra'y mahmud (fondé sur la langue arabe et les usul). Il rejette le ra'y madhmum (opinion sans base textuelle ou linguistique)", texte_ar: "المأثور: تفسير القرآن بالقرآن ثم السنة ثم الصحابة ثم التابعين. الرأي: التفسير بالاجتهاد اللغوي والسياقي. ابن كثير يُفضل المأثور ويقبل الرأي المحمود (المبني على اللغة والأصول) ويرفض الرأي المذموم", correct: true },
      { texte_fr: "Ibn Kathir rejette totalement le tafsir bir-ra'y et n'accepte que les hadiths sahih pour toute explication coranique", texte_ar: "ابن كثير يرفض تفسير الرأي كلياً ولا يقبل إلا الأحاديث الصحيحة في أي تفسير", correct: false },
      { texte_fr: "Le tafsir bil-ma'thur inclut les isra'iliyyat (récits juifs et chrétiens) comme source principale aux côtés du Quran", texte_ar: "تفسير المأثور يشمل الإسرائيليات كمصدر رئيسي إلى جانب القرآن", correct: false },
      { texte_fr: "Az-Zamakhshari représente le tafsir bil-ma'thur — son Kashshaf est le modèle classique de ce courant", texte_ar: "الزمخشري يمثل تفسير المأثور وكشافه النموذج الكلاسيكي لهذا التيار", correct: false },
    ],
    explication: "Ibn Kathir (Tafsir Ibn Kathir, Muqaddima) hiérarchise : le meilleur tafsir est le Quran lui-même (ex. 'sirat al-mustaqim' en 1:7 expliqué par 4:69). Puis la Sunna (le Prophète ﷺ est le plus savant du sens divin). Puis les Sahaba (témoins de la révélation). Puis les Tabi'in (appris des Sahaba). Az-Zamakhshari (Al-Kashshaf) représente le tafsir bir-ra'y al-mahmud (linguistique/mu'tazilite). At-Tabari (Jami' al-Bayan) combine les deux. Ibn 'Ashur (At-Tahrir) est un exemple moderne de ra'y mahmud basé sur les maqasid.",
    dalil_ref: "Tafsir Ibn Kathir — Muqaddima · Jami' al-Bayan — At-Tabari 1/79 · Al-Itqan — As-Suyuti 4/194",
  },

  // ════════════════════════════════════════════════════════════
  // HADITH — set 2
  // ════════════════════════════════════════════════════════════
  {
    domaine: 'hadith', niveau: 5,
    texte_fr: "Quelle est la distinction entre 'hadith gharib', 'aziz' et 'mashhur' selon la classification de Ibn As-Salah ?",
    texte_ar: "ما الفرق بين الحديث الغريب والعزيز والمشهور عند ابن الصلاح؟",
    reponses: [
      { texte_fr: "Gharib = 1 seul transmetteur à n'importe quel niveau de l'isnad. Aziz = minimum 2 transmetteurs à chaque niveau. Mashhur = minimum 3 transmetteurs (sans atteindre le tawatur). Ces catégories mesurent la largeur de l'isnad, non la validité intrinsèque du hadith", texte_ar: "الغريب: راوٍ واحد في أي طبقة. العزيز: راويان في كل طبقة على الأقل. المشهور: ثلاثة فأكثر دون بلوغ التواتر. هذه أنواع تقيس عرض السند لا صحته الذاتية", correct: true },
      { texte_fr: "Gharib = hadith faible (da'if) par définition — un seul transmetteur est insuffisant pour l'authenticité selon l'ijma'", texte_ar: "الغريب ضعيف بالتعريف — الراوي الواحد غير كافٍ للتوثيق بالإجماع", correct: false },
      { texte_fr: "Mashhur = hadiths que tout le monde connaît, incluant les hadiths populaires sans isnad vérifiable", texte_ar: "المشهور: ما يعرفه الجميع بما فيه المشهورات الشعبية بلا إسناد موثوق", correct: false },
      { texte_fr: "Ces trois catégories sont synonymes des termes sahih, hasan et da'if — c'est Ibn As-Salah lui-même qui les relie ainsi", texte_ar: "هذه الأنواع الثلاثة مرادفة للصحيح والحسن والضعيف وابن الصلاح نفسه يربطها هكذا", correct: false },
    ],
    explication: "Ibn As-Salah (Muqaddimat Ibn As-Salah, type 14-16) classe selon le nombre de transmetteurs par tabaqah. Un hadith gharib peut être sahih (ex. hadith 'innamal a'malu bin-niyyat' — uniquement 'Umar → 'Alqama → Ibrahim → Az-Zuhri dans les premières générations) ou da'if. Un mashhur peut être da'if si les transmetteurs supplémentaires sont tous faibles. Az-Zarkashi (An-Nukat 'ala Muqaddimat Ibn As-Salah) et Ibn Hajar (Nuzhat an-Nathar) précisent que ces termes décrivent la diffusion, non la validité.",
    dalil_ref: "Muqaddimat Ibn As-Salah — type 14-16 · Nuzhat an-Nathar — Ibn Hajar p.75 · An-Nukat — Az-Zarkashi",
  },
  {
    domaine: 'hadith', niveau: 5,
    texte_fr: "Qu'est-ce que le 'hadith mu'allal' (المعلل) et pourquoi est-il considéré comme la discipline la plus difficile de 'ilm ar-rijal ?",
    texte_ar: "ما الحديث المعلّل ولماذا يُعدّ أصعب فنون علم الرجال؟",
    reponses: [
      { texte_fr: "Mu'allal = hadith en apparence sahih mais contenant une 'illa (défaut caché) invisible à l'examen ordinaire : isnad continu mais en réalité mursal, ou matn confus par wahn (faiblesse mémorielle). Nécessite la comparaison de toutes les tariq et une maitrise totale des tabaqat — art maitrisé uniquement par des hafiz de rang comme Ad-Daraqutni et Ibn Al-Madini", texte_ar: "المعلل: حديث ظاهره الصحة لكنه يحوي علة خفية غير مرئية في الفحص العادي: سند متصل لكنه في الحقيقة مرسل، أو متن مضطرب بوهم. يستلزم مقارنة جميع الطرق وإتقاناً تاماً للطبقات — يُتقنه حفاظ كبار كالدارقطني وابن المديني", correct: true },
      { texte_fr: "Mu'allal est synonyme de da'if — tout hadith da'if est par définition mu'allal selon la terminologie de Al-Bukhari", texte_ar: "المعلل مرادف للضعيف وكل ضعيف معلل بالتعريف في مصطلح البخاري", correct: false },
      { texte_fr: "Le hadith mu'allal ne concerne que les matns (textes) avec des erreurs lexicales — l'isnad n'est jamais concerné", texte_ar: "الحديث المعلل يتعلق بالمتون ذات الأخطاء اللغوية فقط ولا علاقة له بالإسناد", correct: false },
      { texte_fr: "Identifier une 'illa dans un hadith est réservé aux quatre imams seulement — les savants postérieurs n'avaient plus accès aux tariq nécessaires", texte_ar: "تحديد العلة في الحديث خاص بالأئمة الأربعة فحسب والمتأخرون لم يكن بمقدورهم الوصول للطرق اللازمة", correct: false },
    ],
    explication: "Imam Ahmad ibn Hanbal disait : 'Trois choses ne se peuvent imiter : fadl (générosité) d'un savant, clarté du Quran, et ma'rifa bil-'ilal des hadiths.' Ali ibn Al-Madini (maitre d'Al-Bukhari) et Ad-Daraqutni (Kitab al-'Ilal) sont les maîtres de cette discipline. Exemple célèbre : le hadith 'la nikaha illa bi-wali' — certaines versions semblent musnadas (isnad continu jusqu'au Prophète ﷺ) mais l'analyse d'Ad-Daraqutni révèle que c'est en réalité mawquf sur 'Umar — la version musnad est mu'allal. Al-Bukhari utilisait cette méthode pour exclure des hadiths apparemment sahih de son Sahih.",
    dalil_ref: "Kitab al-'Ilal — Ad-Daraqutni · Al-'Ilal — Ibn Al-Madini · Sharh 'Ilal At-Tirmidhi — Ibn Rajab",
  },
  {
    domaine: 'hadith', niveau: 5,
    texte_fr: "Quelle est la différence entre 'mustakhraj' et 'mustadrak' dans la terminologie hadith ?",
    texte_ar: "ما الفرق بين المستخرج والمستدرك في مصطلح الحديث؟",
    reponses: [
      { texte_fr: "Mustakhraj = ouvrage où l'auteur rapporte les hadiths d'une collection (ex. Sahih Bukhari) via ses propres isnads différents convergeant au même compagnon final — pour diversifier les voies de transmission. Mustadrak = ouvrage incluant des hadiths non présents dans Bukhari/Muslim mais répondant à leurs critères selon l'auteur — ex. Al-Hakim al-Mustadrak", texte_ar: "المستخرج: مصنَّف يروي أحاديث مجموعة (كالبخاري) بأسانيد مغايرة تلتقي عند نفس الصحابي — لتكثير الطرق. المستدرك: مصنَّف يضم أحاديث غائبة عن البخاري ومسلم مع استيفاء شرطيهما كمستدرك الحاكم", correct: true },
      { texte_fr: "Mustakhraj et mustadrak sont synonymes — les deux termes désignent les supplements (dhuyul) ajoutés à un livre de hadith original", texte_ar: "المستخرج والمستدرك مترادفان ويدلان على الذيول المضافة لكتاب حديث أصلي", correct: false },
      { texte_fr: "Mustadrak signifie 'correction' — c'est un ouvrage corrigeant les erreurs dans Sahih Bukhari selon la méthode d'Al-Hakim", texte_ar: "المستدرك يعني التصحيح وهو مصنَّف يصحح أخطاء البخاري بمنهجية الحاكم", correct: false },
      { texte_fr: "Mustakhraj désigne exclusivement les commentaires (shuruh) des hadiths avec explication grammaticale complète", texte_ar: "المستخرج يشير حصراً للشروح التفصيلية مع الإعراب الكامل", correct: false },
    ],
    explication: "Examples de mustakhrajat : Abu 'Awana a composé un mustakhraj sur Sahih Muslim. Abu Nu'aym Al-Asfahani (Mustakhraj 'ala Muslim) rapporte les mêmes hadiths via ses propres chaines. L'intérêt est : si une voie dans le Sahih contient un raviwi faible ou ambigu, la voie parallèle du mustakhraj peut le confirmer ou révéler une 'illa. Al-Hakim an-Naysaburi (mort 405H) dans 'Al-Mustadrak 'ala as-Sahihayn' (4 volumes) prétend inclure des hadiths que Bukhari/Muslim ont omis bien qu'ils répondent à leurs critères — mais Adh-Dhahabi dans 'At-Talkhis' critique près de 500 de ces hadiths comme da'if ou mawdu'.",
    dalil_ref: "Al-Mustadrak — Al-Hakim (avec At-Talkhis d'Adh-Dhahabi) · Muqaddimat Ibn As-Salah type 21 · At-Taqyid wal-Idah — Al-'Iraqi",
  },
  {
    domaine: 'hadith', niveau: 5,
    texte_fr: "Qu'est-ce que le 'tadlis' (التدليس) dans les isnads et quels sont ses types selon Ibn Hajar Al-'Asqalani ?",
    texte_ar: "ما التدليس في الأسانيد وما أنواعه عند ابن حجر العسقلاني؟",
    reponses: [
      { texte_fr: "Ibn Hajar (Tabaqat al-Mudallisin) distingue : tadlis al-isnad (omettre un maillon faible via 'an en faisant croire à une rencontre directe), tadlis ash-shuyukh (masquer l'identité d'un maître faible via laqab), tadlis as-sima' (prétendre avoir entendu un sheikh sans l'avoir fait). Seul le premier type disqualifie le hadith si non explicitement sahih", texte_ar: "ابن حجر (طبقات المدلسين) يُميز: تدليس الإسناد (إسقاط راوٍ ضعيف مع إيهام الاتصال بـ'عن')، تدليس الشيوخ (إخفاء هوية شيخ ضعيف بلقب)، تدليس السماع (ادعاء سماع لم يحدث). الأول وحده يُسقط الحديث إن لم يصرح بالسماع", correct: true },
      { texte_fr: "Le tadlis dans les isnads rend automatiquement le hadith mawdu' (forgé) — c'est la règle établie par Al-Bukhari", texte_ar: "التدليس في الأسانيد يجعل الحديث موضوعاً تلقائياً وهي قاعدة البخاري", correct: false },
      { texte_fr: "Le tadlis est considéré comme permis (mubah) par les quatre madhahibs car il préserve les secrets des chaines de transmission", texte_ar: "التدليس مباح عند المذاهب الأربعة لأنه يحفظ أسرار سلاسل النقل", correct: false },
      { texte_fr: "As-Shafi'i est le premier à avoir codifié les types de tadlis dans Al-Umm — Ibn Hajar n'a fait que les renommer", texte_ar: "الشافعي أول من قنّن أنواع التدليس في الأم وابن حجر اكتفى بإعادة التسمية", correct: false },
    ],
    explication: "Ash-Sha'bi, Qatada, et Sufyan Ath-Thawri étaient connus comme mudallisin — leurs hadiths sont acceptés uniquement quand ils disent explicitement 'haddathana' ou 'akhbarana' (signe de sima' direct). Ibn Hajar classe les mudallisin en 5 tabaqat : (1) très peu de tadlis, hadiths acceptés ; (5) tadlis systématique, hadiths rejetés. Tabaqat al-Mudallisin d'Ibn Hajar liste ~152 mudallisin. Le problème central : 'an' (عن) est ambigu — peut signifier 'j'ai entendu de' ou 'il est rapporté de' sans rencontre directe.",
    dalil_ref: "Tabaqat al-Mudallisin — Ibn Hajar · Nuzhat an-Nathar — Ibn Hajar p.67 · Ma'rifa Anwa' 'Ilm al-Hadith — Ibn As-Salah",
  },
  {
    domaine: 'hadith', niveau: 5,
    texte_fr: "Quelle est la différence entre un hadith 'mawquf' et 'maqtu'' et dans quelles conditions le mawquf a-t-il force de hujja ?",
    texte_ar: "ما الفرق بين الموقوف والمقطوع وفي أي حالات يكون الموقوف حجة؟",
    reponses: [
      { texte_fr: "Mawquf = paroles/actes d'un Sahabi (pas le Prophète ﷺ). Maqtu' = paroles/actes d'un Tabi'i. Le mawquf a force de hujja dans 3 cas : (1) le Sahabi affirme 'kunna naf'alu' (= pratique prophétique implicite) ; (2) contexte de législation qu'un Sahabi ne peut pas inventer ; (3) mawquf sahih sans hadith marfu' contraignant sur le sujet", texte_ar: "الموقوف: قول/فعل الصحابي. المقطوع: قول/فعل التابعي. الموقوف حجة في 3 حالات: (1) الصحابي يقول 'كنا نفعل' (يعني سنة نبوية ضمنية)؛ (2) سياق تشريعي لا يُخترع؛ (3) موقوف صحيح بلا مرفوع ملزم", correct: true },
      { texte_fr: "Mawquf et maqtu' sont synonymes — les deux désignent des hadiths dont l'isnad s'arrête avant le Prophète ﷺ", texte_ar: "الموقوف والمقطوع مترادفان ويعنيان كل حديث لا يصل إسناده للنبي ﷺ", correct: false },
      { texte_fr: "Un hadith mawquf ne peut jamais constituer une hujja en fiqh — seuls les hadiths marfu' sont acceptés comme preuve légale", texte_ar: "الموقوف لا يصلح حجة في الفقه أبداً ولا يُقبل إلا المرفوع دليلاً شرعياً", correct: false },
      { texte_fr: "Le maqtu' a force de hujja supérieure au mawquf car les Tabi'in avaient plus de recul scientifique sur la Sunna", texte_ar: "المقطوع حجته أقوى من الموقوف لأن التابعين كان لديهم مسافة علمية أكبر من السنة", correct: false },
    ],
    explication: "Al-Bukhari cite souvent des mawqufat comme première preuve dans les chapitres de son Sahih (ba'da l'isnad marfu'). La règle classique d'An-Nawawi (At-Taqrib) : mawquf sahih sur un Sahabi ≠ hujja automatique car les Sahaba pouvaient se tromper — mais si aucun autre Sahabi ne contredit et que le contexte est législatif, les Hanafis (et souvent les Malikites) s'en servent comme hujja. Ash-Shafi'i est plus strict : seul le marfu' est hujja sauf si le Sahabi dit 'min as-sunna' explicitement. Ibn Al-Qayyim (I'lam 4/119) détaille 15 types de mawquf qui prennent le statut de marfu' hukmiy.",
    dalil_ref: "At-Taqrib wat-Taysir — An-Nawawi · I'lam al-Muwaqqi'in — Ibn Al-Qayyim 4/119 · Muqaddimat Ibn As-Salah type 19",
  },

  // ════════════════════════════════════════════════════════════
  // SIRAH — set 2
  // ════════════════════════════════════════════════════════════
  {
    domaine: 'sirah', niveau: 5,
    texte_fr: "Quels étaient les termes précis de la Bay'at al-'Aqaba ath-thaniya (2ème serment) et combien de personnes y participèrent ?",
    texte_ar: "ما بنود بيعة العقبة الثانية بدقة وكم شخصاً شارك فيها؟",
    reponses: [
      { texte_fr: "73 hommes et 2 femmes d'Al-Madinah, 12e année de la Prophétie. Termes : protéger le Prophète ﷺ comme leurs propres femmes et enfants, obéir dans l'aisance et la difficulté, dire la vérité sans crainte du blâme, ne pas associer à Allah, et que le Paradis est leur récompense. L'oncle Abbas était présent sans être encore Muslim pour surveiller", texte_ar: "73 رجلاً وامرأتان من المدينة، السنة 12 للنبوة. شروطها: حماية النبي ﷺ كحماية نسائهم وأبنائهم، الطاعة في العسر واليسر، قول الحق بلا خوف لومة لائم، التوحيد. جزاؤهم الجنة. العباس حضر مسلماً أو مراقباً", correct: true },
      { texte_fr: "La Bay'at al-'Aqaba ath-thaniya comptait 12 participants — le même nombre que les 12 naqibs nommés lors de la première bay'a", texte_ar: "بيعة العقبة الثانية ضمت 12 مشاركاً نفس عدد النقباء الاثني عشر في البيعة الأولى", correct: false },
      { texte_fr: "Les termes de cette bay'a incluaient une clause militaire précise : attaquer La Mecque dans les trois ans suivant l'Hégire", texte_ar: "شروط هذه البيعة تضمنت بنداً عسكرياً دقيقاً يقضي بمهاجمة مكة في غضون ثلاث سنوات من الهجرة", correct: false },
      { texte_fr: "La deuxième bay'a al-'Aqaba avait lieu en plein jour devant les délégués Quraychites qui avaient été invités", texte_ar: "بيعة العقبة الثانية كانت جهاراً أمام وفود قريش الذين دُعوا للحضور", correct: false },
    ],
    explication: "Ibn Hisham (Sirat an-Nabi 2/84) et Ibn Sa'd (At-Tabaqat 1/220) détaillent : la bay'a se tint en secret pendant les nuits du tashrik (11-13 Dhu'l-Hijja), an 13 de la Prophétie (621 CE). Les 12 naqibs furent nommés pour gérer les tribus. Al-Abbas ibn Abi Talib assistait — les historiens divergent sur son statut (déjà musulman en secret selon Ibn Hajar dans Al-Isaba 3/512, ou encore non-muslim mais favorable à son neveu). Le Prophet ﷺ demanda leur protection comme celle de 'ma tataquna minhu nisakum wa abna'akum' — créant ainsi le cadre juridique de l'Hijra.",
    dalil_ref: "Sirat Ibn Hisham 2/84 · At-Tabaqat al-Kubra — Ibn Sa'd 1/220 · Al-Isaba — Ibn Hajar 3/512",
  },
  {
    domaine: 'sirah', niveau: 5,
    texte_fr: "Quelle fut la portée et la conséquence directe du Ghazwat Khaybar (7H) sur le statut des Juifs de la péninsule arabique ?",
    texte_ar: "ما أثر غزوة خيبر (7هـ) وتداعياتها المباشرة على وضع يهود الجزيرة العربية؟",
    reponses: [
      { texte_fr: "Khaybar : défaite militaire des forteresses Juives du nord du Hijaz. Conséquence directe : les habitants devinrent dhimmis/mu'ahadun travaillant leur terre contre 50% des récoltes. Consequence légale ultérieure : 'Umar les expulsa du Hijaz sous un hadith prophétique ('akhrijul mushrikin min Jazira al-'Arab') lors de son califat", texte_ar: "خيبر: هزيمة حصون يهود شمال الحجاز. الأثر الفوري: أصبحوا ذميين/معاهدين يزرعون أرضهم مقابل نصف المحصول. الأثر القانوني لاحقاً: أجلاهم عمر من الحجاز بموجب حديث نبوي ('أخرجوا المشركين من جزيرة العرب')", correct: true },
      { texte_fr: "Après Khaybar, tous les Juifs du Hijaz furent expulsés immédiatement par ordre du Prophète ﷺ sans aucun arrangement économique", texte_ar: "بعد خيبر أُجلي يهود الحجاز جميعاً فوراً بأمر النبي ﷺ دون أي ترتيب اقتصادي", correct: false },
      { texte_fr: "Le butin de Khaybar fut uniquement distribué aux combattants de Badr en récompense de leur ancienneté islamique", texte_ar: "غنائم خيبر وُزعت حصرياً على مقاتلي بدر مكافأةً على أسبقيتهم الإسلامية", correct: false },
      { texte_fr: "Khaybar fut conquise sans combat car les habitants abandonnèrent leurs forteresses avant l'arrivée de l'armée musulmane", texte_ar: "خيبر فُتحت دون قتال إذ تركها السكان قبل وصول الجيش المسلم", correct: false },
    ],
    explication: "Bukhari 2285 : le Prophète ﷺ conclut avec les Juifs de Khaybar un accord de muzara'a (métayage) — ils cultivent la terre et remettent la moitié de la récolte annuelle. Al-Waqidi (Maghazi 2/684) décrit les 7 forteresses prises séquentiellement, avec 'Ali portant le drapeau. 'Umar (Bukhari 3168) les expulsa en s'appuyant sur un hadith du Prophète ﷺ (dit sur son lit de mort selon certaines versions) stipulant qu'on ne laisse pas deux religions coexister dans la Péninsule. Fath Khaybar permit aussi au Prophète ﷺ d'épouser Safiyya bint Huyayy.",
    dalil_ref: "Bukhari 2285, 3168 · Maghazi — Al-Waqidi 2/684 · Zad al-Ma'ad — Ibn Al-Qayyim 3/338",
  },
  {
    domaine: 'sirah', niveau: 5,
    texte_fr: "Qu'est-ce que 'l'am al-huzn' (عام الحزن — l'année du deuil) et quels événements précis s'y produisirent selon la chronologie sirah ?",
    texte_ar: "ما عام الحزن وما الأحداث الدقيقة التي وقعت فيه وفق تسلسل السيرة؟",
    reponses: [
      { texte_fr: "10e année de la Prophétie (619 CE) : mort de Khadija (première épouse, premier soutien) puis mort d'Abu Talib (oncle protecteur) en l'espace de quelques jours. Sans la protection tribale d'Abu Talib, les Quraychites redoublèrent les persécutions. C'est après ces pertes que le Prophète ﷺ entreprit le voyage de Ta'if", texte_ar: "السنة العاشرة من النبوة (619م): وفاة خديجة ثم أبي طالب في أيام متقاربة. بعد وفاة أبي طالب ضاعف القرشيون الأذى. أعقب ذلك رحلة الطائف", correct: true },
      { texte_fr: "L'am al-huzn correspond à la 5e année de la Prophétie, au moment de la première Hijra en Abyssinie", texte_ar: "عام الحزن يوافق السنة الخامسة من النبوة عند الهجرة الأولى إلى الحبشة", correct: false },
      { texte_fr: "L'am al-huzn désigne l'année de la mort d'Ibrahim (fils du Prophète ﷺ) accompagnée de l'éclipse solaire historique", texte_ar: "عام الحزن هو عام وفاة إبراهيم ابن النبي ﷺ المصحوب بالكسوف الشمسي التاريخي", correct: false },
      { texte_fr: "L'am al-huzn inclut la mort de Sa'd ibn Khaythama et Mus'ab ibn 'Umayr lors de la bataille — c'est pourquoi les Compagnons l'appelèrent ainsi", texte_ar: "عام الحزن يضم وفاة سعد بن خيثمة ومصعب بن عمير في المعركة ولهذا سمّاه الصحابة كذلك", correct: false },
    ],
    explication: "Ibn Hisham (Sirat 1/415) et Ibn Sa'd (Tabaqat 1/199) : Khadija mourut à Ramadan de l'an 10, puis Abu Talib mourut quelques semaines plus tard. La mort d'Abu Talib était cruciale car, bien que non-Muslim, il offrait la protection tribale ('aman) sans laquelle aucun Quraychite n'osait toucher le Prophète ﷺ publiquement. Après sa mort, même Abu Lahab (son successeur comme chef du clan Banu Hashim) retira sa protection. Le voyage à Ta'if qui suivit se solda par un échec humiliant. C'est dans ce contexte d'isolement total qu'eut lieu l'Isra' wal-Mi'raj.",
    dalil_ref: "Sirat Ibn Hisham 1/415 · At-Tabaqat — Ibn Sa'd 1/199 · Ar-Rahiq al-Makhtum — Al-Mubarakpuri p.132",
  },
  {
    domaine: 'sirah', niveau: 5,
    texte_fr: "Quelles furent les deux vagues de la Hijra en Abyssinie et quelle fut la réponse d'An-Najashi (le Négus) à la délégation Quraychite ?",
    texte_ar: "ما موجتا الهجرة إلى الحبشة وما رد النجاشي على وفد قريش؟",
    reponses: [
      { texte_fr: "1ère vague (5e an) : 11 hommes + 4 femmes dont 'Uthman et Ruqayya. 2ème vague (5e-6e an) : ~83 hommes dont Ja'far ibn Abi Talib. La délégation Quraychite (Amr ibn al-'As + 'Abdallah ibn Abi Rabi'a) demanda leur extradition. An-Najashi après avoir entendu Ja'far réciter le début de Sourate Maryam dit : 'La différence entre ce que vous dites et ce qu'a apporté Musa n'est pas plus grande que ceci' (indiquant un faible écart)", texte_ar: "الأولى (سنة 5): 11 رجلاً وأربع نسوة منهم عثمان ورقية. الثانية (5-6): 83 رجلاً منهم جعفر. وفد قريش (عمرو بن العاص وعبدالله بن أبي ربيعة) طلب تسليمهم. النجاشي بعد سماع جعفر يتلو مريم قال ما بين قولكم وما جاء به موسى إلا هذا (مشيراً لمسافة صغيرة)", correct: true },
      { texte_fr: "Il n'y eut qu'une seule vague de Hijra en Abyssinie — la notion de deux vagues est une invention tardive des historiens médinois", texte_ar: "لم تكن إلا موجة هجرة واحدة للحبشة ومفهوم الموجتين اختراع متأخر للمؤرخين المدنيين", correct: false },
      { texte_fr: "An-Najashi expulsa les Muslims d'Abyssinie après avoir entendu les arguments Quraychites — c'est pour cela qu'ils revinrent à La Mecque", texte_ar: "النجاشي طرد المسلمين من الحبشة بعد سماع حجج قريش ولهذا عادوا لمكة", correct: false },
      { texte_fr: "Ja'far ibn Abi Talib récita Sourate Al-Baqara au Négus — c'est cette récitation qui convainquit le roi chrétien", texte_ar: "جعفر تلا سورة البقرة أمام النجاشي وهي التي أقنعت الملك المسيحي", correct: false },
    ],
    explication: "Ibn Hisham (Sirat 1/321-344) détaille les deux vagues. La première (Rajab 5e an) : 12 hommes selon certaines rivayat, 15 selon d'autres — ils revinrent brièvement à La Mecque après la rumeur des 'gharaniq' puis repartirent. La deuxième vague est plus grande : Ibn Sa'd liste 83 noms d'hommes + 18 femmes. La scène de Ja'far récitant Maryam (19:16-34) est dans Sirat Ibn Hisham (1/336) : An-Najashi pleura et dit 'Wallahi la uslimuhum ilaykum' ('Par Allah je ne vous les livrerai pas'). An-Najashi est mort Muslim selon le Prophet ﷺ qui fit la prière funéraire (salat al-ghayb) sur lui (Bukhari 1327).",
    dalil_ref: "Sirat Ibn Hisham 1/321-344 · Bukhari 1327 (salat sur An-Najashi) · At-Tabaqat — Ibn Sa'd 1/203",
  },
  {
    domaine: 'sirah', niveau: 5,
    texte_fr: "Qu'est-ce que Ghazwat Tabuk (9H) et quels groupes de personnes sont mentionnés dans le Quran en rapport avec cet événement ?",
    texte_ar: "ما غزوة تبوك (9هـ) وما الفئات التي ذُكرت في القرآن بشأنها؟",
    reponses: [
      { texte_fr: "Tabuk (9H, 630 CE) : expédition vers le nord contre l'empire byzantin — pas de combat, mais l'armée retourna après l'absence des Romains. Groupes coraniques : (1) les Munafiqun qui se désistèrent (Q.9:42-66) ; (2) les trois Sahabis pardonnés après boycott (Ka'b ibn Malik, Murara, Hilal — Q.9:118) ; (3) ceux qui pleurèrent de ne pas avoir les moyens de partir (Q.9:92)", texte_ar: "تبوك (9هـ/630م): تجريدة نحو الشمال ضد الروم دون قتال. الفئات القرآنية: (1) المنافقون المتخلفون (9:42-66)؛ (2) الثلاثة المعفو عنهم بعد البايكوت (كعب وهلال ومرارة، 9:118)؛ (3) الباكون عجزاً (9:92)", correct: true },
      { texte_fr: "Tabuk fut une victoire militaire décisive où l'armée islamique vainquit les forces byzantines à la bataille de Mu'ta", texte_ar: "تبوك كانت نصراً عسكرياً حاسماً هزم فيه الجيش الإسلامي قوات الروم في معركة مؤتة", correct: false },
      { texte_fr: "Le Quran ne mentionne Tabuk nulle part — tous les récits proviennent uniquement des hadiths et de la Sirat", texte_ar: "القرآن لا يذكر تبوك في أي موضع وجميع الروايات من الحديث والسيرة فحسب", correct: false },
      { texte_fr: "Les trois Sahabis boycottés après Tabuk furent Ka'b ibn Malik, 'Abdullah ibn Ubayy, et Abu Bakr As-Siddiq", texte_ar: "الثلاثة الذين بُويكتوا بعد تبوك هم كعب بن مالك وعبدالله بن أبي وأبو بكر الصديق", correct: false },
    ],
    explication: "Tabuk est la seule expédition dont le nom est mentionné implicitement dans le Quran (Q.9 = Surah at-Tawba, entièrement révélée à cette occasion). C'était la plus grande armée qu'ait menée le Prophète ﷺ : 30,000 hommes selon Ibn Hisham. 'Uthman finança un tiers de l'armée. L'histoire de Ka'b ibn Malik (Bukhari 4418) est l'un des récits les plus longs du Sahih — Ka'b raconte lui-même son boycott de 50 jours jusqu'à la révélation de Q.9:118. Les 'bakka'un' de Q.9:92 étaient des pauvres qui pleurèrent de ne pouvoir financer leur participation.",
    dalil_ref: "Bukhari 4418 (Ka'b ibn Malik) · Q.9:42-66, 9:92, 9:118 · Sirat Ibn Hisham 2/519",
  },

  // ════════════════════════════════════════════════════════════
  // AKHLAQ — set 2
  // ════════════════════════════════════════════════════════════
  {
    domaine: 'akhlaq', niveau: 5,
    texte_fr: "Quelle est la distinction précise entre 'hasad' (jalousie destructive) et 'ghibta' (émulation louable) dans le Quran et la Sunna ?",
    texte_ar: "ما الفرق الدقيق بين الحسد والغبطة في القرآن والسنة؟",
    reponses: [
      { texte_fr: "Hasad = souhaiter que la ni'ma (grâce) disparaisse de quelqu'un. Ghibta = souhaiter avoir une ni'ma semblable sans la vouloir retirée à l'autre. Seule la ghibta est permise dans deux cas (hadith Bukhari 73) : celui qui a été doté de la richesse et la dépense en bonne cause, et celui à qui Allah a donné la sagesse.", texte_ar: "الحسد: تمني زوال النعمة عن الغير. الغبطة: تمني مثل النعمة دون إرادة زوالها. الغبطة مباحة في حالتين (بخاري 73): من آتاه الله مالاً فهو يُهلكه في الحق، ومن آتاه الله الحكمة", correct: true },
      { texte_fr: "Hasad et ghibta sont synonymes en arabe classique — c'est une distinction artificielle introduite par les soufis du 4e siècle H", texte_ar: "الحسد والغبطة مترادفان في العربية الفصحى والتمييز بينهما اصطناع صوفي من القرن الرابع", correct: false },
      { texte_fr: "Le hasad est permis envers les ennemis de l'Islam car la disparition de leurs ni'am est un bien pour la communauté", texte_ar: "الحسد مباح على أعداء الإسلام لأن زوال نعمهم مصلحة للأمة", correct: false },
      { texte_fr: "La ghibta est définie dans le fiqh comme macrouh car elle implique une forme d'insatisfaction envers le décret divin", texte_ar: "الغبطة مكروهة فقهياً لأنها تنطوي على شكل من أشكال عدم الرضا بالقدر الإلهي", correct: false },
    ],
    explication: "Hadith Bukhari 73 / Muslim 816 : 'La hasada illa fi ithnatyn: rajulun atahu Allahu malan fa-huwa yuhliku fi-l-haqq, wa rajulun atahu Allahu al-hikmah fa-huwa yaqdhi biha wa yu'allimuha.' ('Pas d'envie [ghibta] permise sauf en deux cas...'). Ibn Al-Qayyim (Madarij 1/149) : hasad = maladie du cœur qui aboutit à l'injustice (tyranie, calomnie, sabotage). Ghibta = moteur de l'excellence (tahsin an-nafs). Q.4:54 condamne le hasad : 'Am yahsuduna an-nasa 'ala ma atahumullahu min fadlihi.' L'imam Al-Ghazali (Ihya' 3/177) décompose le hasad en 6 stades de gravité.",
    dalil_ref: "Bukhari 73 · Muslim 816 · Madarij as-Salikin — Ibn Al-Qayyim 1/149 · Ihya' 'Ulum ad-Din — Al-Ghazali 3/177",
  },
  {
    domaine: 'akhlaq', niveau: 5,
    texte_fr: "Qu'est-ce que le 'riya'' (الرياء) et quelle est la distinction entre le riya' jali (apparent) et khafi (caché) selon Al-Ghazali ?",
    texte_ar: "ما الرياء وما الفرق بين الرياء الجلي والخفي عند الغزالي؟",
    reponses: [
      { texte_fr: "Riya' jali = adorer explicitement pour être vu des gens (niyya explicitement corrompue dès le début). Riya' khafi = commencer sincèrement mais la complaisance s'installe progressivement (ex. prolonger la prière quand on est observé). Al-Ghazali (Ihya' 3/299) : le riya' khafi est plus dangereux car invisible à la muhasaba ordinaire", texte_ar: "الجلي: العبادة صراحةً لأجل الناس (نية فاسدة من البداية). الخفي: البداية بصدق ثم تسرب الرياء تدريجياً (كإطالة الصلاة عند المشاهدة). الغزالي (إحياء 3/299): الخفي أخطر لخفائه عن المحاسبة العادية", correct: true },
      { texte_fr: "Selon Al-Ghazali, le riya' jali est plus dangereux que le khafi car il prouve l'hypocrisie totale (nifaq) du pratiquant", texte_ar: "الرياء الجلي أخطر من الخفي عند الغزالي لأنه يُثبت النفاق الكامل للممارس", correct: false },
      { texte_fr: "Al-Ghazali rejette la distinction jali/khafi — pour lui le riya' est un état binaire (présent ou absent) sans degrés", texte_ar: "الغزالي يرفض التمييز بين الجلي والخفي فالرياء عنده ثنائي إما موجود أو غائب", correct: false },
      { texte_fr: "Le riya' khafi désigne uniquement la tenue vestimentaire portée pour impressionner lors de l'adoration — pas les actes d'adoration eux-mêmes", texte_ar: "الرياء الخفي يشير حصراً للملبس المُلبَس إبهاراً خلال العبادة لا الأعمال العبادية ذاتها", correct: false },
    ],
    explication: "Al-Ghazali (Ihya' 'Ulum ad-Din 3/280-330) consacre un chapitre complet au riya', qu'il classe comme 'shirk khafi' en référence au hadith prophétique : 'Inna akhwafa ma akhafu 'alaykum ash-shirku l-asghar. Qalu: wa ma ash-shirku l-asghar? Qala: ar-riya'.' (Ahmad 23630). La différence jali/khafi est cruciale pour le tazkiyya : le jali peut être detécté par introspection simple, mais le khafi nécessite une muhasaba constante et profonde — Al-Muhasibi (Ar-Ri'aya) le décrit comme entrant 'comme une fourmi noire sur une pierre noire dans la nuit'.",
    dalil_ref: "Ihya' 'Ulum ad-Din — Al-Ghazali 3/280-330 · Ahmad 23630 · Ar-Ri'aya li-Huquq Allah — Al-Muhasibi",
  },
  {
    domaine: 'akhlaq', niveau: 5,
    texte_fr: "Quels sont les trois niveaux du 'shukr' (reconnaissance/gratitude) selon les 'ulama du tazkiyya et comment s'articulent-ils ?",
    texte_ar: "ما مراتب الشكر الثلاث عند علماء التزكية وكيف تتشابك؟",
    reponses: [
      { texte_fr: "Niveau 1 — shukr bil-qalb : reconnaître intérieurement que la ni'ma vient d'Allah seul (tawhid de la source). Niveau 2 — shukr bil-lisan : remercier verbalement (alhamdulillah, dhikr). Niveau 3 — shukr bil-jawarih : utiliser les grâces dans l'obéissance — car Allah dit 'i'malu ala Dawuda shukran' (Q.34:13) en citant l'action comme shukr", texte_ar: "القلب: إدراك أن النعمة من الله وحده (توحيد المصدر). اللسان: الشكر اللفظي (الحمدلله، الذكر). الجوارح: استخدام النعم في الطاعة — الله قال لداود 'اعملوا آل داود شكراً' (34:13) مستشهداً بالعمل شكراً", correct: true },
      { texte_fr: "Le shukr selon les savants de tazkiyya n'a qu'un seul niveau réel : le qalb — les niveaux lisan et jawarih sont des métaphores pédagogiques", texte_ar: "الشكر عند علماء التزكية له مرتبة حقيقية واحدة هي القلب والمرتبتان الأخريان مجازيتان بيداغوجيتان", correct: false },
      { texte_fr: "Le shukr bil-jawarih précède le shukr bil-qalb dans la hiérarchie — l'action vient avant la conviction dans la méthode tazkiyya", texte_ar: "شكر الجوارح يسبق شكر القلب في التسلسل الهرمي والعمل يأتي قبل الاعتقاد في منهج التزكية", correct: false },
      { texte_fr: "Ibn Al-Qayyim limite le shukr à deux niveaux : qalb et lisan — il rejette l'ajout des jawarih comme extension non coranique", texte_ar: "ابن القيم يحصر الشكر في مرتبتين القلب واللسان ويرفض إضافة الجوارح كتمديد غير قرآني", correct: false },
    ],
    explication: "Ibn Al-Qayyim (Madarij as-Salikin 2/244) et Al-Ghazali (Ihya' 4/68) s'accordent sur cette tripartition. Q.34:13 est clé : Allah ordonna aux fils de Dawud de 'travailler en signe de gratitude' — prouvant que le shukr inclut l'action physique. La logique : une ni'ma non utilisée en obéissance devient une hujja contre son détenteur le Jour du Jugement (hadith Tirmidhi 3358 : 'la tazul qadama ibni adam'). Ibn Rajab (Jami' al-'Ulum, hadith 1) relie le shukr au premier hadith d'An-Nawawi : les 'amal correspondent aux niyyat — donc le shukr bil-qalb est la fondation des deux autres niveaux.",
    dalil_ref: "Madarij as-Salikin — Ibn Al-Qayyim 2/244 · Ihya' — Al-Ghazali 4/68 · Q.34:13 · Tirmidhi 3358",
  },
  {
    domaine: 'akhlaq', niveau: 5,
    texte_fr: "Qu'est-ce que le 'sabr' (patience) et comment les 'ulama le classifient-ils en trois types distincts ?",
    texte_ar: "ما الصبر وكيف يُصنفه العلماء في ثلاثة أنواع متمايزة؟",
    reponses: [
      { texte_fr: "Sabr 'ala ta'at Allah (patienter sur l'obéissance = persévérer dans les actes d'adoration). Sabr 'an ma'asiyat Allah (patienter loin de la désobéissance = résister aux tentations). Sabr 'ala aqdhar Allah (patienter face aux décrets divins = accepter les épreuves sans révolte). Ibn Al-Qayyim dit que le premier type est le plus méritoire", texte_ar: "صبر على الطاعة (المثابرة في العبادة). صبر عن المعصية (مقاومة الإغراءات). صبر على أقدار الله (قبول البلاء دون تمرد). ابن القيم: الأول أفضل المراتب", correct: true },
      { texte_fr: "Le sabr en Islam n'a qu'une seule définition : accepter les épreuves sans se plaindre — les trois types sont une invention post-classique", texte_ar: "الصبر في الإسلام له معنى واحد فقط هو قبول البلاء دون شكوى والأنواع الثلاثة اختراع ما بعد كلاسيكي", correct: false },
      { texte_fr: "Le sabr 'an ma'asiyat Allah est le plus élevé des trois types selon An-Nawawi dans Al-Adhkar", texte_ar: "الصبر عن معصية الله أعلى الأنواع الثلاثة عند النووي في الأذكار", correct: false },
      { texte_fr: "Le sabr 'ala aqdhar Allah est considéré comme fard 'ayn, contrairement aux deux autres types qui sont nafila", texte_ar: "الصبر على أقدار الله فرض عين خلافاً للنوعين الآخرين اللذين هما نافلة", correct: false },
    ],
    explication: "Ibn Al-Qayyim (Madarij as-Salikin 2/157) : le sabr 'ala at-ta'a est le plus haut car il requiert à la fois les trois formes — il faut résister aux tentations pour faire la ta'a (type 2), accepter la difficulté de l'obéissance (type 3), et persévérer (type 1). Q.2:153 : 'Yaa ayyuha alladhina amanu ista'inu bis-sabri was-salat' — An-Nawawi (Riyadh as-Salihin, chapitre sabr) identifie le sabr comme 'nusf al-iman' (moitié de la foi) en référence au hadith 'was-sabru diya'' (Tirmidhi 2816). Al-Ghazali (Ihya' 4/57) consacre le livre IV du quart de l'âme aux vertus salvatrices dont le sabr en tête.",
    dalil_ref: "Madarij as-Salikin — Ibn Al-Qayyim 2/157 · Q.2:153 · Tirmidhi 2816 · Ihya' — Al-Ghazali 4/57",
  },
  {
    domaine: 'akhlaq', niveau: 5,
    texte_fr: "Quelle est la définition de l''ikhlas' (sincérité d'intention) selon Al-Muhasibi et comment diffère-t-elle de la définition de Ibn 'Ata'illah As-Sakandari ?",
    texte_ar: "ما تعريف الإخلاص عند المحاسبي وكيف يختلف عن تعريف ابن عطاء الله السكندري؟",
    reponses: [
      { texte_fr: "Al-Muhasibi (Ar-Ri'aya) : l'ikhlas = purifier l'acte de toute contamination par le regard des créatures — approche purificatoire/négative (eliminer le riya'). Ibn 'Ata'illah (Al-Hikam) : l'ikhlas = l'acte est totalement pour Allah sans que le serviteur y voie un mérite pour lui-même — approche annihilatoire (fana' de l'ego dans l'acte)", texte_ar: "المحاسبي (الرعاية): الإخلاص تنقية العمل من ملاحظة الخلق — منهج تطهيري/سلبي (إزالة الرياء). ابن عطاء الله (الحكم): الإخلاص أن يكون العمل لله محضاً دون رؤية العبد لنفسه فيه فضلاً — منهج إفنائي (فناء الأنا)", correct: true },
      { texte_fr: "Al-Muhasibi et Ibn 'Ata'illah ont une définition identique de l'ikhlas — la distinction est une interprétation moderne sans base dans leurs textes originaux", texte_ar: "تعريف المحاسبي وابن عطاء الله للإخلاص متطابق والتمييز تفسير حديث لا أساس له في نصوصهم الأصلية", correct: false },
      { texte_fr: "Ibn 'Ata'illah rejette l'approche d'Al-Muhasibi comme étant du mutahassib (auto-surveillance obsessive) contraire à la tawakkul", texte_ar: "ابن عطاء الله يرفض منهج المحاسبي بوصفه محاسبة وسواسية تتناقض مع التوكل", correct: false },
      { texte_fr: "L'ikhlas selon les deux savants requiert de ne jamais demander à Allah de récompense pour ses actes d'adoration", texte_ar: "الإخلاص عند الشيخين يستلزم عدم سؤال الله الأجر على الطاعات أبداً", correct: false },
    ],
    explication: "Al-Muhasibi (mort 243H, Ar-Ri'aya li-Huquq Allah) représente la voie de la muhasaba an-nafs (introspection systématique) — l'ikhlas comme processus actif de purification. Ibn 'Ata'illah As-Sakandari (mort 709H, Al-Hikam #33) exprime la maqam plus avancée : 'Inna al-a'mal suwara qa'imatun wa arwahiha wujud sirr al-ikhlas fiha' ('Les actes sont des formes — leur âme est le secret de l'ikhlas en eux'). La différence théologique : Al-Muhasibi = effort humain orienté vers Allah ; Ibn 'Ata'illah = dissolution de l'ego dans l'acte — position plus proche du maqam al-ihsan (Q.2:112 'man aslama wajhahu lillah').",
    dalil_ref: "Ar-Ri'aya li-Huquq Allah — Al-Muhasibi · Al-Hikam al-'Ata'iyya — Ibn 'Ata'illah As-Sakandari #33 · Q.2:112",
  },

  // ════════════════════════════════════════════════════════════
  // AKHLAQ — questions de niveau mufti
  // ════════════════════════════════════════════════════════════
  {
    domaine: 'akhlaq', niveau: 5,
    texte_fr: "Selon Ibn Al-Qayyim dans 'Madarij as-Salikin', quelles sont les trois stations (maqamat) de la 'tawba' (repentir) et en quoi la tawba nasuha se distingue-t-elle d'une tawba ordinaire ?",
    texte_ar: "ما مراتب التوبة الثلاث عند ابن القيم في مدارج السالكين وبم تتميز التوبة النصوح عن التوبة العادية؟",
    reponses: [
      { texte_fr: "3 stations : (1) tawba des kaba'ir (grands péchés manifestés), (2) tawba des sagha'ir (péchés ordinaires), (3) tawba des ghafalt (négligence spirituelle). Nasuha = repentir sincère intégrant les 4 conditions : cessation, regret, résolution, restitution des droits", texte_ar: "3 مراتب: (١) توبة الكبائر الظاهرة، (٢) توبة الصغائر، (٣) توبة الغفلة. النصوح: الجامعة لشروطها الأربعة: الإقلاع والندم والعزم ورد الحقوق", correct: true },
      { texte_fr: "La tawba nasuha est uniquement réservée aux prophètes selon Ibn Al-Qayyim", texte_ar: "التوبة النصوح خاصة بالأنبياء وحدهم عند ابن القيم", correct: false },
      { texte_fr: "Il y a 7 stations dans la tawba selon Madarij as-Salikin, non 3", texte_ar: "للتوبة سبع مراتب في مدارج السالكين لا ثلاث", correct: false },
      { texte_fr: "La tawba nasuha consiste uniquement en pleurs et prière — sans conditions formelles selon Ibn Al-Qayyim", texte_ar: "التوبة النصوح عند ابن القيم هي البكاء والصلاة فحسب دون شروط رسمية", correct: false },
    ],
    explication: "Ibn Al-Qayyim dans Madarij as-Salikin (sharh 'Manazil as-Sa'irin' d'Al-Harawi) consacre un chapitre exhaustif à la tawba. Il distingue les pecchés selon leur gravité et l'effort de repentir requis. La tawba nasuha (Coran 66:8 'tubu ila Allahi tawbatan nasuha') doit réunir : (1) AL-IQLA' : cessation immédiate du péché, (2) AN-NADAM : regret sincère du cœur, (3) AL-'AZM : résolution ferme de ne pas récidiver, (4) RADD AL-HUQUQ (si le péché implique un droit d'autrui) : restitution ou demande de pardon à la personne lésée. Sans la 4ème condition quand applicable, la tawba est incomplète même avec les 3 premières.",
    dalil_ref: "Madarij as-Salikin — Ibn Al-Qayyim 1/205 · Sourate At-Tahrim (66:8) · Sahih al-Bukhari 6307",
  },
  {
    domaine: 'akhlaq', niveau: 5,
    texte_fr: "Qu'est-ce que le concept de 'muhasaba an-nafs' (محاسبة النفس) selon Al-Harith ibn Asad Al-Muhasibi et quelle est sa méthode concrète ?",
    texte_ar: "ما مفهوم محاسبة النفس عند الحارث بن أسد المحاسبي وما منهجه العملي فيها؟",
    reponses: [
      { texte_fr: "Al-Muhasibi : examen quotidien de ses intentions avant l'acte (muhasaba qabliyya) et bilan après (muhasaba ba'diyya). Méthode : questionner l'intention, surveiller les étapes, faire le bilan nocturne comme un marchand évalue ses comptes", texte_ar: "المحاسبي: مراجعة النية قبل العمل (قبلية) وتقييمه بعده (بعدية). المنهج: سؤال النية ومراقبة المراحل ومحاسبة نفسه ليلاً كمحاسبة التاجر لأرباحه", correct: true },
      { texte_fr: "Al-Muhasibi enseignait uniquement la muhasaba des péchés graves, non des actes ordinaires", texte_ar: "المحاسبي كان يعلّم محاسبة الكبائر فحسب دون الأعمال العادية", correct: false },
      { texte_fr: "La muhasaba an-nafs selon Al-Muhasibi consiste à confesser ses péchés à un imam de confiance", texte_ar: "المحاسبة عند المحاسبي هي الاعتراف بالذنوب لإمام موثوق", correct: false },
      { texte_fr: "Al-Muhasibi rejetait le concept de muhasaba quotidienne comme innovation (bid'a)", texte_ar: "المحاسبي رفض المحاسبة اليومية ورآها بدعة", correct: false },
    ],
    explication: "Al-Harith ibn Asad Al-Muhasibi (m. 243 AH) — le nom 'Al-Muhasibi' vient précisément de sa pratique intensive de la muhâsabat an-nafs. Dans son œuvre 'Ar-Ri'aya li-Huquq Allah' et 'Al-Mustarshid', il développe : (1) MUHASABA QABLIYYA : avant chaque acte, examiner l'intention — 'pour qui est-ce ?' (2) MURAQABA : surveiller sa naphsa durant l'acte pour éviter la dérive. (3) MUHASABA BA'DIYYA : chaque soir, bilan de la journée comme un commerçant examine ses livres de compte. (4) MU'AQABA : si un péché est commis, se punir soi-même (par exemple en jeûnant ou en s'astreignant à plus de dhikr). L'Imam Ahmad ibn Hanbal admirait Al-Muhasibi malgré certaines divergences théologiques.",
    dalil_ref: "Ar-Ri'aya li-Huquq Allah — Al-Muhasibi · Ihya 'Ulum ad-Din — Al-Ghazali 4/345 · Siyar A'lam an-Nubala' — Ad-Dhahabi 12/110",
  },
  {
    domaine: 'akhlaq', niveau: 5,
    texte_fr: "Dans la tradition islamique, qu'est-ce que le concept de 'fana'' (الفناء) chez les soufis comme Al-Junayd, et en quoi la position d'Ibn Taymiyya sur ce concept diffère-t-elle ?",
    texte_ar: "ما مفهوم 'الفناء' عند الصوفية كالجنيد وكيف يختلف عنه ابن تيمية؟",
    reponses: [
      { texte_fr: "Al-Junayd : fana' = annihilation de la volonté propre dans la volonté divine (éthique). Ibn Taymiyya accepte le fana' éthique mais rejette le fana' existentiel (annihilation de l'être du créé dans l'Être divin — ittihadiyya)", texte_ar: "الجنيد: الفناء = زوال الإرادة الذاتية في الإرادة الإلهية (أخلاقي). ابن تيمية يقبل الفناء الأخلاقي ويرفض الفناء الوجودي (اتحادية الوجود)", correct: true },
      { texte_fr: "Ibn Taymiyya acceptait totalement le concept de fana' car il l'associait à la tawba correcte", texte_ar: "ابن تيمية قبل مفهوم الفناء كلياً لأنه ربطه بالتوبة الصحيحة", correct: false },
      { texte_fr: "Al-Junayd enseignait que le fana' est la dissolution physique de l'âme dans le cosmos", texte_ar: "الجنيد كان يعلّم أن الفناء هو ذوبان الروح جسدياً في الكون", correct: false },
      { texte_fr: "Le concept de fana' n'existe pas dans la littérature soufie classique — c'est une invention tardive", texte_ar: "مفهوم الفناء غير موجود في التراث الصوفي الكلاسيكي وهو اختراع متأخر", correct: false },
    ],
    explication: "Al-Junayd Al-Baghdadi (m. 297 AH, 'sayyid at-ta'ifa') distinguait le fana' comme disparition de la volonté propre (hawa an-nafs) dans l'obéissance absolue à Allah — sans implication panthéiste. Ibn Taymiyya (Majmu' 2/394) distingue trois niveaux : (1) FANA' AKHlAQI (annihilation des mauvaises passions) = accepté, c'est le but de la tazkiyya. (2) FANA' SHUHUDY (disparition de la conscience de soi dans la contemplation divine) = débattu, acceptable si non-durable. (3) FANA' WUJUDI (annihilation de l'être créé dans l'Être divin — al-ittihadiyya ou al-hulul) = REJETÉ catégoriquement car proche du panthéisme de Ibn 'Arabi (m. 1240). Ibn Taymiyya critique vertement Ibn 'Arabi dans Al-Futuhat al-Makkiyya sur ce point.",
    dalil_ref: "Majmu' Fatawa Ibn Taymiyya 2/394 · Risalat Al-Junayd · Talbis Iblis — Ibn Al-Jawzi · Al-Furqan — Ibn Taymiyya",
  },
  {
    domaine: 'akhlaq', niveau: 5,
    texte_fr: "Quelle est la définition du 'kibr' (الكبر — orgueil) donnée par le Prophète ﷺ dans un hadith sahih célèbre, et comment cette définition est-elle analysée par les savants ?",
    texte_ar: "ما تعريف الكبر الذي جاء في الحديث الصحيح المشهور وكيف حلّله العلماء؟",
    reponses: [
      { texte_fr: "Hadith Muslim 91 : 'Al-kibr bataru-l-haqq wa ghamtu-n-nas' (Le kibr = rejeter la vérité + mépriser les gens). Analyse des savants : deux composantes — cognitive (nier la vérité) + sociale (dédaigner autrui). L'une suffit pour constituer le kibr interdit", texte_ar: "مسلم 91: 'الكبر بطر الحق وغمط الناس'. تحليل العلماء: مكوّنان — معرفي (رد الحق) + اجتماعي (احتقار الناس). يكفي واحد منهما للكبر المحرم", correct: true },
      { texte_fr: "La définition du kibr dans le hadith concerne uniquement les rois et gouvernants, pas les individus ordinaires", texte_ar: "تعريف الكبر في الحديث يخص الملوك والحكام فحسب لا الأفراد العاديين", correct: false },
      { texte_fr: "Le kibr défini dans le hadith est uniquement extérieur (comportemental) sans dimension intérieure", texte_ar: "الكبر في الحديث ظاهري سلوكي فحسب دون بعد داخلي", correct: false },
      { texte_fr: "Ce hadith est classifié comme da'if par la majorité des muhaddithin bien que populaire", texte_ar: "هذا الحديث مصنَّف ضعيفاً عند الجمهور رغم شهرته", correct: false },
    ],
    explication: "Hadith : 'Man kana fi qalbihi mithqalu dharratin min kibr lam yadkhul al-janna. Qala rajulun: inna ar-rajul yuhibb an yakuna thawbuhu hasanan wa na'latuhu hasanatan. Qala: Inna Allaha jamilun yuhibbu al-jamal. Al-kibr bataru-l-haqq wa ghamtu-n-nas' (Muslim 91). Analyse de An-Nawawi : 'batar al-haqq' = rejeter la vérité quand elle vient à toi (intellectuellement ou pratiquement). 'Ghamt an-nas' = mépriser les gens, les considérer inférieurs. Ibn Al-Qayyim (Madarij 2/288) : le kibr intérieur (dans le cœur) est le péché, le comportement extérieur en est le symptôme. Le Prophète ﷺ précise aussi que l'élégance vestimentaire N'EST PAS du kibr — c'est la beauté qu'Allah aime.",
    dalil_ref: "Sahih Muslim 91 · Sharh an-Nawawi 'ala Muslim 2/165 · Madarij as-Salikin — Ibn Al-Qayyim 2/288",
  },
  {
    domaine: 'akhlaq', niveau: 5,
    texte_fr: "Qu'est-ce que le concept de 'wara'' (الورع — scrupule religieux) selon Imam Ahmad ibn Hanbal, et comment se distingue-t-il du 'zuhd' et du 'taqwa' ?",
    texte_ar: "ما مفهوم الورع عند الإمام أحمد بن حنبل وما الفرق بينه وبين الزهد والتقوى؟",
    reponses: [
      { texte_fr: "Wara' = éviter le moindre doute (shubha) concernant l'interdit — plus exigeant que le halal simple. Ahmad : 'Le fondement de la religion est le wara'.' Distinction : taqwa = éviter l'interdit certain ; wara' = éviter le douteux ; zuhd = se détacher du permis superflu", texte_ar: "الورع: اجتناب الشبهة فوق الحلال العادي. أحمد: 'أساس الدين الورع'. الفرق: التقوى = اجتناب الحرام المحقق. الورع = اجتناب المشتبه. الزهد = ترك فضول الحلال", correct: true },
      { texte_fr: "Le wara' est synonyme de taqwa selon Imam Ahmad — il n'y a aucune distinction dans ses textes", texte_ar: "الورع مرادف للتقوى عند أحمد لا فرق بينهما في نصوصه", correct: false },
      { texte_fr: "Imam Ahmad refusait le concept de wara' car il menait au waswasa (scrupule obsessionnel)", texte_ar: "الإمام أحمد كان يرفض مفهوم الورع لأنه يؤدي إلى الوسوسة", correct: false },
      { texte_fr: "Le zuhd et le wara' sont identiques — Imam Ahmad lui-même les définissait ainsi dans ses lettres", texte_ar: "الزهد والورع متطابقان وأحمد عرّفهما هكذا في رسائله", correct: false },
    ],
    explication: "Imam Ahmad (rapporté par Ibn Al-Jawzi dans 'Sifat as-Safwa' et Ibn Rajab dans 'Jami' al-'Ulum') : 'Usul al-islam 'ala thalatha ahadith: halal bayyin wa haram bayyin wa shubhat bayna dhalik' (Les fondements de l'Islam sur trois hadiths : halal clair, haram clair, douteux entre les deux). Hiérarchie des vertus : TAQWA = se garder de ce qui est clairement interdit (fard). WARA' = aller plus loin en évitant le douteux (shubha) même si techniquement halal (sunna muakkada pour les savants). ZUHD = renoncer au halal superflu qui distrait de l'Au-delà (maqam plus élevé). Exemple : la taqwa = ne pas manger de la viande non-halal. Le wara' = ne pas manger de la viande dont le statut est douteux. Le zuhd = manger peu même du halal certain.",
    dalil_ref: "Jami' al-'Ulum wal-Hikam — Ibn Rajab (explication du hadith 6) · Sifat as-Safwa — Ibn Al-Jawzi · Tabaqat al-Hanabilah",
  },
];

async function seed() {
  let inserted = 0;

  for (const q of questions) {
    // Insert question
    const existing = await pool.query(
      'SELECT id FROM questions WHERE texte_fr = $1 AND is_tournoi = TRUE',
      [q.texte_fr]
    );
    if (existing.rows.length > 0) {
      console.log(`⏭ Déjà présente: ${q.texte_fr.substring(0, 60)}…`);
      continue;
    }

    const res = await pool.query(
      `INSERT INTO questions
        (domaine, sous_domaine, niveau, madhab, texte_fr, texte_ar, dalil_ref, explication, statut, is_tournoi)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'valide', TRUE)
       RETURNING id`,
      [q.domaine, q.domaine, q.niveau, 'general', q.texte_fr, q.texte_ar, q.dalil_ref, q.explication]
    );
    const qid = res.rows[0].id;

    // Insert answers
    for (const r of q.reponses) {
      await pool.query(
        `INSERT INTO reponses (question_id, texte_fr, texte_ar, est_correcte)
         VALUES ($1, $2, $3, $4)`,
        [qid, r.texte_fr, r.texte_ar, r.correct]
      );
    }

    inserted++;
    console.log(`✅ [${q.domaine.toUpperCase()}] Niv.${q.niveau}: ${q.texte_fr.substring(0, 70)}…`);
  }

  console.log(`\n🏆 ${inserted} questions tournoi insérées (is_tournoi = TRUE)`);
  await pool.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
