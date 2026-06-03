import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

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

const QUESTIONS: QuestionSeed[] = [
  // ============================================================
  // FIQH TAHARAH
  // ============================================================
  {
    domaine: 'fiqh',
    sous_domaine: 'taharah',
    niveau: 1,
    madhab: 'general',
    texte_fr: 'Combien de fois faut-il laver chaque membre lors du wudu (ablutions) ?',
    texte_ar: 'كم مرة يجب غسل كل عضو في الوضوء؟',
    dalil_ref: 'Sourate Al-Maidah 5:6',
    dalil_texte_ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ',
    dalil_texte_fr: 'O vous qui croyez ! Lorsque vous vous levez pour la prière, lavez vos visages et vos mains jusqu\'aux coudes',
    explication: 'La Sunna établit 3 lavages pour chaque membre du wudu, ce qui est la perfection. Un seul lavage est obligatoire selon les 4 madhabs.',
    reponses: [
      { texte_fr: '3 fois (Sunna)', texte_ar: 'ثلاث مرات (سنة)', est_correcte: true },
      { texte_fr: '1 fois seulement', texte_ar: 'مرة واحدة فقط', est_correcte: false },
      { texte_fr: '2 fois', texte_ar: 'مرتان', est_correcte: false },
      { texte_fr: '5 fois', texte_ar: 'خمس مرات', est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh',
    sous_domaine: 'taharah',
    niveau: 2,
    madhab: 'general',
    texte_fr: 'Parmi les éléments suivants, lequel annule le wudu selon le consensus des 4 Madhabs ?',
    texte_ar: 'أي من الآتي ينقض الوضوء باتفاق المذاهب الأربعة؟',
    explication: 'La sortie de vent, d\'urine ou de selles annule le wudu par consensus. La viande de chameau (Hanbali), le rire fort en prière (Hanafi) et le contact avec une femme (Shafi\'i) sont des positions spécifiques à certains madhabs.',
    reponses: [
      { texte_fr: 'Sortie de vent, urine ou selles', texte_ar: 'خروج الريح أو البول أو الغائط', est_correcte: true },
      { texte_fr: 'Manger de la viande de chameau', texte_ar: 'أكل لحم الإبل', est_correcte: false },
      { texte_fr: 'Rire fort pendant la prière', texte_ar: 'الضحك بصوت عالٍ في الصلاة', est_correcte: false },
      { texte_fr: 'Toucher une femme étrangère', texte_ar: 'لمس امرأة أجنبية', est_correcte: false },
    ],
  },
  // ============================================================
  // FIQH SALAT
  // ============================================================
  {
    domaine: 'fiqh',
    sous_domaine: 'salat',
    niveau: 1,
    madhab: 'general',
    texte_fr: 'Combien de Raka\'at compte la prière de Fajr (l\'aube) ?',
    texte_ar: 'كم ركعة في صلاة الفجر؟',
    dalil_ref: 'Hadith Aïsha - Ibn Majah 1140',
    explication: 'La prière de Fajr comprend 2 rak\'at obligatoires, précédées de 2 rak\'at de Sunna Muakkada.',
    reponses: [
      { texte_fr: '2 Raka\'at', texte_ar: 'ركعتان', est_correcte: true },
      { texte_fr: '3 Raka\'at', texte_ar: 'ثلاث ركعات', est_correcte: false },
      { texte_fr: '4 Raka\'at', texte_ar: 'أربع ركعات', est_correcte: false },
      { texte_fr: '1 Raka\'at', texte_ar: 'ركعة واحدة', est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh',
    sous_domaine: 'salat',
    niveau: 2,
    madhab: 'general',
    texte_fr: 'Quel est le nombre minimum de fois que l\'on récite Al-Fatiha dans les 5 prières obligatoires ?',
    texte_ar: 'ما هو الحد الأدنى لعدد مرات قراءة الفاتحة في الصلوات الخمس المفروضة؟',
    explication: 'Fajr(2) + Dhuhr(4) + Asr(4) + Maghrib(3) + Isha(4) = 17 rak\'at. Al-Fatiha est récitée dans chaque rak\'at.',
    savant_reference: 'Ibn Qudama, Al-Mughni',
    reponses: [
      { texte_fr: '17 fois', texte_ar: 'سبع عشرة مرة', est_correcte: true },
      { texte_fr: '10 fois', texte_ar: 'عشر مرات', est_correcte: false },
      { texte_fr: '5 fois', texte_ar: 'خمس مرات', est_correcte: false },
      { texte_fr: '34 fois', texte_ar: 'أربع وثلاثون مرة', est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh',
    sous_domaine: 'salat',
    niveau: 3,
    madhab: 'hanafi',
    texte_fr: 'Selon le Madhab Hanafi, la récitation d\'Al-Fatiha par le Muqtadi (celui qui prie derrière l\'imam) est :',
    texte_ar: 'حسب المذهب الحنفي، قراءة الفاتحة للمقتدي هي:',
    explication: 'Selon le Madhab Hanafi, le Muqtadi (celui qui prie derrière l\'imam) ne récite pas Al-Fatiha car l\'imam récite pour tous. C\'est différent des madhabs Shafi\'i et Maliki qui exigent la récitation dans les prières silencieuses.',
    savant_reference: 'Al-Hidaya d\'Al-Marghinani (Hanafi)',
    reponses: [
      { texte_fr: 'Non obligatoire, l\'imam récite pour tous', texte_ar: 'غير واجبة، الإمام يقرأ نيابة عن الجميع', est_correcte: true },
      { texte_fr: 'Obligatoire dans toutes les prières', texte_ar: 'واجبة في جميع الصلوات', est_correcte: false },
      { texte_fr: 'Obligatoire seulement dans les prières silencieuses', texte_ar: 'واجبة في الصلوات السرية فقط', est_correcte: false },
      { texte_fr: 'Recommandée (Mustahabb) mais non obligatoire', texte_ar: 'مستحبة وليست واجبة', est_correcte: false },
    ],
  },
  // ============================================================
  // AQIDA TAWHID
  // ============================================================
  {
    domaine: 'aqida',
    sous_domaine: 'tawhid',
    niveau: 2,
    madhab: 'general',
    texte_fr: 'Quels sont les 3 aspects du Tawhid selon Ahlu Sunna Wal Jama\'a ?',
    texte_ar: 'ما هي الأنواع الثلاثة للتوحيد عند أهل السنة والجماعة؟',
    dalil_ref: 'Al-Qawa\'id Al-Muthla - Ibn Uthaymin',
    explication: 'Les 3 aspects du Tawhid : 1) Tawhid Ar-Rububiyya (Unicité de la Seigneurie), 2) Tawhid Al-Uluhiyya (Unicité de l\'Adoration), 3) Tawhid Al-Asma\' Wa As-Sifat (Unicité des Noms et Attributs).',
    savant_reference: 'Ibn Uthaymin - Al-Qawa\'id Al-Muthla',
    reponses: [
      { texte_fr: 'Rububiyya, Uluhiyya, Al-Asma\' Wa As-Sifat', texte_ar: 'الربوبية والألوهية والأسماء والصفات', est_correcte: true },
      { texte_fr: 'Rububiyya, Uluhiyya, Nubuwwa', texte_ar: 'الربوبية والألوهية والنبوة', est_correcte: false },
      { texte_fr: 'Iman, Islam, Ihsan', texte_ar: 'الإيمان والإسلام والإحسان', est_correcte: false },
      { texte_fr: 'Salat, Zakat, Sawm', texte_ar: 'الصلاة والزكاة والصيام', est_correcte: false },
    ],
  },
  {
    domaine: 'aqida',
    sous_domaine: 'tawhid',
    niveau: 4,
    madhab: 'general',
    texte_fr: 'Quel est le sens de "La ilaha illa Allah" selon l\'interprétation d\'Ibn Taymiyya ?',
    texte_ar: 'ما معنى "لا إله إلا الله" حسب تفسير ابن تيمية؟',
    dalil_ref: 'Majmu\' Al-Fatawa - Ibn Taymiyya',
    dalil_texte_ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    explication: 'Ibn Taymiyya explique que "La ilaha" est une négation de toute divinité adorée en dehors d\'Allah, et "illa Allah" est l\'affirmation que seul Allah mérite d\'être adoré. La ilah signifie "Ma\'louh" (ce qui est adoré avec amour et vénération).',
    savant_reference: 'Ibn Taymiyya - Majmu\' Al-Fatawa vol. 3',
    reponses: [
      { texte_fr: 'Il n\'y a pas de divinité digne d\'adoration en dehors d\'Allah', texte_ar: 'لا معبود بحق إلا الله', est_correcte: true },
      { texte_fr: 'Il n\'y a pas de créateur sauf Allah', texte_ar: 'لا خالق إلا الله', est_correcte: false },
      { texte_fr: 'Il n\'y a pas de seigneur sauf Allah', texte_ar: 'لا رب إلا الله', est_correcte: false },
      { texte_fr: 'Il n\'y a pas de bienfaiteur sauf Allah', texte_ar: 'لا منعم إلا الله', est_correcte: false },
    ],
  },
  {
    domaine: 'aqida',
    sous_domaine: 'asma_wa_sifat',
    niveau: 2,
    madhab: 'general',
    texte_fr: 'Parmi les Noms d\'Allah, lequel signifie "Le Tout-Subtil, l\'Omniscient de toutes les subtilités" ?',
    texte_ar: 'أي أسماء الله الحسنى يعني "اللطيف العليم بدقائق الأمور"؟',
    dalil_ref: 'Sourate Al-An\'am 6:103',
    dalil_texte_ar: 'لَا تُدْرِكُهُ الْأَبْصَارُ وَهُوَ يُدْرِكُ الْأَبْصَارَ وَهُوَ اللَّطِيفُ الْخَبِيرُ',
    reponses: [
      { texte_fr: 'Al-Latif (اللطيف)', texte_ar: 'اللطيف', est_correcte: true },
      { texte_fr: 'Al-Khabir (الخبير)', texte_ar: 'الخبير', est_correcte: false },
      { texte_fr: 'Al-\'Alim (العليم)', texte_ar: 'العليم', est_correcte: false },
      { texte_fr: 'Al-Hakim (الحكيم)', texte_ar: 'الحكيم', est_correcte: false },
    ],
  },
  // ============================================================
  // AQIDA IMAN
  // ============================================================
  {
    domaine: 'aqida',
    sous_domaine: 'arkan_iman',
    niveau: 1,
    madhab: 'general',
    texte_fr: 'Combien de piliers (Arkân) compte l\'Iman ?',
    texte_ar: 'كم عدد أركان الإيمان؟',
    dalil_ref: 'Hadith Jibril - Sahih Muslim 8',
    dalil_texte_ar: 'أَنْ تُؤْمِنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الْآخِرِ وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ',
    dalil_texte_fr: 'Croire en Allah, en Ses anges, en Ses livres, en Ses messagers, au Jour Dernier, et croire au destin dans ce qu\'il a de bon et de mauvais.',
    explication: 'Les 6 piliers de l\'Iman selon le hadith de Jibril : 1) Allah 2) Les Anges 3) Les Livres révélés 4) Les Prophètes et Messagers 5) Le Jour Dernier 6) Al-Qadar (le Destin)',
    reponses: [
      { texte_fr: '6 piliers', texte_ar: 'ستة أركان', est_correcte: true },
      { texte_fr: '5 piliers', texte_ar: 'خمسة أركان', est_correcte: false },
      { texte_fr: '3 piliers', texte_ar: 'ثلاثة أركان', est_correcte: false },
      { texte_fr: '7 piliers', texte_ar: 'سبعة أركان', est_correcte: false },
    ],
  },
  {
    domaine: 'aqida',
    sous_domaine: 'iman',
    niveau: 2,
    madhab: 'general',
    texte_fr: 'L\'Iman (la foi) augmente-t-il et diminue-t-il selon Ahlu Sunna Wal Jama\'a ?',
    texte_ar: 'هل الإيمان يزيد وينقص عند أهل السنة والجماعة؟',
    dalil_ref: 'Sourate Al-Fath 48:4 + Sahih Bukhari',
    dalil_texte_ar: 'هُوَ الَّذِي أَنزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ لِيَزْدَادُوا إِيمَانًا مَّعَ إِيمَانِهِمْ',
    explication: 'Selon Ahlu Sunna Wal Jama\'a, l\'Iman est composé de la conviction du cœur (i\'tiqad), la parole de la langue (qawl) et les actes des membres (\'amal). Il augmente par l\'obéissance et diminue par le péché.',
    reponses: [
      { texte_fr: 'Oui, il augmente par l\'obéissance et diminue par le péché', texte_ar: 'نعم، يزيد بالطاعة وينقص بالمعصية', est_correcte: true },
      { texte_fr: 'Non, l\'Iman est fixe et immuable', texte_ar: 'لا، الإيمان ثابت لا يتغير', est_correcte: false },
      { texte_fr: 'Il augmente seulement, jamais il ne diminue', texte_ar: 'يزيد فقط ولا ينقص أبداً', est_correcte: false },
      { texte_fr: 'Cela dépend du madhab', texte_ar: 'يعتمد على المذهب', est_correcte: false },
    ],
  },
  // ============================================================
  // HADITH
  // ============================================================
  {
    domaine: 'hadith',
    sous_domaine: 'arba_in',
    niveau: 1,
    madhab: 'general',
    texte_fr: 'Quel est le premier hadith des 40 hadiths de l\'Imam An-Nawawi ?',
    texte_ar: 'ما هو أول حديث في الأربعين النووية؟',
    dalil_ref: 'Sahih Bukhari 1, Sahih Muslim 1907',
    dalil_texte_ar: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    dalil_texte_fr: 'Les actes ne valent que par les intentions, et chacun n\'aura que ce qu\'il a eu l\'intention d\'accomplir.',
    explication: 'Ce hadith fondamental enseigne que la valeur de tout acte dépend de l\'intention qui le motive. C\'est le premier hadith des Arba\'in An-Nawawiyya.',
    grade_hadith: 'Sahih (Mutawatir)',
    reponses: [
      { texte_fr: '"Les actes ne valent que par les intentions"', texte_ar: 'إنما الأعمال بالنيات', est_correcte: true },
      { texte_fr: '"La religion est le conseil sincère"', texte_ar: 'الدين النصيحة', est_correcte: false },
      { texte_fr: '"Le licite est évident et l\'illicite est évident"', texte_ar: 'الحلال بيّن والحرام بيّن', est_correcte: false },
      { texte_fr: '"Laisse ce qui te doute pour ce qui ne te doute pas"', texte_ar: 'دع ما يريبك إلى ما لا يريبك', est_correcte: false },
    ],
  },
  {
    domaine: 'hadith',
    sous_domaine: 'arba_in',
    niveau: 2,
    madhab: 'general',
    texte_fr: 'Dans le hadith de Jibril (as), le Prophète ﷺ définit l\'Ihsan comme :',
    texte_ar: 'في حديث جبريل، عرّف النبي ﷺ الإحسان بأنه:',
    dalil_ref: 'Sahih Muslim 8 - Hadith Jibril',
    dalil_texte_ar: 'أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ',
    dalil_texte_fr: 'Que tu adores Allah comme si tu Le voyais, car si tu ne Le vois pas, Lui te voit.',
    explication: 'L\'Ihsan est le plus haut degré de la religion islamique, après l\'Islam et l\'Iman. Il consiste à adorer Allah avec une présence totale du cœur, comme si on Le voyait.',
    grade_hadith: 'Sahih',
    reponses: [
      { texte_fr: '"Adorer Allah comme si tu Le voyais"', texte_ar: 'أن تعبد الله كأنك تراه', est_correcte: true },
      { texte_fr: '"Aimer pour ton frère ce que tu aimes pour toi-même"', texte_ar: 'أن تحب لأخيك ما تحب لنفسك', est_correcte: false },
      { texte_fr: '"Faire le bien aux parents et aux proches"', texte_ar: 'الإحسان إلى الوالدين والأرحام', est_correcte: false },
      { texte_fr: '"Obéir à Allah dans le secret et en public"', texte_ar: 'طاعة الله في السر والعلن', est_correcte: false },
    ],
  },
  {
    domaine: 'hadith',
    sous_domaine: 'arkan_islam',
    niveau: 1,
    madhab: 'general',
    texte_fr: 'Quel hadith enseigne que l\'Islam est bâti sur 5 piliers ?',
    texte_ar: 'أي حديث يبين أن الإسلام مبني على خمسة أركان؟',
    dalil_ref: 'Sahih Bukhari 8, Sahih Muslim 16',
    dalil_texte_ar: 'بُنِيَ الإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَصَوْمِ رَمَضَانَ، وَحَجِّ البَيْتِ',
    explication: 'Le hadith d\'Ibn Umar rapporte que l\'Islam est bâti sur 5 piliers : 1) Shahada, 2) Salat, 3) Zakat, 4) Siyam (jeûne de Ramadan), 5) Hajj.',
    grade_hadith: 'Sahih Mutawatir',
    reponses: [
      { texte_fr: 'Hadith d\'Ibn Umar (Bukhari 8, Muslim 16)', texte_ar: 'حديث ابن عمر (بخاري 8، مسلم 16)', est_correcte: true },
      { texte_fr: 'Hadith d\'Abu Hureyra (Bukhari 2)', texte_ar: 'حديث أبي هريرة (بخاري 2)', est_correcte: false },
      { texte_fr: 'Hadith Jibril (Muslim 8)', texte_ar: 'حديث جبريل (مسلم 8)', est_correcte: false },
      { texte_fr: 'Hadith de A\'isha (Bukhari 5027)', texte_ar: 'حديث عائشة (بخاري 5027)', est_correcte: false },
    ],
  },
  // ============================================================
  // SIRAH
  // ============================================================
  {
    domaine: 'sirah',
    sous_domaine: 'hijra',
    niveau: 1,
    madhab: 'general',
    texte_fr: 'En quelle année le Prophète Muhammad ﷺ a-t-il effectué la Hijra (migration) vers Médine ?',
    texte_ar: 'في أي سنة هاجر النبي محمد ﷺ إلى المدينة المنورة؟',
    explication: 'La Hijra eut lieu en l\'an 622 apr. J.-C., correspondant à l\'an 1 de l\'Hégire. Elle marque le début du calendrier islamique.',
    reponses: [
      { texte_fr: '622 apr. J.-C. (1 Hégire)', texte_ar: '622م (1هـ)', est_correcte: true },
      { texte_fr: '610 apr. J.-C.', texte_ar: '610م', est_correcte: false },
      { texte_fr: '630 apr. J.-C.', texte_ar: '630م', est_correcte: false },
      { texte_fr: '615 apr. J.-C.', texte_ar: '615م', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah',
    sous_domaine: 'enfance',
    niveau: 1,
    madhab: 'general',
    texte_fr: 'Quel était le nom de la nourrice du Prophète Muhammad ﷺ qui l\'allaita durant son enfance ?',
    texte_ar: 'ما اسم المرضعة التي أرضعت النبي محمد ﷺ في طفولته؟',
    explication: 'Halima As-Sa\'diyya, de la tribu des Banu Sa\'d, fut la nourrice du Prophète ﷺ. Il vécut chez elle dans la région de Taïf jusqu\'à l\'âge de 4-5 ans.',
    reponses: [
      { texte_fr: 'Halima As-Sa\'diyya', texte_ar: 'حليمة السعدية', est_correcte: true },
      { texte_fr: 'Khadija bint Khuwaylid', texte_ar: 'خديجة بنت خويلد', est_correcte: false },
      { texte_fr: 'Sumayyah bint Khayyat', texte_ar: 'سمية بنت خياط', est_correcte: false },
      { texte_fr: 'Aminah bint Wahb', texte_ar: 'آمنة بنت وهب', est_correcte: false },
    ],
  },
  // ============================================================
  // QURAN / TAFSIR
  // ============================================================
  {
    domaine: 'tafsir',
    sous_domaine: 'generale',
    niveau: 1,
    madhab: 'general',
    texte_fr: 'Combien de sourates (chapitres) compte le Saint Coran ?',
    texte_ar: 'كم عدد سور القرآن الكريم؟',
    reponses: [
      { texte_fr: '114 sourates', texte_ar: '١١٤ سورة', est_correcte: true },
      { texte_fr: '112 sourates', texte_ar: '١١٢ سورة', est_correcte: false },
      { texte_fr: '120 sourates', texte_ar: '١٢٠ سورة', est_correcte: false },
      { texte_fr: '99 sourates', texte_ar: '٩٩ سورة', est_correcte: false },
    ],
  },
  {
    domaine: 'tafsir',
    sous_domaine: 'generale',
    niveau: 1,
    madhab: 'general',
    texte_fr: 'Quelle est la plus longue sourate du Coran ?',
    texte_ar: 'ما هي أطول سورة في القرآن الكريم؟',
    explication: 'Sourate Al-Baqara (La Vache) est la plus longue avec 286 versets. Elle est précédée par Al-Baqara en longueur par An-Nisa (176v) et Al-Imran (200v).',
    reponses: [
      { texte_fr: 'Al-Baqara (Sourate 2)', texte_ar: 'سورة البقرة', est_correcte: true },
      { texte_fr: 'An-Nisa (Sourate 4)', texte_ar: 'سورة النساء', est_correcte: false },
      { texte_fr: 'Al-Imran (Sourate 3)', texte_ar: 'سورة آل عمران', est_correcte: false },
      { texte_fr: 'Al-Ma\'ida (Sourate 5)', texte_ar: 'سورة المائدة', est_correcte: false },
    ],
  },
  // ============================================================
  // AKHLAQ
  // ============================================================
  {
    domaine: 'akhlaq',
    sous_domaine: 'moeurs',
    niveau: 1,
    madhab: 'general',
    texte_fr: 'Selon le hadith authentique, lequel de ces comportements est catégoriquement interdit entre musulmans ?',
    texte_ar: 'حسب الحديث الصحيح، أي من هذه التصرفات محرم بين المسلمين؟',
    dalil_ref: 'Sourate Al-Hujurat 49:12',
    dalil_texte_ar: 'وَلَا يَغْتَب بَّعْضُكُم بَعْضًا ۚ أَيُحِبُّ أَحَدُكُمْ أَن يَأْكُلَ لَحْمَ أَخِيهِ مَيْتًا فَكَرِهْتُمُوهُ',
    dalil_texte_fr: 'Ne médisez pas les uns des autres. L\'un de vous aimerait-il manger la chair de son frère mort ? Non, vous en auriez horreur.',
    explication: 'La Ghibah (médisance) consiste à parler de son frère en son absence d\'une façon qui lui déplairait, même si c\'est vrai. C\'est un grand péché comparé dans le Coran à manger la chair d\'un cadavre.',
    reponses: [
      { texte_fr: 'La Ghibah (médisance)', texte_ar: 'الغيبة', est_correcte: true },
      { texte_fr: 'La Shura (consultation)', texte_ar: 'الشورى', est_correcte: false },
      { texte_fr: 'La Nasihah (conseil sincère)', texte_ar: 'النصيحة', est_correcte: false },
      { texte_fr: 'L\'Amr bil Ma\'ruf (enjoindre le bien)', texte_ar: 'الأمر بالمعروف', est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq',
    sous_domaine: 'excellence',
    niveau: 1,
    madhab: 'general',
    texte_fr: 'Le Prophète ﷺ a dit : "Le meilleur d\'entre vous est celui qui..." (complétez)',
    texte_ar: 'قال النبي ﷺ: "خيركم من..." (أكمل)',
    dalil_ref: 'Sahih Bukhari 5027',
    dalil_texte_ar: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    explication: 'Ce hadith de Uthman ibn Affan (ra) rapporté par Al-Bukhari (5027) enseigne l\'importance d\'apprendre le Coran et de l\'enseigner aux autres.',
    grade_hadith: 'Sahih',
    reponses: [
      { texte_fr: '"...apprend le Coran et l\'enseigne"', texte_ar: 'تعلّم القرآن وعلّمه', est_correcte: true },
      { texte_fr: '"...prie le plus"', texte_ar: 'أكثركم صلاة', est_correcte: false },
      { texte_fr: '"...jeûne le plus"', texte_ar: 'أكثركم صياماً', est_correcte: false },
      { texte_fr: '"...donne le plus en charité"', texte_ar: 'أكثركم صدقة', est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq',
    sous_domaine: 'adab',
    niveau: 2,
    madhab: 'general',
    texte_fr: 'Selon le hadith, combien de fois doit-on demander la permission avant d\'entrer chez quelqu\'un ?',
    texte_ar: 'حسب الحديث، كم مرة يجب طلب الإذن قبل الدخول على شخص ما؟',
    dalil_ref: 'Sahih Abu Dawud 5185',
    dalil_texte_ar: 'الاستئذان ثلاث، فإن أُذن لك وإلا فارجع',
    explication: 'On demande la permission 3 fois : si on vous l\'accorde, entrez ; sinon, repartez. C\'est la Sunna du Prophète ﷺ.',
    grade_hadith: 'Sahih',
    reponses: [
      { texte_fr: '3 fois', texte_ar: 'ثلاث مرات', est_correcte: true },
      { texte_fr: '1 fois', texte_ar: 'مرة واحدة', est_correcte: false },
      { texte_fr: '2 fois', texte_ar: 'مرتان', est_correcte: false },
      { texte_fr: '7 fois', texte_ar: 'سبع مرات', est_correcte: false },
    ],
  },
  // ============================================================
  // ADVANCED QUESTIONS (niveaux 4-5)
  // ============================================================
  {
    domaine: 'fiqh',
    sous_domaine: 'mirath',
    niveau: 4,
    madhab: 'general',
    texte_fr: 'En droit successoral islamique (\'Ilm Al-Faraid), quelle est la part d\'héritage d\'une fille unique ?',
    texte_ar: 'في علم الفرائض، ما هو نصيب البنت الواحدة من الميراث؟',
    dalil_ref: 'Sourate An-Nisa 4:11',
    dalil_texte_ar: 'وَإِن كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ',
    dalil_texte_fr: 'Et s\'il n\'y a qu\'une seule fille, elle aura la moitié.',
    explication: 'La fille unique hérite de la moitié (1/2) de la succession selon le Coran (4:11). Si elles sont deux ou plus, elles héritent des deux tiers (2/3).',
    reponses: [
      { texte_fr: 'La moitié (1/2)', texte_ar: 'النصف (1/2)', est_correcte: true },
      { texte_fr: 'Le quart (1/4)', texte_ar: 'الربع (1/4)', est_correcte: false },
      { texte_fr: 'Les deux tiers (2/3)', texte_ar: 'الثلثان (2/3)', est_correcte: false },
      { texte_fr: 'Le tiers (1/3)', texte_ar: 'الثلث (1/3)', est_correcte: false },
    ],
  },
  {
    domaine: 'hadith',
    sous_domaine: 'ulum_hadith',
    niveau: 5,
    madhab: 'general',
    texte_fr: 'En terminologie des sciences du Hadith (\'Ulum Al-Hadith), qu\'est-ce qu\'un hadith "Mutawatir" ?',
    texte_ar: 'في مصطلح علم الحديث، ما هو الحديث المتواتر؟',
    explication: 'Le hadith Mutawatir est celui rapporté par un grand nombre de narrateurs à chaque génération (généralement 10 ou plus), rendant impossible qu\'ils se soient tous mis d\'accord pour mentir. Il produit une certitude absolue (yaqin).',
    savant_reference: 'Al-Nukhba d\'Ibn Hajar Al-Asqalani',
    reponses: [
      { texte_fr: 'Hadith rapporté par un grand nombre de narrateurs à chaque époque', texte_ar: 'ما رواه عدد كثير في كل طبقة يمتنع تواطؤهم على الكذب', est_correcte: true },
      { texte_fr: 'Hadith avec une seule chaîne de transmission', texte_ar: 'ما رُوي بإسناد واحد', est_correcte: false },
      { texte_fr: 'Hadith rapporté par seulement deux narrateurs', texte_ar: 'ما رواه اثنان فقط', est_correcte: false },
      { texte_fr: 'Hadith dont le texte est interrompu', texte_ar: 'الحديث الذي انقطع متنه', est_correcte: false },
    ],
  },
  {
    domaine: 'tafsir',
    sous_domaine: 'ahkam',
    niveau: 4,
    madhab: 'general',
    texte_fr: 'La règle juridique fondamentale tirée du verset "وَلَا تَقْرَبُوا الزِّنَا" (Al-Isra 17:32) est :',
    texte_ar: 'القاعدة الفقهية المستنبطة من قوله تعالى "وَلَا تَقْرَبُوا الزِّنَا":',
    dalil_ref: 'Sourate Al-Isra 17:32',
    dalil_texte_ar: 'وَلَا تَقْرَبُوا الزِّنَا ۖ إِنَّهُ كَانَ فَاحِشَةً وَسَاءَ سَبِيلًا',
    dalil_texte_fr: 'N\'approchez pas de la fornication, c\'est vraiment une turpitude et une mauvaise voie.',
    explication: 'Le verset dit "n\'approchez pas" et non pas seulement "ne faites pas". Cela implique l\'interdiction de tout ce qui mène au péché (Sadd Ad-Dhara\'i\'), comme la khalwa (isolement) avec une personne du sexe opposé non-mahram.',
    reponses: [
      { texte_fr: 'Interdiction de tout ce qui mène à la fornication (Sadd Ad-Dhara\'i\')', texte_ar: 'تحريم كل ما يؤدي إلى الزنا (سد الذرائع)', est_correcte: true },
      { texte_fr: 'Seulement l\'interdiction de l\'acte lui-même', texte_ar: 'تحريم الفعل ذاته فقط', est_correcte: false },
      { texte_fr: 'Recommandation de se marier rapidement', texte_ar: 'استحباب التزويج بسرعة', est_correcte: false },
      { texte_fr: 'Obligation du voile pour les femmes', texte_ar: 'وجوب الحجاب على النساء', est_correcte: false },
    ],
  },
  {
    domaine: 'aqida',
    sous_domaine: 'qadar',
    niveau: 4,
    madhab: 'general',
    texte_fr: 'Quels sont les 4 degrés (marâtib) du Qadar (le Destin) selon Ahlu Sunna ?',
    texte_ar: 'ما هي مراتب القدر الأربعة عند أهل السنة؟',
    explication: 'Les 4 degrés du Qadar : 1) Al-\'Ilm (La Connaissance divine de tout), 2) Al-Kitaba (L\'inscription dans Al-Lawh Al-Mahfuz), 3) Al-Mashi\'a (La Volonté divine), 4) Al-Khalq (La Création de toute chose).',
    savant_reference: 'Ibn Abi Al-\'Izz Al-Hanafi - Sharh Al-Aqida At-Tahawiyya',
    reponses: [
      { texte_fr: '\'Ilm, Kitaba, Mashi\'a, Khalq', texte_ar: 'العلم والكتابة والمشيئة والخلق', est_correcte: true },
      { texte_fr: 'Iman, Islam, Ihsan, Tawakkal', texte_ar: 'الإيمان والإسلام والإحسان والتوكل', est_correcte: false },
      { texte_fr: 'Tawba, Istighfar, Du\'a, Sabr', texte_ar: 'التوبة والاستغفار والدعاء والصبر', est_correcte: false },
      { texte_fr: 'Salat, Zakat, Sawm, Hajj', texte_ar: 'الصلاة والزكاة والصيام والحج', est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh',
    sous_domaine: 'mualmalat',
    niveau: 5,
    madhab: 'general',
    texte_fr: 'En Fiqh des transactions (Mu\'amalat), quelle est la règle fondamentale concernant les contrats ?',
    texte_ar: 'في فقه المعاملات، ما هي القاعدة الأصلية في العقود؟',
    explication: 'La règle fondamentale en fiqh des transactions est que tout est permis (Ibaha) sauf ce que la Shari\'a a explicitement interdit. C\'est l\'opposé de la règle en matière d\'adoration (\'Ibadat) où rien n\'est permis sauf ce que la Shari\'a a ordonné.',
    savant_reference: 'Ibn Taymiyya, Al-Qawa\'id An-Nuraniyya',
    reponses: [
      { texte_fr: 'Tout est permis sauf ce qui est explicitement interdit', texte_ar: 'الأصل في العقود الإباحة إلا ما دل الدليل على تحريمه', est_correcte: true },
      { texte_fr: 'Tout est interdit sauf ce qui est explicitement permis', texte_ar: 'الأصل في العقود الحرمة إلا ما دل الدليل على إباحته', est_correcte: false },
      { texte_fr: 'Les contrats sont tous Makruh (déconseillés)', texte_ar: 'الأصل في العقود الكراهة', est_correcte: false },
      { texte_fr: 'Chaque contrat nécessite une preuve explicite de Coran ou Sunna', texte_ar: 'كل عقد يحتاج نصاً صريحاً من الكتاب والسنة', est_correcte: false },
    ],
  },
];

export async function seedQuestions(client: Client): Promise<void> {
  let count = 0;

  for (const q of QUESTIONS) {
    const qResult = await client.query(
      `INSERT INTO questions (domaine, sous_domaine, niveau, madhab, texte_fr, texte_ar, dalil_ref, dalil_texte_ar, dalil_texte_fr, explication, savant_reference, grade_hadith)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        q.domaine, q.sous_domaine, q.niveau, q.madhab,
        q.texte_fr, q.texte_ar, q.dalil_ref,
        q.dalil_texte_ar, q.dalil_texte_fr,
        q.explication, q.savant_reference, q.grade_hadith,
      ]
    );

    const question_id = qResult.rows[0].id;

    for (const r of q.reponses) {
      await client.query(
        'INSERT INTO reponses (question_id, texte_fr, texte_ar, est_correcte) VALUES ($1, $2, $3, $4)',
        [question_id, r.texte_fr, r.texte_ar, r.est_correcte]
      );
    }

    count++;
  }

  console.log(`Seeded ${count} questions.`);
}
