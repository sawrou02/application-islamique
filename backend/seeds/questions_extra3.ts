import { Client } from 'pg';

interface QuestionSeed {
  domaine: string;
  sous_domaine?: string;
  niveau: number;
  madhab: string;
  texte_fr: string;
  texte_ar?: string;
  dalil_ref?: string;
  dalil_texte_ar?: string;
  dalil_texte_fr?: string;
  explication?: string;
  savant_reference?: string;
  grade_hadith?: string;
  reponses: { texte_fr: string; texte_ar?: string; est_correcte: boolean }[];
}

const QUESTIONS_EXTRA3: QuestionSeed[] = [
  // ===================== FIQH AVANCÉ - IHRAM (5) =====================
  {
    domaine: 'fiqh', sous_domaine: 'ihram', niveau: 2, madhab: 'general',
    texte_fr: "Quelles sont les deux formules d'ihram (types de hajj) où le pèlerin peut entrer en ihram séparément pour la umra puis pour le hajj ?",
    texte_ar: 'ما نوعا الإحرام اللذان يُحرم فيهما المرأتين بالعمرة ثم بالحج على حدة؟',
    explication: "Le hajj Tamattu' consiste à entrer en ihram pour la umra, se libérer de l'ihram après la umra, puis entrer à nouveau en ihram pour le hajj. Le hajj Qiran consiste à rester en ihram pour les deux en même temps.",
    reponses: [
      { texte_fr: "Tamattu' et Qiran", texte_ar: 'التمتع والقران', est_correcte: true },
      { texte_fr: "Ifrad et Tamattu'", est_correcte: false },
      { texte_fr: "Qiran et Ifrad", est_correcte: false },
      { texte_fr: "Tamattu' uniquement", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh', sous_domaine: 'ihram', niveau: 2, madhab: 'general',
    texte_fr: "Combien de types de choses sont interdites en état d'ihram selon les savants ?",
    texte_ar: 'كم نوعًا من المحظورات يُمنع منها المحرم؟',
    explication: "Les interdits de l'ihram incluent : couper les cheveux et ongles, utiliser des parfums, relations conjugales, contrat de mariage, chasse terrestre, et pour l'homme : porter des vêtements cousus et se couvrir la tête.",
    reponses: [
      { texte_fr: "Sept catégories d'interdits", est_correcte: true },
      { texte_fr: "Trois catégories", est_correcte: false },
      { texte_fr: "Dix catégories", est_correcte: false },
      { texte_fr: "Cinq catégories", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh', sous_domaine: 'ihram', niveau: 3, madhab: 'general',
    texte_fr: "Qu'est-ce que la fidya en cas de violation d'un interdit de l'ihram comme le rasage de la tête par nécessité ?",
    texte_ar: 'ما الفدية في حال ارتكاب محظور الإحرام كحلق الرأس لعذر؟',
    dalil_ref: 'Sourate Al-Baqara 2:196',
    dalil_texte_ar: 'فَمَن كَانَ مِنكُم مَّرِيضًا أَوْ بِهِ أَذًى مِّن رَّأْسِهِ فَفِدْيَةٌ مِّن صِيَامٍ أَوْ صَدَقَةٍ أَوْ نُسُكٍ',
    dalil_texte_fr: "Quiconque est malade ou souffre d'une affection à la tête, qu'il se rachète par un jeûne, une aumône ou un sacrifice.",
    explication: "La fidya est : soit jeûner trois jours, soit nourrir six pauvres (un sa' par pauvre), soit égorger un mouton. Le pèlerin choisit l'une des trois options.",
    reponses: [
      { texte_fr: "Jeûner 3 jours, ou nourrir 6 pauvres, ou égorger un mouton", est_correcte: true },
      { texte_fr: "Payer une amende monétaire fixe", est_correcte: false },
      { texte_fr: "Recommencer le hajj l'année suivante", est_correcte: false },
      { texte_fr: "Effectuer 100 rak'at supplémentaires", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh', sous_domaine: 'ihram', niveau: 2, madhab: 'general',
    texte_fr: "Quel est le miqat (point de départ de l'ihram) pour les pèlerins venant d'Egypte et du Maghreb ?",
    texte_ar: 'ما ميقات أهل مصر والمغرب؟',
    explication: "Le miqat de Rabigh (anciennement appelé Al-Juhfa) est le miqat des pèlerins venant du Cham, d'Egypte et du Maghreb. Les pèlerins ne peuvent pas passer ce point sans être en état d'ihram.",
    reponses: [
      { texte_fr: "Rabigh (anciennement Al-Juhfa)", texte_ar: 'رابغ (الجحفة)', est_correcte: true },
      { texte_fr: "Dhu'l Hulayfa (Abyar Ali)", est_correcte: false },
      { texte_fr: "Qarn Al-Manazil", est_correcte: false },
      { texte_fr: "Yalamlam", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh', sous_domaine: 'ihram', niveau: 1, madhab: 'general',
    texte_fr: "Quelle est la talbiyya que le pèlerin récite en état d'ihram ?",
    texte_ar: 'ما التلبية التي يرددها الحاج في حالة الإحرام؟',
    dalil_ref: 'Sahih Al-Bukhari 1549',
    dalil_texte_ar: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ',
    dalil_texte_fr: "Me voici à Ta disposition ô Allah, me voici, me voici, Tu n'as pas d'associé, me voici.",
    grade_hadith: 'sahih',
    explication: "La talbiyya est la formule que le pèlerin récite dès qu'il entre en état d'ihram et continue jusqu'au lapidement du grand pilier le jour de l'Aïd.",
    reponses: [
      { texte_fr: "'Labbayka Allahumma labbayk...'", texte_ar: 'لبيك اللهم لبيك', est_correcte: true },
      { texte_fr: "'Allahu Akbar Allahu Akbar...'", est_correcte: false },
      { texte_fr: "'Subhanallahi wa bihamdihi...'", est_correcte: false },
      { texte_fr: "'La ilaha illallah wahdahu...'", est_correcte: false },
    ],
  },
  // ===================== FIQH AVANCÉ - QURBANI & AQIQA (5) =====================
  {
    domaine: 'fiqh', sous_domaine: 'qurbani', niveau: 2, madhab: 'general',
    texte_fr: "Quel est le jugement du sacrifice ('Udhiyya / Qurbani) le jour de l'Aïd Al-Adha ?",
    texte_ar: "ما حكم الأضحية يوم عيد الأضحى؟",
    dalil_ref: 'Sourate Al-Kawthar 108:2',
    dalil_texte_ar: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
    dalil_texte_fr: "Prie donc pour ton Seigneur et sacrifie.",
    explication: "La majorité des savants (Maliki, Shafi'i, Hanbali) considèrent le qurbani comme une sunnah mu'akkada (fortement recommandée). Les Hanafis le considèrent comme wajib (obligatoire) pour celui qui en a les moyens.",
    reponses: [
      { texte_fr: "Sunnah mu'akkada pour la majorité, wajib selon les Hanafis", est_correcte: true },
      { texte_fr: "Obligatoire (fard 'ayn) selon tous les madhhabs", est_correcte: false },
      { texte_fr: "Simplement recommandé (mustahabb) selon tous", est_correcte: false },
      { texte_fr: "Obligatoire collectif (fard kifaya)", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh', sous_domaine: 'qurbani', niveau: 2, madhab: 'general',
    texte_fr: "Combien de personnes peut représenter un bœuf ou un chameau dans le sacrifice ?",
    texte_ar: 'كم شخصًا تجزئ عنهم البقرة أو الإبل في الأضحية؟',
    dalil_ref: 'Sahih Muslim 1318',
    grade_hadith: 'sahih',
    explication: "Une brebis ou une chèvre est pour une famille, un bœuf ou un chameau suffit pour sept personnes selon le hadith authentique.",
    reponses: [
      { texte_fr: "Sept personnes", texte_ar: 'سبعة أشخاص', est_correcte: true },
      { texte_fr: "Dix personnes", est_correcte: false },
      { texte_fr: "Cinq personnes", est_correcte: false },
      { texte_fr: "Une seule famille quelque soit le nombre", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh', sous_domaine: 'aqiqa', niveau: 2, madhab: 'general',
    texte_fr: "Combien de moutons faut-il égorger pour l'aqiqa d'un garçon selon la Sunnah ?",
    texte_ar: 'كم شاة تُذبح في عقيقة الغلام؟',
    dalil_ref: 'Sunan Abu Dawud 2842',
    dalil_texte_ar: 'عَنِ الغُلاَمِ شَاتَانِ مُكَافِئَتَانِ، وَعَنِ الجَارِيَةِ شَاةٌ',
    dalil_texte_fr: "Pour le garçon deux moutons équivalents, et pour la fille un mouton.",
    grade_hadith: 'sahih',
    explication: "La Sunnah établit deux moutons pour le garçon et un mouton pour la fille lors de l'aqiqa. Elle est effectuée de préférence le 7ème jour après la naissance.",
    reponses: [
      { texte_fr: "Deux moutons pour le garçon, un pour la fille", est_correcte: true },
      { texte_fr: "Un mouton pour les deux", est_correcte: false },
      { texte_fr: "Trois moutons pour le garçon", est_correcte: false },
      { texte_fr: "Cela dépend de la capacité financière uniquement", est_correcte: false },
    ],
  },
  // ===================== FIQH AVANCÉ - WAQF (3) =====================
  {
    domaine: 'fiqh', sous_domaine: 'waqf', niveau: 2, madhab: 'general',
    texte_fr: "Qu'est-ce que le waqf en droit islamique ?",
    texte_ar: 'ما الوقف في الفقه الإسلامي؟',
    explication: "Le waqf est une donation perpétuelle de la propriété d'un bien (dont on ne peut plus disposer), dont les revenus ou les bénéfices sont affectés à une cause charitable. C'est une sadaqa jariya (aumône continue).",
    reponses: [
      { texte_fr: "Une donation perpétuelle dont les bénéfices sont affectés à une cause charitable", texte_ar: 'حبس عين ماله وتسبيل منفعته', est_correcte: true },
      { texte_fr: "Un prêt sans intérêt", est_correcte: false },
      { texte_fr: "Un testament caritatif", est_correcte: false },
      { texte_fr: "Une zakât sur les biens immobiliers", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh', sous_domaine: 'waqf', niveau: 3, madhab: 'general',
    texte_fr: "La propriété d'un bien mis en waqf peut-elle être vendue ou héritée ?",
    texte_ar: 'هل يجوز بيع الوقف أو توريثه؟',
    explication: "La règle générale est que le bien mis en waqf ne peut être ni vendu, ni hérité, ni donné. Il reste figé dans sa propriété au service de la cause pour laquelle il a été dédié. Certains savants permettent son remplacement (istibdal) en cas de nécessité.",
    reponses: [
      { texte_fr: "Non, il ne peut être vendu ni hérité en principe", est_correcte: true },
      { texte_fr: "Oui, il peut être vendu si le prix est utilisé pour la même cause", est_correcte: false },
      { texte_fr: "Oui, les héritiers en héritent normalement", est_correcte: false },
      { texte_fr: "Cela dépend du type de waqf", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh', sous_domaine: 'waqf', niveau: 2, madhab: 'general',
    texte_fr: "Quelle est la différence entre waqf dhurri et waqf khayri ?",
    texte_ar: 'ما الفرق بين الوقف الذري والوقف الخيري؟',
    explication: "Le waqf khayri (caritatif) est dédié directement à des œuvres caritatives (mosquées, écoles, hôpitaux). Le waqf dhurri (familial) profite aux descendants du fondateur avant d'aller aux œuvres caritatives après l'extinction de la lignée.",
    reponses: [
      { texte_fr: "Le waqf dhurri profite aux descendants du fondateur, le khayri à des causes caritatives directement", est_correcte: true },
      { texte_fr: "Le waqf khayri est temporaire, le dhurri est permanent", est_correcte: false },
      { texte_fr: "Il n'y a aucune différence entre les deux", est_correcte: false },
      { texte_fr: "Le waqf dhurri concerne les biens meubles, le khayri les immeubles", est_correcte: false },
    ],
  },
  // ===================== FIQH AVANCÉ - WASIYYA & MIRAS (7) =====================
  {
    domaine: 'fiqh', sous_domaine: 'wasiyya', niveau: 2, madhab: 'general',
    texte_fr: "Quel est le maximum légal qu'une personne peut léguer par testament (wasiyya) à des non-héritiers ?",
    texte_ar: 'ما أقصى ما يجوز للشخص أن يوصي به لغير الورثة؟',
    dalil_ref: 'Sahih Al-Bukhari 2742',
    dalil_texte_ar: 'الثُّلُثُ وَالثُّلُثُ كَثِيرٌ',
    dalil_texte_fr: "Le tiers, et le tiers c'est beaucoup.",
    grade_hadith: 'sahih',
    explication: "Le Prophète ﷺ a établi que le testament ne peut dépasser le tiers (1/3) de la succession. Le reste doit être distribué selon les règles coraniques de l'héritage (miras).",
    reponses: [
      { texte_fr: "Un tiers (1/3) de la succession", texte_ar: 'الثلث', est_correcte: true },
      { texte_fr: "La moitié (1/2)", est_correcte: false },
      { texte_fr: "Un quart (1/4)", est_correcte: false },
      { texte_fr: "Il n'y a aucune limite", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh', sous_domaine: 'miras', niveau: 2, madhab: 'general',
    texte_fr: "Quelle est la part héréditaire (fard) de la fille unique dans la succession islamique ?",
    texte_ar: 'ما نصيب البنت المنفردة في الميراث الإسلامي؟',
    dalil_ref: 'Sourate An-Nisa 4:11',
    dalil_texte_ar: 'وَإِن كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ',
    dalil_texte_fr: "Et si elle est seule, la moitié lui appartient.",
    explication: "La fille unique hérite de la moitié (1/2) de la succession. Si elles sont deux ou plus, elles se partagent les deux tiers (2/3).",
    reponses: [
      { texte_fr: "La moitié (1/2)", texte_ar: 'النصف', est_correcte: true },
      { texte_fr: "Les deux tiers (2/3)", est_correcte: false },
      { texte_fr: "Un quart (1/4)", est_correcte: false },
      { texte_fr: "Un tiers (1/3)", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh', sous_domaine: 'miras', niveau: 2, madhab: 'general',
    texte_fr: "Qui sont les personnes qui héritent toujours (as-hab al-furud), quelles que soient les circonstances ?",
    texte_ar: 'من هم أصحاب الفروض الذين لا يُحجبون حجبًا كاملًا؟',
    explication: "Les héritiers qui ne peuvent jamais être totalement exclus de l'héritage sont : le mari, la femme, la mère, le père, la fille, et la fille du fils. Les autres héritiers peuvent être totalement exclus selon les circonstances.",
    reponses: [
      { texte_fr: "Le conjoint (mari/femme), les parents (père/mère), la fille", est_correcte: true },
      { texte_fr: "Tous les descendants sans exception", est_correcte: false },
      { texte_fr: "Les frères et sœurs uniquement", est_correcte: false },
      { texte_fr: "Le fils unique exclusivement", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh', sous_domaine: 'miras', niveau: 3, madhab: 'general',
    texte_fr: "Qu'est-ce que l'asaba (agnats) dans le droit successoral islamique ?",
    texte_ar: 'ما العصبة في علم الفرائض؟',
    explication: "Les asaba sont les héritiers du côté masculin qui héritent du reste après distribution des parts fixes (furud). Ils prennent tout s'il n'y a pas d'asHab al-furud, et rien si les parts fixes épuisent la succession.",
    reponses: [
      { texte_fr: "Les héritiers masculins qui héritent du reste après les parts fixes", texte_ar: 'العصبة بالنفس', est_correcte: true },
      { texte_fr: "Les héritiers féminins uniquement", est_correcte: false },
      { texte_fr: "Les héritiers lointains exclus de l'héritage", est_correcte: false },
      { texte_fr: "Les légataires testamentaires", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh', sous_domaine: 'miras', niveau: 2, madhab: 'general',
    texte_fr: "Est-ce qu'un non-musulman peut hériter d'un musulman selon le fiqh islamique ?",
    texte_ar: 'هل يرث الكافر المسلمَ؟',
    dalil_ref: 'Sahih Al-Bukhari 6764',
    dalil_texte_ar: 'لَا يَرِثُ الْمُسْلِمُ الْكَافِرَ، وَلَا الْكَافِرُ الْمُسْلِمَ',
    dalil_texte_fr: "Le musulman n'hérite pas du non-croyant, et le non-croyant n'hérite pas du musulman.",
    grade_hadith: 'sahih',
    explication: "Selon le consensus des savants, la différence de religion constitue un obstacle à l'héritage. Un non-musulman ne peut hériter d'un musulman et vice-versa.",
    reponses: [
      { texte_fr: "Non, la différence de religion est un obstacle à l'héritage", est_correcte: true },
      { texte_fr: "Oui, si le défunt le souhaitait", est_correcte: false },
      { texte_fr: "Oui, mais seulement un quart de sa part normale", est_correcte: false },
      { texte_fr: "Cela dépend du pays de résidence", est_correcte: false },
    ],
  },
  // ===================== AQIDA AVANCÉE - SIGNES DE LA FIN DES TEMPS (8) =====================
  {
    domaine: 'aqida', sous_domaine: 'ashratu_al_sa\'a', niveau: 2, madhab: 'general',
    texte_fr: "Quel est le premier grand signe de la fin des temps (ashratu as-sa'a al-kubra) selon les hadiths ?",
    texte_ar: 'ما أول الأشراط الكبرى للساعة؟',
    dalil_ref: 'Sahih Muslim 2901',
    grade_hadith: 'sahih',
    explication: "Le premier grand signe est l'apparition du Dajjal (le grand imposteur). Les dix grands signes incluent aussi : Ya'juj et Ma'juj, la bête, trois éclipses, le feu du Yémen, et la descente d'Isa.",
    reponses: [
      { texte_fr: "L'apparition du Dajjal (le grand imposteur)", texte_ar: 'خروج الدجال', est_correcte: true },
      { texte_fr: "La levée du soleil à l'ouest", est_correcte: false },
      { texte_fr: "L'apparition de Ya'juj et Ma'juj", est_correcte: false },
      { texte_fr: "La descente du Prophète Isa ('Alayhi As-Salam)", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida', sous_domaine: 'ashratu_al_sa\'a', niveau: 2, madhab: 'general',
    texte_fr: "Quel est le signe qui rend la tawba (repentir) impossible selon le hadith ?",
    texte_ar: 'ما الآية التي تُغلق باب التوبة بعد ظهورها؟',
    dalil_ref: 'Sahih Muslim 2941',
    dalil_texte_ar: 'لَا تَقُومُ السَّاعَةُ حَتَّى تَطْلُعَ الشَّمْسُ مِنْ مَغْرِبِهَا',
    grade_hadith: 'sahih',
    explication: "La levée du soleil à l'ouest (al-maghrib) est le signe qui clôture définitivement la porte du repentir. Le Coran y fait allusion dans la sourate Al-An'am (6:158).",
    reponses: [
      { texte_fr: "La levée du soleil à l'ouest", texte_ar: 'طلوع الشمس من مغربها', est_correcte: true },
      { texte_fr: "L'apparition du Dajjal", est_correcte: false },
      { texte_fr: "La mort de tous les croyants", est_correcte: false },
      { texte_fr: "La destruction de la Ka'ba", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida', sous_domaine: 'ashratu_al_sa\'a', niveau: 1, madhab: 'general',
    texte_fr: "Combien de grands signes de la fin des temps (ashratu as-sa'a al-kubra) les savants identifient-ils généralement ?",
    texte_ar: 'كم عدد الأشراط الكبرى للساعة التي ذكرها العلماء؟',
    dalil_ref: 'Sahih Muslim 2901',
    grade_hadith: 'sahih',
    explication: "Les savants identifient généralement dix grands signes : le Dajjal, la descente d'Isa, Ya'juj et Ma'juj, trois effondrements de terre, la fumée, la bête, le feu du Yémen, et la levée du soleil à l'ouest.",
    reponses: [
      { texte_fr: "Dix grands signes", texte_ar: 'عشر آيات', est_correcte: true },
      { texte_fr: "Cinq grands signes", est_correcte: false },
      { texte_fr: "Sept grands signes", est_correcte: false },
      { texte_fr: "Trois grands signes", est_correcte: false },
    ],
  },
  // ===================== AQIDA AVANCÉE - ÉTAPES DE L'AU-DELÀ (7) =====================
  {
    domaine: 'aqida', sous_domaine: 'akhira', niveau: 2, madhab: 'general',
    texte_fr: "Qu'est-ce que le Barzakh selon la croyance islamique ?",
    texte_ar: 'ما البرزخ في العقيدة الإسلامية؟',
    dalil_ref: 'Sourate Al-Mu\'minun 23:100',
    dalil_texte_ar: 'وَمِن وَرَائِهِم بَرْزَخٌ إِلَىٰ يَوْمِ يُبْعَثُونَ',
    dalil_texte_fr: "Et derrière eux se trouve un Barzakh jusqu'au jour où ils seront ressuscités.",
    explication: "Le Barzakh est la vie intermédiaire entre la mort et la résurrection. Dans cette période, les âmes subissent les jouissances ou les tourments de la tombe selon leurs actes.",
    reponses: [
      { texte_fr: "La vie intermédiaire entre la mort et la résurrection", texte_ar: 'عالم ما بين الموت والبعث', est_correcte: true },
      { texte_fr: "Un endroit dans le Paradis", est_correcte: false },
      { texte_fr: "Le lieu de rassemblement au Jour du Jugement", est_correcte: false },
      { texte_fr: "Le pont As-Sirat", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida', sous_domaine: 'akhira', niveau: 2, madhab: 'general',
    texte_fr: "Qu'est-ce que le Hashr (rassemblement) au Jour du Jugement ?",
    texte_ar: 'ما الحشر يوم القيامة؟',
    dalil_ref: 'Sourate Al-Kahf 18:47',
    dalil_texte_ar: 'وَيَوْمَ نُسَيِّرُ الْجِبَالَ وَتَرَى الْأَرْضَ بَارِزَةً وَحَشَرْنَاهُمْ فَلَمْ نُغَادِرْ مِنْهُمْ أَحَدًا',
    dalil_texte_fr: "Le Jour où Nous ferons bouger les montagnes, où tu verras la terre à nu, et où Nous les rassemblerons sans en laisser un seul.",
    explication: "Le Hashr est le rassemblement de toute l'humanité (les premiers et les derniers) sur une immense plaine au Jour du Jugement pour être jugés.",
    reponses: [
      { texte_fr: "Le rassemblement de toute l'humanité sur une plaine au Jour du Jugement", texte_ar: 'جمع الخلائق يوم القيامة', est_correcte: true },
      { texte_fr: "La résurrection des corps", est_correcte: false },
      { texte_fr: "Le jugement individuel de chaque âme", est_correcte: false },
      { texte_fr: "L'entrée au Paradis ou en Enfer", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida', sous_domaine: 'akhira', niveau: 2, madhab: 'general',
    texte_fr: "Qu'est-ce que le Mizan (balance) au Jour du Jugement ?",
    texte_ar: 'ما الميزان يوم القيامة؟',
    dalil_ref: 'Sourate Al-Anbiya 21:47',
    dalil_texte_ar: 'وَنَضَعُ الْمَوَازِينَ الْقِسْطَ لِيَوْمِ الْقِيَامَةِ',
    dalil_texte_fr: "Nous placerons les balances de la justice au Jour de la Résurrection.",
    explication: "Le Mizan est la balance réelle où Allah pèsera les actes de Ses serviteurs. Ahlu Sunnah affirme l'existence réelle de cette balance sans en questionner la modalité.",
    reponses: [
      { texte_fr: "La balance réelle où Allah pèsera les actes de Ses serviteurs", texte_ar: 'ميزان حقيقي توزن به الأعمال', est_correcte: true },
      { texte_fr: "Une métaphore pour la justice divine", est_correcte: false },
      { texte_fr: "Un registre de comptes imaginaire", est_correcte: false },
      { texte_fr: "Le jugement des intentions uniquement", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida', sous_domaine: 'akhira', niveau: 2, madhab: 'general',
    texte_fr: "Qu'est-ce que le Sirat (pont) que tous devront traverser ?",
    texte_ar: 'ما الصراط الذي يمر عليه الناس يوم القيامة؟',
    dalil_ref: 'Sahih Al-Bukhari 7439',
    grade_hadith: 'sahih',
    explication: "Le Sirat est un pont tendu au-dessus de l'Enfer que tous devront traverser. Les croyants le traverseront selon leurs actes : les uns comme l'éclair, d'autres comme le vent, d'autres en marchant, d'autres en rampant. Les mécréants tomberont.",
    reponses: [
      { texte_fr: "Un pont tendu au-dessus de l'Enfer que tous devront traverser", texte_ar: 'جسر ممدود على النار', est_correcte: true },
      { texte_fr: "Le chemin menant au Paradis dans cette vie", est_correcte: false },
      { texte_fr: "Un mur séparant le Paradis de l'Enfer", est_correcte: false },
      { texte_fr: "La porte du Paradis", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida', sous_domaine: 'akhira', niveau: 1, madhab: 'general',
    texte_fr: "Combien y a-t-il de portes du Paradis (Janna) selon les hadiths ?",
    texte_ar: 'كم عدد أبواب الجنة؟',
    dalil_ref: 'Sahih Al-Bukhari 3257',
    grade_hadith: 'sahih',
    explication: "Le Paradis possède huit portes. Il y a une porte spéciale appelée Ar-Rayyan réservée à ceux qui ont beaucoup jeûné.",
    reponses: [
      { texte_fr: "Huit portes", texte_ar: 'ثمانية أبواب', est_correcte: true },
      { texte_fr: "Sept portes", est_correcte: false },
      { texte_fr: "Dix portes", est_correcte: false },
      { texte_fr: "Quatre portes", est_correcte: false },
    ],
  },
  // ===================== SIRAH (15) =====================
  {
    domaine: 'sirah', sous_domaine: 'naissance', niveau: 1, madhab: 'general',
    texte_fr: "Dans quelle ville le Prophète Muhammad ﷺ est-il né ?",
    texte_ar: 'في أي مدينة وُلد النبي محمد ﷺ؟',
    explication: "Le Prophète Muhammad ﷺ est né à La Mecque (Makka Al-Mukarrama) dans le quartier de Banu Hashim, l'an de l'Éléphant (environ 570 CE).",
    reponses: [
      { texte_fr: "La Mecque (Makka Al-Mukarrama)", texte_ar: 'مكة المكرمة', est_correcte: true },
      { texte_fr: "Médine (Al-Madina Al-Munawwara)", est_correcte: false },
      { texte_fr: "Taïf (At-Ta'if)", est_correcte: false },
      { texte_fr: "Jérusalem (Al-Quds)", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'naissance', niveau: 1, madhab: 'general',
    texte_fr: "Quel était le nom du père du Prophète Muhammad ﷺ ?",
    texte_ar: 'ما اسم والد النبي محمد ﷺ؟',
    explication: "Le père du Prophète ﷺ était Abdullah ibn Abd Al-Muttalib. Il mourut avant la naissance du Prophète ﷺ (selon l'opinion dominante) à Médine lors d'un voyage commercial.",
    reponses: [
      { texte_fr: "Abdullah ibn Abd Al-Muttalib", texte_ar: 'عبد الله بن عبد المطلب', est_correcte: true },
      { texte_fr: "Abu Talib", est_correcte: false },
      { texte_fr: "Hamza ibn Abd Al-Muttalib", est_correcte: false },
      { texte_fr: "Al-Abbas ibn Abd Al-Muttalib", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'premiere_revelation', niveau: 1, madhab: 'general',
    texte_fr: "Dans quelle grotte le Prophète ﷺ reçut-il la première révélation ?",
    texte_ar: 'في أي غار نزل الوحي على النبي ﷺ أول مرة؟',
    dalil_ref: 'Sahih Al-Bukhari 3',
    grade_hadith: 'mutawatir',
    explication: "Le Prophète ﷺ reçut la première révélation dans la grotte de Hira, située sur le mont An-Nur (Jabal An-Nur) près de La Mecque. C'était durant le mois de Ramadan.",
    reponses: [
      { texte_fr: "La grotte de Hira (sur le mont An-Nur)", texte_ar: 'غار حراء', est_correcte: true },
      { texte_fr: "La grotte de Thawr", est_correcte: false },
      { texte_fr: "La Ka'ba", est_correcte: false },
      { texte_fr: "La grotte d'Abu Qubays", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'hijra', niveau: 1, madhab: 'general',
    texte_fr: "En quelle année islamique eut lieu la Hijra (migration du Prophète ﷺ vers Médine) ?",
    texte_ar: 'متى كانت الهجرة النبوية إلى المدينة المنورة؟',
    explication: "La Hijra eut lieu en l'an 622 CE, ce qui correspond à l'an 1 de l'ère islamique (l'Hégire). Le Calife Umar ibn Al-Khattab choisit cet événement comme point de départ du calendrier islamique.",
    reponses: [
      { texte_fr: "622 CE (an 1 de l'Hégire)", texte_ar: '١ هجري / ٦٢٢ م', est_correcte: true },
      { texte_fr: "610 CE (début de la révélation)", est_correcte: false },
      { texte_fr: "630 CE (conquête de La Mecque)", est_correcte: false },
      { texte_fr: "632 CE (mort du Prophète ﷺ)", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'batailles', niveau: 2, madhab: 'general',
    texte_fr: "Lors de quelle bataille les musulmans remportèrent-ils leur première victoire malgré leur infériorité numérique (313 contre 1000) ?",
    texte_ar: 'في أي غزوة انتصر المسلمون رغم قلة عددهم (313 مقابل 1000)؟',
    dalil_ref: 'Sourate Al-Anfal 8:5',
    explication: "La bataille de Badr (2 AH / 624 CE) fut la première grande victoire des musulmans. Ils étaient 313 contre environ 1000 Qurayshites. C'est le Jour du Furqan (critère de distinction).",
    reponses: [
      { texte_fr: "La bataille de Badr (2 AH)", texte_ar: 'غزوة بدر الكبرى', est_correcte: true },
      { texte_fr: "La bataille de Uhud (3 AH)", est_correcte: false },
      { texte_fr: "La bataille de Khandaq (5 AH)", est_correcte: false },
      { texte_fr: "La bataille de Hunayn (8 AH)", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'batailles', niveau: 2, madhab: 'general',
    texte_fr: "Lors de quelle bataille le Prophète ﷺ fut-il blessé et la rumeur de sa mort se répandit-elle ?",
    texte_ar: 'في أي غزوة جُرح النبي ﷺ وانتشرت شائعة استشهاده؟',
    dalil_ref: 'Sourate Al Imran 3:144',
    explication: "Lors de la bataille de Uhud (3 AH / 625 CE), les archers quittèrent leur poste malgré les ordres, permettant aux Qurayshites de contourner l'armée. Le Prophète ﷺ fut blessé et 70 Compagnons furent martyrisés.",
    reponses: [
      { texte_fr: "La bataille de Uhud (3 AH)", texte_ar: 'غزوة أحد', est_correcte: true },
      { texte_fr: "La bataille de Badr", est_correcte: false },
      { texte_fr: "La bataille de Khandaq", est_correcte: false },
      { texte_fr: "La bataille de Mu'ta", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'batailles', niveau: 2, madhab: 'general',
    texte_fr: "Quel Compagnon proposa l'idée de creuser un fossé (khandaq) pour défendre Médine ?",
    texte_ar: 'من اقترح حفر الخندق للدفاع عن المدينة؟',
    explication: "Salman Al-Farisi (Salman le Persan) proposa l'idée de creuser un fossé autour de Médine, une tactique de guerre persane inconnue des Arabes. Le Prophète ﷺ adopta cette idée lors de la bataille de Khandaq (5 AH).",
    reponses: [
      { texte_fr: "Salman Al-Farisi (Salman le Persan)", texte_ar: 'سلمان الفارسي رضي الله عنه', est_correcte: true },
      { texte_fr: "Umar ibn Al-Khattab", est_correcte: false },
      { texte_fr: "Ali ibn Abi Talib", est_correcte: false },
      { texte_fr: "Abu Bakr As-Siddiq", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'fath_makka', niveau: 2, madhab: 'general',
    texte_fr: "En quelle année eut lieu la conquête de La Mecque (Fath Makka) ?",
    texte_ar: 'في أي عام كان فتح مكة المكرمة؟',
    explication: "La conquête de La Mecque eut lieu en l'an 8 AH (630 CE). Le Prophète ﷺ entra à La Mecque avec 10 000 musulmans et accorda l'amnistie générale aux Qurayshites.",
    reponses: [
      { texte_fr: "8 AH (630 CE)", texte_ar: '٨ هجري', est_correcte: true },
      { texte_fr: "6 AH (628 CE)", est_correcte: false },
      { texte_fr: "10 AH (632 CE)", est_correcte: false },
      { texte_fr: "5 AH (627 CE)", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'mort', niveau: 1, madhab: 'general',
    texte_fr: "À quel âge le Prophète Muhammad ﷺ quitta-t-il ce monde ?",
    texte_ar: 'كم كان عمر النبي محمد ﷺ عند وفاته؟',
    dalil_ref: 'Sahih Al-Bukhari 3536',
    grade_hadith: 'sahih',
    explication: "Le Prophète Muhammad ﷺ mourut à l'âge de 63 ans en l'an 11 AH (632 CE) à Médine. Il passa 40 ans avant la prophétie, 13 ans à La Mecque après la révélation, et 10 ans à Médine.",
    reponses: [
      { texte_fr: "63 ans", texte_ar: '٦٣ سنة', est_correcte: true },
      { texte_fr: "60 ans", est_correcte: false },
      { texte_fr: "70 ans", est_correcte: false },
      { texte_fr: "55 ans", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'mort', niveau: 2, madhab: 'general',
    texte_fr: "Dans quelle maison et à côté de qui le Prophète ﷺ fut-il enterré ?",
    texte_ar: 'في بيت من دُفن النبي ﷺ؟',
    dalil_ref: 'Sahih Al-Bukhari 1388',
    grade_hadith: 'sahih',
    explication: "Le Prophète ﷺ fut enterré dans la chambre de 'A'isha (radhiallahu anha), là où il mourut. Les savants rapportent que les prophètes sont enterrés là où ils meurent.",
    reponses: [
      { texte_fr: "Dans la chambre de 'A'isha (radhiallahu anha)", texte_ar: 'في حجرة عائشة رضي الله عنها', est_correcte: true },
      { texte_fr: "Dans la mosquée du Prophète directement", est_correcte: false },
      { texte_fr: "Au cimetière de Baqia'", est_correcte: false },
      { texte_fr: "Dans la chambre de Khadija (radhiallahu anha)", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'batailles', niveau: 3, madhab: 'general',
    texte_fr: "Qu'est-ce que le traité de Hudaybiyya (Sulh Al-Hudaybiyya) et en quelle année fut-il signé ?",
    texte_ar: 'ما صلح الحديبية ومتى كان؟',
    dalil_ref: 'Sourate Al-Fath 48:1',
    dalil_texte_ar: 'إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا',
    dalil_texte_fr: "Nous t'avons accordé une victoire éclatante.",
    explication: "Le traité de Hudaybiyya (6 AH / 628 CE) fut un accord entre le Prophète ﷺ et les Qurayshites. Bien qu'il parût défavorable aux musulmans, Allah l'appela 'victoire éclatante'. Il permit deux ans de paix et d'expansion de l'Islam.",
    reponses: [
      { texte_fr: "Un traité de paix signé en 6 AH entre les musulmans et les Qurayshites", est_correcte: true },
      { texte_fr: "Une victoire militaire des musulmans", est_correcte: false },
      { texte_fr: "Un accord avec les juifs de Médine", est_correcte: false },
      { texte_fr: "L'accord d'alliance avec les Ansar", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'naissance', niveau: 2, madhab: 'general',
    texte_fr: "Comment s'appelait la nourrice (dada) qui s'occupa du Prophète ﷺ dans son enfance ?",
    texte_ar: 'ما اسم مرضعة النبي ﷺ في طفولته؟',
    explication: "Halima As-Sa'diyya est la nourrice qui accueillit le Prophète Muhammad ﷺ dans la tribu des Banu Sa'd. Il vécut avec elle deux à cinq ans dans le désert, où eut lieu l'incident de l'ouverture de la poitrine.",
    reponses: [
      { texte_fr: "Halima As-Sa'diyya", texte_ar: 'حليمة السعدية', est_correcte: true },
      { texte_fr: "Thuwaybah Al-Aslamiyya", est_correcte: false },
      { texte_fr: "Umm Ayman (Barakah)", est_correcte: false },
      { texte_fr: "Fatima bint Asad", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'premiere_revelation', niveau: 2, madhab: 'general',
    texte_fr: "Qui fut le premier homme à accepter l'Islam après la première révélation ?",
    texte_ar: 'من أول رجل أسلم بعد نزول الوحي؟',
    explication: "Abu Bakr As-Siddiq fut le premier homme libre adulte à accepter l'Islam. Khadija (radhiallahu anha) fut la première parmi tous, suivie par Ali ibn Abi Talib parmi les jeunes, puis Zayd ibn Haritha parmi les affranchis.",
    reponses: [
      { texte_fr: "Abu Bakr As-Siddiq", texte_ar: 'أبو بكر الصديق رضي الله عنه', est_correcte: true },
      { texte_fr: "Ali ibn Abi Talib", est_correcte: false },
      { texte_fr: "Umar ibn Al-Khattab", est_correcte: false },
      { texte_fr: "Uthman ibn Affan", est_correcte: false },
    ],
  },
  // ===================== SCIENCES ISLAMIQUES (15) =====================
  {
    domaine: 'sciences_islamiques', sous_domaine: 'madhabs', niveau: 2, madhab: 'general',
    texte_fr: "Quel est le fondateur du madhhab hanafi et quand vécut-il ?",
    texte_ar: 'من مؤسس المذهب الحنفي ومتى عاش؟',
    explication: "L'Imam Abu Hanifa Nu'man ibn Thabit Al-Kufi vécut de 80 AH à 150 AH (699-767 CE) à Kufa (Irak). Il est surnommé 'Al-Imam Al-A'dham' (le Grand Imam). Il est le fondateur de la première école juridique codifiée.",
    reponses: [
      { texte_fr: "Abu Hanifa (80-150 AH / 699-767 CE)", texte_ar: 'أبو حنيفة النعمان بن ثابت', est_correcte: true },
      { texte_fr: "Malik ibn Anas (93-179 AH)", est_correcte: false },
      { texte_fr: "Ahmad ibn Hanbal (164-241 AH)", est_correcte: false },
      { texte_fr: "Muhammad ibn Idris Ash-Shafi'i (150-204 AH)", est_correcte: false },
    ],
  },
  {
    domaine: 'sciences_islamiques', sous_domaine: 'madhabs', niveau: 2, madhab: 'general',
    texte_fr: "Dans quelle ville vécut et enseigna principalement l'Imam Malik ibn Anas, fondateur du madhhab maliki ?",
    texte_ar: 'في أي مدينة عاش الإمام مالك بن أنس وعلّم؟',
    explication: "L'Imam Malik ibn Anas (93-179 AH / 711-795 CE) vécut et enseigna à Médine toute sa vie. Il est l'auteur du Muwatta', le plus ancien recueil de fiqh et hadith. Son madhhab est répandu en Afrique du Nord et de l'Ouest.",
    reponses: [
      { texte_fr: "Médine (Al-Madina Al-Munawwara)", texte_ar: 'المدينة المنورة', est_correcte: true },
      { texte_fr: "La Mecque", est_correcte: false },
      { texte_fr: "Bagdad", est_correcte: false },
      { texte_fr: "Kufa", est_correcte: false },
    ],
  },
  {
    domaine: 'sciences_islamiques', sous_domaine: 'madhabs', niveau: 2, madhab: 'general',
    texte_fr: "L'Imam Ash-Shafi'i est connu pour avoir fondé la science de 'Usul Al-Fiqh'. Quel est son principal ouvrage ?",
    texte_ar: "ما أبرز كتب الإمام الشافعي في أصول الفقه؟",
    explication: "L'Imam Ash-Shafi'i (150-204 AH / 767-820 CE) est le fondateur de la science des usul al-fiqh (principes du droit islamique). Son livre 'Ar-Risala' est considéré comme le premier ouvrage systématique sur les usul al-fiqh.",
    reponses: [
      { texte_fr: "Ar-Risala (la Lettre)", texte_ar: 'الرسالة', est_correcte: true },
      { texte_fr: "Al-Muwatta'", est_correcte: false },
      { texte_fr: "Al-Musnad", est_correcte: false },
      { texte_fr: "Al-Umm", est_correcte: false },
    ],
  },
  {
    domaine: 'sciences_islamiques', sous_domaine: 'madhabs', niveau: 2, madhab: 'general',
    texte_fr: "Quel imam connu pour ses épreuves (mihna) fut emprisonné pour avoir refusé de dire que le Coran est créé ?",
    texte_ar: 'من الإمام الذي سُجن لرفضه القول بخلق القرآن؟',
    explication: "L'Imam Ahmad ibn Hanbal (164-241 AH / 780-855 CE) fut emprisonné et fouetté durant la Mihna (inquisition abbasside) sous Al-Ma'mun et Al-Mu'tasim pour avoir refusé de dire que le Coran est créé. Il est le fondateur du madhhab hanbali.",
    reponses: [
      { texte_fr: "Ahmad ibn Hanbal", texte_ar: 'الإمام أحمد بن حنبل', est_correcte: true },
      { texte_fr: "Imam Malik", est_correcte: false },
      { texte_fr: "Imam Ash-Shafi'i", est_correcte: false },
      { texte_fr: "Ibn Taymiyya", est_correcte: false },
    ],
  },
  {
    domaine: 'sciences_islamiques', sous_domaine: 'tafsir', niveau: 2, madhab: 'general',
    texte_fr: "Quelle est la différence entre le tafsir bil-ma'thur et le tafsir bil-ra'y ?",
    texte_ar: 'ما الفرق بين التفسير بالمأثور والتفسير بالرأي؟',
    explication: "Le tafsir bil-ma'thur (par transmission) explique le Coran par le Coran lui-même, puis par la Sunnah, puis par les paroles des Compagnons. Le tafsir bil-ra'y (par opinion) se base sur l'ijtihad et la réflexion rationnelle, ce qui est permis si conforme aux règles linguistiques et religieuses.",
    reponses: [
      { texte_fr: "Bil-ma'thur : par textes transmis (Coran, Sunnah, Sahaba) ; bil-ra'y : par réflexion rationnelle", est_correcte: true },
      { texte_fr: "Bil-ma'thur : par raisonnement philosophique ; bil-ra'y : par hadiths", est_correcte: false },
      { texte_fr: "Ils sont identiques, juste des termes différents", est_correcte: false },
      { texte_fr: "Bil-ma'thur est interdit, bil-ra'y est obligatoire", est_correcte: false },
    ],
  },
  {
    domaine: 'sciences_islamiques', sous_domaine: 'ijaz', niveau: 3, madhab: 'general',
    texte_fr: "Qu'est-ce que l'I'jaz Al-Qurani (l'inimitabilité du Coran) ?",
    texte_ar: 'ما الإعجاز القرآني؟',
    dalil_ref: 'Sourate Al-Isra 17:88',
    dalil_texte_ar: 'قُل لَّئِنِ اجْتَمَعَتِ الْإِنسُ وَالْجِنُّ عَلَىٰ أَن يَأْتُوا بِمِثْلِ هَٰذَا الْقُرْآنِ لَا يَأْتُونَ بِمِثْلِهِ',
    dalil_texte_fr: "Dis : si les hommes et les djinns s'unissaient pour produire quelque chose de semblable à ce Coran, ils n'y parviendraient pas.",
    explication: "L'I'jaz désigne le caractère inimitable et unique du Coran. Les dimensions incluent : linguistique (balagha), scientifique, législatif, et prophétique. Le défi (tahhaddi) fut lancé à toute l'humanité de produire quelque chose de similaire.",
    reponses: [
      { texte_fr: "Le caractère unique et inimitable du Coran que nul ne peut reproduire", texte_ar: 'عجز البشر عن الإتيان بمثله', est_correcte: true },
      { texte_fr: "La facilité de mémorisation du Coran", est_correcte: false },
      { texte_fr: "La beauté de la récitation uniquement", est_correcte: false },
      { texte_fr: "Les versets abrogés du Coran", est_correcte: false },
    ],
  },
  {
    domaine: 'sciences_islamiques', sous_domaine: 'usul', niveau: 3, madhab: 'general',
    texte_fr: "Quelles sont les quatre sources principales du fiqh islamique selon les usul al-fiqh ?",
    texte_ar: 'ما مصادر الفقه الإسلامي الأربعة الأصلية عند أهل السنة؟',
    explication: "Les quatre sources primaires du fiqh sont : le Coran (Al-Quran), la Sunnah (hadiths et pratiques du Prophète), le consensus (Ijma') des savants, et le raisonnement analogique (Qiyas). D'autres sources secondaires comme l'Istihsan et la Maslaha Mursala sont reconnues par certains madhhabs.",
    reponses: [
      { texte_fr: "Le Coran, la Sunnah, l'Ijma' (consensus), et le Qiyas (analogie)", texte_ar: 'القرآن والسنة والإجماع والقياس', est_correcte: true },
      { texte_fr: "Le Coran, la Sunnah, et les opinions des Compagnons uniquement", est_correcte: false },
      { texte_fr: "Le Coran, l'ijtihad, et la raison", est_correcte: false },
      { texte_fr: "Les quatre madhhabs uniquement", est_correcte: false },
    ],
  },
  {
    domaine: 'sciences_islamiques', sous_domaine: 'tafsir', niveau: 2, madhab: 'general',
    texte_fr: "Quel est le tafsir considéré comme la référence la plus importante du tafsir bil-ma'thur ?",
    texte_ar: 'ما أبرز كتب التفسير بالمأثور في تاريخ العلوم الإسلامية؟',
    explication: "Le Tafsir d'Ibn Jarir At-Tabari (Jami' Al-Bayan fi Ta'wil Al-Quran) est considéré comme la référence fondamentale du tafsir bil-ma'thur. Parmi les autres références : Tafsir Ibn Kathir et Tafsir Al-Baghawi.",
    reponses: [
      { texte_fr: "Tafsir At-Tabari (Jami' Al-Bayan)", texte_ar: 'تفسير الطبري', est_correcte: true },
      { texte_fr: "Tafsir Al-Jalalayn", est_correcte: false },
      { texte_fr: "Tafsir Az-Zamakhshari (Al-Kashshaf)", est_correcte: false },
      { texte_fr: "Tafsir Al-Qurtubi", est_correcte: false },
    ],
  },
  {
    domaine: 'sciences_islamiques', sous_domaine: 'hadith', niveau: 2, madhab: 'general',
    texte_fr: "Que sont les Kutub As-Sitta (les Six Livres) dans les sciences du hadith ?",
    texte_ar: 'ما الكتب الستة في علم الحديث؟',
    explication: "Les Kutub As-Sitta sont les six recueils de hadiths les plus importants : Sahih Al-Bukhari, Sahih Muslim, Sunan Abu Dawud, Jami' At-Tirmidhi, Sunan An-Nasa'i, et Sunan Ibn Majah.",
    reponses: [
      { texte_fr: "Al-Bukhari, Muslim, Abu Dawud, At-Tirmidhi, An-Nasa'i, Ibn Majah", est_correcte: true },
      { texte_fr: "Al-Bukhari, Muslim, Ahmad, Malik, Shafi'i, Ibn Hanbal", est_correcte: false },
      { texte_fr: "Al-Bukhari, Muslim, Ibn Taymiyya, Ibn Kathir, Nawawi, Qurtubi", est_correcte: false },
      { texte_fr: "Les quatre principales collections seulement (Bukhari, Muslim, Abu Dawud, Tirmidhi)", est_correcte: false },
    ],
  },
  {
    domaine: 'sciences_islamiques', sous_domaine: 'usul', niveau: 3, madhab: 'general',
    texte_fr: "Qu'est-ce que le Nasikh et le Mansukh dans les sciences coraniques ?",
    texte_ar: 'ما الناسخ والمنسوخ في علوم القرآن؟',
    explication: "Le Nasikh est le verset qui abroge (annule) un verset antérieur. Le Mansukh est le verset abrogé. L'abrogation ne concerne que les rulings (ahkam), pas les questions de croyance. Exemples : les versets sur la direction de la qibla, les boissons alcoolisées.",
    reponses: [
      { texte_fr: "Nasikh : le verset abrogeant ; Mansukh : le verset abrogé", texte_ar: 'الناسخ: اللاحق المزيل للحكم، المنسوخ: السابق المزال حكمه', est_correcte: true },
      { texte_fr: "Nasikh : les versets mecquois ; Mansukh : les versets médinois", est_correcte: false },
      { texte_fr: "Nasikh : les versets longs ; Mansukh : les versets courts", est_correcte: false },
      { texte_fr: "Ce sont deux types de lectures (qira'at) du Coran", est_correcte: false },
    ],
  },
  {
    domaine: 'sciences_islamiques', sous_domaine: 'madhabs', niveau: 1, madhab: 'general',
    texte_fr: "Quelle est la géographie principale de diffusion du madhhab maliki de nos jours ?",
    texte_ar: 'ما المناطق الجغرافية الرئيسية لانتشار المذهب المالكي اليوم؟',
    explication: "Le madhhab maliki est dominant en Afrique du Nord (Maroc, Algérie, Tunisie, Libye), en Afrique de l'Ouest, au Soudan, et dans certaines parties du Golfe (Bahreïn, Koweït). Il fut autrefois répandu en Andalousie islamique.",
    reponses: [
      { texte_fr: "Afrique du Nord, Afrique de l'Ouest et parties du Golfe", est_correcte: true },
      { texte_fr: "Turquie, Asie centrale et Balkans", est_correcte: false },
      { texte_fr: "Indonésie, Malaisie et Afrique de l'Est uniquement", est_correcte: false },
      { texte_fr: "Arabie Saoudite et Yémen exclusivement", est_correcte: false },
    ],
  },
  {
    domaine: 'sciences_islamiques', sous_domaine: 'hadith', niveau: 3, madhab: 'general',
    texte_fr: "Qu'est-ce que le hadith 'qudsi' et en quoi diffère-t-il du Coran ?",
    texte_ar: 'ما الحديث القدسي وكيف يختلف عن القرآن الكريم؟',
    explication: "Le hadith qudsi est une parole d'Allah transmise par le Prophète ﷺ mais dont le wording n'est pas forcément divin (contrairement au Coran). Il ne peut être récité dans la prière, il n'est pas mutawatir dans sa totalité, et il ne constitue pas un défi (i'jaz) comme le Coran.",
    reponses: [
      { texte_fr: "Parole d'Allah transmise par le Prophète ﷺ mais non récitée en prière ni considérée comme i'jaz", est_correcte: true },
      { texte_fr: "Un verset coranique expliqué par le Prophète ﷺ", est_correcte: false },
      { texte_fr: "Un hadith faible dont l'origine est douteuse", est_correcte: false },
      { texte_fr: "Une prière spéciale transmise directement d'Allah", est_correcte: false },
    ],
  },
  {
    domaine: 'sciences_islamiques', sous_domaine: 'usul', niveau: 2, madhab: 'general',
    texte_fr: "Qu'est-ce que l'ijtihad dans la jurisprudence islamique ?",
    texte_ar: 'ما الاجتهاد في الفقه الإسلامي؟',
    explication: "L'ijtihad est l'effort maximal d'un juriste qualifié (mujtahid) pour déduire un ruling islamique (hukm) à partir des sources religieuses (Coran, Sunnah, etc.) pour des questions non explicitement traitées par les textes.",
    reponses: [
      { texte_fr: "L'effort d'un juriste qualifié pour déduire des rulings à partir des sources islamiques", texte_ar: 'بذل الفقيه وسعه لاستنباط الحكم', est_correcte: true },
      { texte_fr: "L'imitation aveugle d'un seul savant", est_correcte: false },
      { texte_fr: "La mémorisation des textes du Coran et de la Sunnah", est_correcte: false },
      { texte_fr: "La pratique des ibadats facultatives", est_correcte: false },
    ],
  },
  {
    domaine: 'sciences_islamiques', sous_domaine: 'usul', niveau: 2, madhab: 'general',
    texte_fr: "Qu'est-ce que le taqlid en fiqh islamique ?",
    texte_ar: 'ما التقليد في الفقه الإسلامي؟',
    explication: "Le taqlid est le fait de suivre l'opinion d'un savant sans en connaître la preuve (dalil). Il est généralement permis pour le musulman ordinaire (non-savant) qui n'est pas capable de déduire les rulings par lui-même.",
    reponses: [
      { texte_fr: "Suivre l'opinion d'un savant sans connaître sa preuve", texte_ar: 'العمل بقول المجتهد دون معرفة دليله', est_correcte: true },
      { texte_fr: "Mémoriser les avis de tous les madhhabs", est_correcte: false },
      { texte_fr: "Changer de madhhab selon sa convenance", est_correcte: false },
      { texte_fr: "Pratiquer l'ijtihad indépendant", est_correcte: false },
    ],
  },
  // ===================== HISTOIRE ISLAMIQUE - 4 CALIFES (10) =====================
  {
    domaine: 'histoire_islamique', sous_domaine: 'khulafa_rashidun', niveau: 1, madhab: 'general',
    texte_fr: "Quel était le titre officiel donné aux califes bien guidés et combien étaient-ils ?",
    texte_ar: 'ما لقب الخلفاء الراشدين وكم عددهم؟',
    dalil_ref: 'Sunan Abu Dawud 4607',
    dalil_texte_ar: 'عَلَيْكُمْ بِسُنَّتِي وَسُنَّةِ الْخُلَفَاءِ الرَّاشِدِينَ الْمَهْدِيِّينَ',
    dalil_texte_fr: "Tenez-vous à ma Sunnah et à la Sunnah des califes bien guidés.",
    grade_hadith: 'sahih',
    explication: "Les Khulafa Al-Rashidun (califes bien guidés) sont au nombre de quatre : Abu Bakr As-Siddiq, Umar ibn Al-Khattab, Uthman ibn Affan, et Ali ibn Abi Talib. Leur califat dura 30 ans (11-41 AH).",
    reponses: [
      { texte_fr: "Quatre califes (Abu Bakr, Umar, Uthman, Ali)", texte_ar: 'أبو بكر وعمر وعثمان وعلي', est_correcte: true },
      { texte_fr: "Cinq califes", est_correcte: false },
      { texte_fr: "Trois califes (Abu Bakr, Umar, Ali uniquement)", est_correcte: false },
      { texte_fr: "Six califes en comptant Omar II", est_correcte: false },
    ],
  },
  {
    domaine: 'histoire_islamique', sous_domaine: 'khulafa_rashidun', niveau: 2, madhab: 'general',
    texte_fr: "Quelle est la grande réalisation d'Abu Bakr As-Siddiq durant son califat (11-13 AH) ?",
    texte_ar: 'ما أبرز إنجازات أبي بكر الصديق في خلافته؟',
    explication: "Abu Bakr As-Siddiq (11-13 AH / 632-634 CE) : combattit les apostats (Ridda), unifia la péninsule arabique, commença les conquêtes (Irak, Syrie), et ordonna la compilation du Coran en un seul recueil (mushaf) sur recommandation d'Umar.",
    reponses: [
      { texte_fr: "Combattre les apostats (Ridda) et ordonner la compilation du Coran", est_correcte: true },
      { texte_fr: "Conquérir la Perse entière", est_correcte: false },
      { texte_fr: "Construire la mosquée du Prophète", est_correcte: false },
      { texte_fr: "Établir le calendrier islamique", est_correcte: false },
    ],
  },
  {
    domaine: 'histoire_islamique', sous_domaine: 'khulafa_rashidun', niveau: 2, madhab: 'general',
    texte_fr: "Quelle est la grande expansion territoriale associée au califat d'Umar ibn Al-Khattab (13-23 AH) ?",
    texte_ar: 'ما أبرز الفتوحات الإسلامية في عهد عمر بن الخطاب؟',
    explication: "Sous le califat d'Umar (13-23 AH / 634-644 CE), les musulmans conquirent la Perse (Sassanides), la Syrie, la Palestine (incluant Jérusalem), et l'Égypte. Umar établit le Diwan (registre militaire) et le calendrier hijri.",
    reponses: [
      { texte_fr: "La conquête de la Perse, la Syrie, la Palestine et l'Égypte", est_correcte: true },
      { texte_fr: "La conquête de l'Andalousie (Espagne)", est_correcte: false },
      { texte_fr: "La conquête de l'Inde uniquement", est_correcte: false },
      { texte_fr: "La défense de Médine contre les Croisés", est_correcte: false },
    ],
  },
  {
    domaine: 'histoire_islamique', sous_domaine: 'khulafa_rashidun', niveau: 2, madhab: 'general',
    texte_fr: "Quelle est la réalisation majeure d'Uthman ibn Affan en matière de Coran ?",
    texte_ar: 'ما أبرز إنجازات عثمان بن عفان في خدمة القرآن الكريم؟',
    explication: "Uthman ibn Affan (23-35 AH / 644-656 CE) standardisa l'orthographe du Coran en un seul mushaf officiel (le mushaf 'uthmani) et envoya des copies dans les grandes villes. Ceci mit fin aux divergences de récitation qui commençaient à apparaître.",
    reponses: [
      { texte_fr: "Standardisation du Coran en un seul mushaf officiel (mushaf 'uthmani)", texte_ar: 'توحيد المصحف العثماني', est_correcte: true },
      { texte_fr: "Première compilation du Coran en un livre", est_correcte: false },
      { texte_fr: "Ajout des points diacritiques au Coran", est_correcte: false },
      { texte_fr: "Mémorisation complète du Coran par tous les Compagnons", est_correcte: false },
    ],
  },
  {
    domaine: 'histoire_islamique', sous_domaine: 'khulafa_rashidun', niveau: 2, madhab: 'general',
    texte_fr: "Quel est le lien de parenté d'Ali ibn Abi Talib avec le Prophète Muhammad ﷺ ?",
    texte_ar: 'ما صلة علي بن أبي طالب بالنبي محمد ﷺ؟',
    explication: "Ali ibn Abi Talib était à la fois le cousin du Prophète ﷺ (fils d'Abu Talib, oncle du Prophète) et son gendre (époux de Fatima Az-Zahra, fille du Prophète). Il fut le quatrième calife (35-41 AH / 656-661 CE).",
    reponses: [
      { texte_fr: "Cousin et gendre du Prophète ﷺ (époux de Fatima)", est_correcte: true },
      { texte_fr: "Frère du Prophète ﷺ", est_correcte: false },
      { texte_fr: "Fils adoptif du Prophète ﷺ", est_correcte: false },
      { texte_fr: "Beau-frère du Prophète ﷺ uniquement", est_correcte: false },
    ],
  },
  {
    domaine: 'histoire_islamique', sous_domaine: 'khulafa_rashidun', niveau: 3, madhab: 'general',
    texte_fr: "Qu'est-ce que la Fitna (première guerre civile islamique) qui eut lieu durant le califat d'Ali ?",
    texte_ar: 'ما الفتنة الكبرى التي وقعت في عهد علي بن أبي طالب؟',
    explication: "La première Fitna (guerre civile) commença après l'assassinat d'Uthman et incluait la bataille du Chameau (avec 'A'isha, Az-Zubayr et Talha) et la bataille de Siffin (avec Mu'awiya). Ali fut assassiné en 41 AH. Ahlu Sunnah s'abstient de blâmer l'un des partis.",
    reponses: [
      { texte_fr: "Les conflits armés suite à l'assassinat d'Uthman, incluant les batailles du Chameau et de Siffin", est_correcte: true },
      { texte_fr: "La guerre contre les Byzantins", est_correcte: false },
      { texte_fr: "La révolte des apostats (Ridda)", est_correcte: false },
      { texte_fr: "L'invasion mongole de Bagdad", est_correcte: false },
    ],
  },
  {
    domaine: 'histoire_islamique', sous_domaine: 'khulafa_rashidun', niveau: 2, madhab: 'general',
    texte_fr: "Quelle était la durée totale du califat des quatre Califes bien guidés ?",
    texte_ar: 'ما مدة خلافة الخلفاء الراشدين الأربعة؟',
    dalil_ref: 'Sunan Abu Dawud 4607',
    explication: "Le califat des quatre califes bien guidés dura environ 30 ans (de 11 AH à 41 AH). Abu Bakr : 2 ans, Umar : 10 ans, Uthman : 12 ans, Ali : 5 ans. Cela correspond à la prophétie du Prophète ﷺ.",
    reponses: [
      { texte_fr: "Environ 30 ans (11-41 AH)", texte_ar: '٣٠ سنة تقريبًا', est_correcte: true },
      { texte_fr: "Environ 50 ans", est_correcte: false },
      { texte_fr: "Environ 20 ans", est_correcte: false },
      { texte_fr: "Environ 100 ans", est_correcte: false },
    ],
  },
  {
    domaine: 'histoire_islamique', sous_domaine: 'khulafa_rashidun', niveau: 1, madhab: 'general',
    texte_fr: "Par quel surnom honorifique Abu Bakr fut-il connu ?",
    texte_ar: 'بأي لقب اشتُهر أبو بكر رضي الله عنه؟',
    explication: "Abu Bakr reçut le surnom 'As-Siddiq' (le très sincère, le véridique) car il crut immédiatement et sans hésitation à tous les récits du Prophète ﷺ, notamment l'événement du Isra' et Mi'raj.",
    reponses: [
      { texte_fr: "As-Siddiq (le très sincère)", texte_ar: 'الصديق', est_correcte: true },
      { texte_fr: "Al-Faruq (celui qui distingue)", est_correcte: false },
      { texte_fr: "Dhul-Nurayn (celui aux deux lumières)", est_correcte: false },
      { texte_fr: "Asad Allah (le lion d'Allah)", est_correcte: false },
    ],
  },
  {
    domaine: 'histoire_islamique', sous_domaine: 'khulafa_rashidun', niveau: 1, madhab: 'general',
    texte_fr: "Par quel surnom honorifique Umar ibn Al-Khattab fut-il connu ?",
    texte_ar: 'بأي لقب اشتُهر عمر بن الخطاب رضي الله عنه؟',
    explication: "Umar ibn Al-Khattab reçut le surnom 'Al-Faruq' (celui qui distingue) car sa conversion à l'Islam fut un tournant décisif permettant aux musulmans de prier ouvertement à La Mecque. Il était connu pour son sens de la justice.",
    reponses: [
      { texte_fr: "Al-Faruq (celui qui distingue entre le vrai et le faux)", texte_ar: 'الفاروق', est_correcte: true },
      { texte_fr: "As-Siddiq (le très sincère)", est_correcte: false },
      { texte_fr: "Dhul-Nurayn (celui aux deux lumières)", est_correcte: false },
      { texte_fr: "Abu Al-Hasan (père de Hasan)", est_correcte: false },
    ],
  },
  {
    domaine: 'histoire_islamique', sous_domaine: 'khulafa_rashidun', niveau: 1, madhab: 'general',
    texte_fr: "Pourquoi Uthman ibn Affan fut-il surnommé 'Dhul-Nurayn' (celui aux deux lumières) ?",
    texte_ar: 'لماذا لُقّب عثمان بن عفان بذي النورين؟',
    explication: "Uthman ibn Affan fut surnommé 'Dhul-Nurayn' car il épousa successivement deux filles du Prophète Muhammad ﷺ : d'abord Ruqayya, puis après son décès, Umm Kulthoum. Ainsi, il eut deux 'lumières' (filles du Prophète ﷺ).",
    reponses: [
      { texte_fr: "Il épousa deux filles du Prophète ﷺ (Ruqayya puis Umm Kulthoum)", texte_ar: 'تزوج ابنتين للنبي ﷺ', est_correcte: true },
      { texte_fr: "Il mémorisa le Coran deux fois", est_correcte: false },
      { texte_fr: "Il convertit deux grandes tribus à l'Islam", est_correcte: false },
      { texte_fr: "Il construisit deux mosquées importantes", est_correcte: false },
    ],
  },
];

export async function seedQuestionsExtra3(client: Client): Promise<void> {
  console.log('Seeding questions_extra3...');
  let inserted = 0;
  let skipped = 0;

  for (const q of QUESTIONS_EXTRA3) {
    // Check if question already exists
    const exists = await client.query(
      'SELECT id FROM questions WHERE texte_fr = $1',
      [q.texte_fr]
    );
    if (exists.rows.length > 0) {
      skipped++;
      continue;
    }

    const result = await client.query(
      `INSERT INTO questions
        (domaine, sous_domaine, niveau, madhab, texte_fr, texte_ar,
         dalil_ref, dalil_texte_ar, dalil_texte_fr, explication,
         savant_reference, grade_hadith, est_validee)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,true)
       RETURNING id`,
      [
        q.domaine, q.sous_domaine ?? null, q.niveau, q.madhab,
        q.texte_fr, q.texte_ar ?? null,
        q.dalil_ref ?? null, q.dalil_texte_ar ?? null, q.dalil_texte_fr ?? null,
        q.explication ?? null, q.savant_reference ?? null, q.grade_hadith ?? null,
      ]
    );

    const questionId = result.rows[0].id;
    for (const r of q.reponses) {
      await client.query(
        `INSERT INTO reponses (question_id, texte_fr, texte_ar, est_correcte)
         VALUES ($1, $2, $3, $4)`,
        [questionId, r.texte_fr, r.texte_ar ?? null, r.est_correcte]
      );
    }
    inserted++;
  }

  console.log(`questions_extra3: ${inserted} inserted, ${skipped} skipped.`);
}
