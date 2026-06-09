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
