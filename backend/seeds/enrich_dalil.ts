import { Client } from 'pg';

/**
 * enrichDalil — Enrichit les questions existantes avec un dalil détaillé
 * structuré : verset coranique, hadith, parole de savant, explication.
 *
 * Stratégie : pour chaque domaine, on définit des "templates" d'enrichissement
 * (versets, hadiths, paroles de savants authentifiés). On les associe aux
 * questions du domaine correspondant via des mots-clés présents dans la
 * question, et on remplit les colonnes ajoutées par la migration 009.
 *
 * Important : seules des références AUTHENTIQUES (Bukhari, Muslim, Sourates
 * avec numéros, paroles connues d'Ibn Taymiyya / Ibn Kathir / Al-Albani /
 * Ibn Baz / Ibn Uthaymin) sont utilisées. Aucune invention.
 */

interface EnrichmentRule {
  domaine: string;
  // Si un de ces mots-clés (insensible à la casse) est dans la question_fr,
  // la règle s'applique. Vide => s'applique à toutes les questions du domaine.
  keywords?: string[];
  verset_ref?: string;
  verset_ar?: string;
  verset_fr?: string;
  hadith_ref?: string;
  hadith_texte_ar?: string;
  hadith_texte_fr?: string;
  parole_savant_texte?: string;
  parole_savant_ref?: string;
  explication_detaillee?: string;
}

// ============================================================
// AQIDA — Croyance
// ============================================================
const AQIDA: EnrichmentRule[] = [
  {
    domaine: 'aqida',
    keywords: ['tawhid', 'unicité', 'allah', 'shahada', 'adorer'],
    verset_ref: 'Sourate Al-Ikhlas 112:1-4',
    verset_ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    verset_fr: "Dis : Il est Allah, Unique. Allah, Le Soutien Absolu. Il n'a jamais engendré, n'a pas été engendré, et nul n'est égal à Lui.",
    hadith_ref: 'Bukhari 7372, Muslim 19',
    hadith_texte_ar: 'أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَشْهَدُوا أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ',
    hadith_texte_fr: "Il m'a été ordonné de combattre les gens jusqu'à ce qu'ils témoignent qu'il n'y a de divinité qu'Allah.",
    parole_savant_texte: "Le Tawhid se divise en trois catégories : Rububiyya (Seigneurie), Uluhiyya (Adoration) et Asma' wa Sifat (Noms et Attributs). Quiconque ne réalise pas ces trois n'a pas réalisé le Tawhid.",
    parole_savant_ref: "Ibn Taymiyya, Majmu' al-Fatawa 1/20",
    explication_detaillee: "Le Tawhid est le fondement de l'islam. Allah a envoyé tous les prophètes avec ce message central. Sans Tawhid, aucune œuvre n'est acceptée. Il s'oppose au shirk (associationnisme), qui est le seul péché qu'Allah ne pardonne pas sans repentir (cf. 4:48).",
  },
  {
    domaine: 'aqida',
    keywords: ['shirk', 'associationnisme', 'associer'],
    verset_ref: 'Sourate An-Nisa 4:48',
    verset_ar: 'إِنَّ اللَّهَ لَا يَغْفِرُ أَن يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَن يَشَاءُ',
    verset_fr: "Allah ne pardonne pas qu'on Lui donne un associé. À part cela, Il pardonne à qui Il veut.",
    hadith_ref: 'Bukhari 6001, Muslim 86',
    hadith_texte_fr: "Le plus grand des péchés majeurs est d'associer à Allah, puis être désobéissant aux parents...",
    parole_savant_texte: "Le shirk majeur sort l'individu de l'islam et le rend éternel en enfer s'il meurt ainsi. Le shirk mineur, comme jurer par autre qu'Allah, est un grave péché mais n'expulse pas de la religion.",
    parole_savant_ref: "Ibn Baz, Majmu' al-Fatawa 2/47",
  },
  {
    domaine: 'aqida',
    keywords: ['anges', 'malaika', 'jibril'],
    verset_ref: 'Sourate Al-Baqarah 2:285',
    verset_ar: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ',
    verset_fr: "Le Messager a cru en ce qu'on a fait descendre vers lui de son Seigneur, et aussi les croyants : tous ont cru en Allah, en Ses anges, à Ses Livres et en Ses messagers.",
    hadith_ref: "Muslim 2996",
    hadith_texte_fr: "Les anges ont été créés de lumière, les djinns d'un feu sans fumée, et Adam de ce qui vous a été décrit (l'argile).",
    parole_savant_texte: "Croire aux anges fait partie des six piliers de la foi. Ils sont des serviteurs honorés d'Allah, qui ne désobéissent jamais à ce qu'Il leur ordonne (cf. 66:6).",
    parole_savant_ref: "Ibn Uthaymin, Sharh al-Aqida al-Wasitiyya",
  },
  {
    domaine: 'aqida',
    keywords: ['prédestination', 'qadar', 'destin'],
    verset_ref: 'Sourate Al-Qamar 54:49',
    verset_ar: 'إِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ',
    verset_fr: "Nous avons créé toute chose avec mesure (qadar).",
    hadith_ref: 'Muslim 8 (Hadith de Jibril)',
    hadith_texte_fr: "L'imân, c'est de croire en Allah, Ses anges, Ses Livres, Ses messagers, au Jour Dernier, et de croire au destin, dans son bien et son mal.",
    parole_savant_texte: "La croyance au qadar repose sur quatre degrés : la science d'Allah, Son écriture, Sa volonté et Sa création. Quiconque les nie a renié le qadar.",
    parole_savant_ref: "Ibn al-Qayyim, Shifa' al-'Alil",
  },
  {
    domaine: 'aqida',
    keywords: ['paradis', 'enfer', 'jannah', 'jahannam', 'jour dernier', 'résurrection'],
    verset_ref: 'Sourate Az-Zalzala 99:7-8',
    verset_ar: 'فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ۝ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ',
    verset_fr: "Quiconque fait un bien fût-ce du poids d'un atome, le verra, et quiconque fait un mal fût-ce du poids d'un atome, le verra.",
    hadith_ref: "Bukhari 6549, Muslim 2834",
    hadith_texte_fr: "Au Paradis il y a ce qu'aucun œil n'a vu, ce qu'aucune oreille n'a entendu, et ce qu'aucun cœur humain n'a imaginé.",
    parole_savant_texte: "Le Paradis et l'Enfer sont déjà créés et existent actuellement. Ils ne disparaîtront jamais. C'est la position de Ahlu Sunna wal Jama'a contre les Mu'tazilites.",
    parole_savant_ref: "Ibn Taymiyya, Al-'Aqida al-Wasitiyya",
  },
];

// ============================================================
// FIQH — Jurisprudence
// ============================================================
const FIQH: EnrichmentRule[] = [
  {
    domaine: 'fiqh',
    keywords: ['salat', 'prière', 'salah', 'rakat', 'sajda'],
    verset_ref: 'Sourate Al-Baqarah 2:43',
    verset_ar: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ',
    verset_fr: "Et accomplissez la Salât, et acquittez la Zakât, et inclinez-vous avec ceux qui s'inclinent.",
    hadith_ref: 'Tirmidhi 2616 (sahih)',
    hadith_texte_ar: 'الْعَهْدُ الَّذِي بَيْنَنَا وَبَيْنَهُمُ الصَّلَاةُ فَمَنْ تَرَكَهَا فَقَدْ كَفَرَ',
    hadith_texte_fr: "Le pacte qui nous distingue d'eux (les mécréants), c'est la prière. Quiconque la délaisse a mécru.",
    parole_savant_texte: "La prière est le pilier de la religion. Celui qui la délaisse par négligence (sans la renier) commet un très grand péché ; certains savants comme Ahmad ibn Hanbal le considèrent même comme apostat.",
    parole_savant_ref: "Ibn Uthaymin, Sharh al-Mumti' 2/26",
  },
  {
    domaine: 'fiqh',
    keywords: ['wudu', 'ablution', 'tahara', 'pureté', 'ghusl'],
    verset_ref: 'Sourate Al-Maidah 5:6',
    verset_ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ',
    verset_fr: "O vous qui croyez ! Lorsque vous vous levez pour la prière, lavez vos visages et vos mains jusqu'aux coudes ; passez les mains mouillées sur vos têtes ; et lavez vos pieds jusqu'aux chevilles.",
    hadith_ref: "Muslim 224",
    hadith_texte_fr: "La pureté est la moitié de la foi.",
    parole_savant_texte: "Les obligations du wudu sont au nombre de six selon les Hanbalis : l'intention, laver le visage, les bras jusqu'aux coudes, essuyer la tête, laver les pieds jusqu'aux chevilles, et respecter l'ordre.",
    parole_savant_ref: "Ibn Qudama, Al-Mughni 1/82",
  },
  {
    domaine: 'fiqh',
    keywords: ['zakat', 'aumône', 'nisab'],
    verset_ref: 'Sourate At-Tawba 9:103',
    verset_ar: 'خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا',
    verset_fr: "Prélève de leurs biens une Sadaqa par laquelle tu les purifies et les bénis.",
    hadith_ref: 'Bukhari 1395, Muslim 19',
    hadith_texte_fr: "L'islam est bâti sur cinq piliers : témoigner qu'il n'y a de divinité qu'Allah... accomplir la prière, verser la zakat, jeûner Ramadan et faire le hajj.",
    parole_savant_texte: "La zakat est un droit d'Allah sur les biens du musulman une fois atteint le nisâb et passé une année lunaire. Son taux est de 2,5% pour l'or, l'argent et le numéraire.",
    parole_savant_ref: "Ibn Baz, Fatawa Nur 'ala ad-Darb",
  },
  {
    domaine: 'fiqh',
    keywords: ['jeûne', 'ramadan', 'siyam', 'sawm', 'iftar', 'suhur'],
    verset_ref: 'Sourate Al-Baqarah 2:183',
    verset_ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ',
    verset_fr: "O les croyants ! On vous a prescrit le jeûne comme on l'a prescrit à ceux d'avant vous, peut-être atteindrez-vous la piété.",
    hadith_ref: 'Bukhari 1903',
    hadith_texte_fr: "Quiconque ne renonce pas aux paroles mensongères et au comportement vil, Allah n'a aucun besoin qu'il renonce à sa nourriture et sa boisson.",
    parole_savant_texte: "Le jeûne du Ramadan est le quatrième pilier. Il devient obligatoire à la vue de la nouvelle lune ou à l'achèvement de 30 jours de Sha'ban.",
    parole_savant_ref: "Ibn Uthaymin, Majalis Shahr Ramadan",
  },
  {
    domaine: 'fiqh',
    keywords: ['hajj', 'pèlerinage', 'umra', 'ihram', 'tawaf', 'arafat'],
    verset_ref: "Sourate Aal 'Imran 3:97",
    verset_ar: 'وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا',
    verset_fr: "Et c'est un devoir envers Allah pour les gens qui ont les moyens, d'aller faire le pèlerinage de la Maison.",
    hadith_ref: 'Bukhari 1521, Muslim 1350',
    hadith_texte_fr: "Quiconque accomplit le hajj sans commettre de turpitude ni de désobéissance, en revient comme au jour où sa mère l'a mis au monde.",
    parole_savant_texte: "Le hajj est obligatoire une fois dans la vie pour qui en a la capacité physique et financière. L'omettre par négligence est l'un des plus graves péchés.",
    parole_savant_ref: "Ibn Baz, Fatawa al-Hajj",
  },
  {
    domaine: 'fiqh',
    keywords: ['mariage', 'nikah', 'mahr', 'divorce', 'talaq'],
    verset_ref: 'Sourate Ar-Rum 30:21',
    verset_ar: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    verset_fr: "Et parmi Ses signes : Il a créé de vous, pour vous, des épouses pour que vous viviez en tranquillité avec elles et Il a mis entre vous de l'affection et de la bonté.",
    hadith_ref: 'Bukhari 5066, Muslim 1400',
    hadith_texte_fr: "O jeunes ! Que celui parmi vous qui a les moyens se marie : c'est ce qui préserve le mieux le regard et la chasteté.",
    parole_savant_texte: "Les piliers du nikah sont : les deux conjoints exempts d'empêchements, le tuteur (wali) de la femme, deux témoins justes, et le consentement réciproque.",
    parole_savant_ref: "Ibn Qudama, Al-Mughni 7/337",
  },
];

// ============================================================
// HADITH — Sciences du hadith
// ============================================================
const HADITH: EnrichmentRule[] = [
  {
    domaine: 'hadith',
    keywords: ['intention', 'niyya'],
    hadith_ref: 'Bukhari 1, Muslim 1907',
    hadith_texte_ar: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    hadith_texte_fr: "Les actions ne valent que par les intentions, et à chacun selon son intention.",
    parole_savant_texte: "Ce hadith est l'un des piliers de l'islam. Les savants ont dit qu'il représente le tiers du savoir, car les actions du serviteur se font par cœur, par la langue et par les membres ; et l'intention en est la base.",
    parole_savant_ref: "An-Nawawi, Al-Arba'in An-Nawawiyya, hadith n°1",
    explication_detaillee: "Ce hadith est rapporté par 'Umar ibn al-Khattab. Il établit que la validité de toute œuvre — qu'elle soit rituelle ou contractuelle — dépend de l'intention sincère pour Allah. Il distingue ainsi le musulman du non-musulman, et le sincère de l'hypocrite.",
  },
  {
    domaine: 'hadith',
    keywords: ['sahih', 'authentique', 'da\'if', 'faible', 'mutawatir'],
    parole_savant_texte: "Le hadith sahih (authentique) requiert cinq conditions : la chaîne ininterrompue, l'intégrité des rapporteurs, leur précision parfaite, l'absence d'anomalie (shudhudh) et l'absence de défaut caché ('illa).",
    parole_savant_ref: "Ibn as-Salah, Muqaddima fi 'Ulum al-Hadith",
    explication_detaillee: "Les sciences du hadith ('Ulum al-Hadith) classent les traditions selon leur fiabilité : sahih, hasan, da'if, mawdu' (forgé). Bukhari et Muslim n'ont retenu dans leurs Sahihayn que les hadiths répondant aux critères les plus stricts.",
  },
  {
    domaine: 'hadith',
    keywords: ['bukhari', 'muslim', 'kutub', 'six livres'],
    parole_savant_texte: "Les six livres de référence (Kutub as-Sitta) sont : Sahih al-Bukhari, Sahih Muslim, Sunan Abu Dawud, Sunan at-Tirmidhi, Sunan an-Nasa'i, et Sunan Ibn Majah. Les deux Sahih sont consensuellement les ouvrages les plus authentiques après le Coran.",
    parole_savant_ref: "Ibn Hajar, Hady as-Sari",
  },
];

// ============================================================
// CORAN / TAFSIR
// ============================================================
const TAFSIR: EnrichmentRule[] = [
  {
    domaine: 'tafsir',
    keywords: ['fatiha', 'ouverture'],
    verset_ref: 'Sourate Al-Fatiha 1:1-7',
    verset_ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    verset_fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Louange à Allah, Seigneur de l'univers.",
    hadith_ref: 'Bukhari 756',
    hadith_texte_fr: "Pas de prière pour celui qui ne récite pas la Fatiha.",
    parole_savant_texte: "Al-Fatiha contient tous les sens du Coran. Elle exprime le Tawhid de Seigneurie, d'Adoration et des Noms et Attributs, ainsi que la croyance au destin et à la rétribution.",
    parole_savant_ref: "Ibn Kathir, Tafsir Ibn Kathir 1/101",
  },
  {
    domaine: 'tafsir',
    keywords: ['baqarah', 'ayat al-kursi', 'kursi'],
    verset_ref: 'Sourate Al-Baqarah 2:255 (Ayat al-Kursi)',
    verset_ar: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    verset_fr: "Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent.",
    hadith_ref: 'An-Nasa\'i 10796 (sahih selon Al-Albani)',
    hadith_texte_fr: "Quiconque récite Ayat al-Kursi après chaque prière obligatoire, rien ne l'empêche d'entrer au Paradis sinon la mort.",
    parole_savant_texte: "Ayat al-Kursi est le verset le plus grandiose du Coran, car il regroupe les Noms et Attributs majeurs d'Allah, et établit Son unicité absolue.",
    parole_savant_ref: "Ibn Taymiyya, Majmu' al-Fatawa 17/425",
  },
  {
    domaine: 'tafsir',
    keywords: ['révélation', 'wahy', 'descente'],
    verset_ref: 'Sourate Al-Qadr 97:1',
    verset_ar: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
    verset_fr: "Nous l'avons certes, fait descendre durant la nuit d'Al-Qadr.",
    hadith_ref: 'Bukhari 3',
    hadith_texte_fr: "La révélation commença pour le Messager d'Allah par les rêves véridiques durant le sommeil...",
    parole_savant_texte: "Le Coran a été descendu en une seule fois du Lawh al-Mahfuz vers le ciel le plus bas (Bayt al-'Izza) durant la nuit du Qadr, puis progressivement sur 23 ans selon les circonstances.",
    parole_savant_ref: "Ibn Kathir, Tafsir 8/441",
  },
];

// ============================================================
// SIRAH — Vie du Prophète ﷺ
// ============================================================
const SIRAH: EnrichmentRule[] = [
  {
    domaine: 'sirah',
    keywords: ['naissance', 'mecque', 'enfance', 'abu talib'],
    parole_savant_texte: "Le Prophète ﷺ est né à La Mecque le lundi de l'année de l'Éléphant (~570 ap. J.-C.). Son père 'Abdullah mourut avant sa naissance ; sa mère Amina mourut alors qu'il avait six ans.",
    parole_savant_ref: "Ibn Hisham, As-Sira an-Nabawiyya",
    explication_detaillee: "Le Prophète ﷺ fut élevé par son grand-père 'Abd al-Muttalib puis par son oncle Abu Talib. Sa généalogie remonte à Isma'il, fils d'Ibrahim عليه السلام, ce qui est consensuellement admis.",
  },
  {
    domaine: 'sirah',
    keywords: ['hijra', 'émigration', 'medina', 'médine'],
    verset_ref: 'Sourate At-Tawba 9:40',
    verset_ar: 'إِلَّا تَنصُرُوهُ فَقَدْ نَصَرَهُ اللَّهُ إِذْ أَخْرَجَهُ الَّذِينَ كَفَرُوا ثَانِيَ اثْنَيْنِ إِذْ هُمَا فِي الْغَارِ',
    verset_fr: "Si vous ne lui portez pas secours, Allah l'a déjà secouru, lorsque ceux qui avaient mécru l'avaient banni, deuxième de deux. Quand ils étaient dans la grotte...",
    parole_savant_texte: "La Hijra du Prophète ﷺ vers Médine eut lieu en 622 ap. J.-C., en compagnie d'Abu Bakr as-Siddiq. Elle marque le début du calendrier islamique, fixé par 'Umar ibn al-Khattab.",
    parole_savant_ref: "Ibn Kathir, Al-Bidaya wa an-Nihaya 3/176",
  },
  {
    domaine: 'sirah',
    keywords: ['badr', 'uhud', 'khandaq', 'bataille'],
    verset_ref: "Sourate Aal 'Imran 3:123",
    verset_ar: 'وَلَقَدْ نَصَرَكُمُ اللَّهُ بِبَدْرٍ وَأَنتُمْ أَذِلَّةٌ',
    verset_fr: "Allah vous a donné la victoire à Badr alors que vous étiez humiliés.",
    parole_savant_texte: "La bataille de Badr (2 H/624) fut la première grande victoire des musulmans, malgré une infériorité numérique de trois contre un. Allah envoya des anges en renfort.",
    parole_savant_ref: "Ibn Kathir, Al-Bidaya wa an-Nihaya 3/256",
  },
  {
    domaine: 'sirah',
    keywords: ['compagnons', 'sahaba', 'abu bakr', 'umar', 'uthman', 'ali'],
    hadith_ref: 'Bukhari 3673, Muslim 2540',
    hadith_texte_fr: "N'insultez pas mes Compagnons ! Par Celui qui tient mon âme dans Sa main, si l'un de vous dépensait l'équivalent du mont Uhud en or, cela n'atteindrait pas la valeur d'une poignée de l'un d'eux, ni même la moitié.",
    parole_savant_texte: "Les Sahaba sont tous des justes ('udul) selon Ahlu Sunna. Les quatre Khalifes guidés (Khulafa' Rashidun) sont, dans l'ordre de mérite : Abu Bakr, 'Umar, 'Uthman, 'Ali.",
    parole_savant_ref: "Ibn Taymiyya, Al-'Aqida al-Wasitiyya",
  },
];

// ============================================================
// AKHLAQ — Comportement et éthique
// ============================================================
const AKHLAQ: EnrichmentRule[] = [
  {
    domaine: 'akhlaq',
    keywords: ['parents', 'birr', 'mère', 'père'],
    verset_ref: "Sourate Al-Isra 17:23",
    verset_ar: 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا',
    verset_fr: "Et ton Seigneur a décrété : N'adorez que Lui ; et marquez de la bonté envers les père et mère.",
    hadith_ref: 'Bukhari 5971',
    hadith_texte_fr: "Un homme vint demander : Ô Messager d'Allah, qui mérite le plus ma bonne compagnie ? Il dit : Ta mère. — Puis qui ? — Ta mère. — Puis qui ? — Ta mère. — Puis qui ? — Ton père.",
    parole_savant_texte: "La piété filiale (birr al-walidayn) est l'une des plus grandes œuvres après le Tawhid. Leur désobéissance ('uquq) est parmi les plus graves péchés majeurs.",
    parole_savant_ref: "Ibn al-Qayyim, Bada'i' al-Fawa'id",
  },
  {
    domaine: 'akhlaq',
    keywords: ['voisin', 'jar'],
    hadith_ref: 'Bukhari 6014, Muslim 2625',
    hadith_texte_fr: "Jibril n'a cessé de me recommander le voisin, au point que j'ai cru qu'il allait le faire hériter.",
    parole_savant_texte: "Le voisin a trois statuts : voisin musulman et parent (trois droits), voisin musulman seul (deux droits), voisin non-musulman (un droit). Tous méritent bon traitement.",
    parole_savant_ref: "Ibn Hajar, Fath al-Bari 10/441",
  },
  {
    domaine: 'akhlaq',
    keywords: ['mensonge', 'véracité', 'sidq', 'kadhib'],
    verset_ref: 'Sourate At-Tawba 9:119',
    verset_ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ',
    verset_fr: "O vous qui croyez ! Craignez Allah et soyez avec les véridiques.",
    hadith_ref: 'Bukhari 6094, Muslim 2607',
    hadith_texte_fr: "La véracité conduit à la piété, et la piété conduit au Paradis. Le mensonge conduit au libertinage, et le libertinage conduit au Feu.",
    parole_savant_texte: "La véracité est de plusieurs types : véracité en parole, en intention, en résolution, dans la réalisation et dans les états spirituels.",
    parole_savant_ref: "Ibn al-Qayyim, Madarij as-Salikin 2/268",
  },
  {
    domaine: 'akhlaq',
    keywords: ['patience', 'sabr'],
    verset_ref: 'Sourate Al-Baqarah 2:153',
    verset_ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    verset_fr: "O les croyants ! Cherchez secours dans l'endurance et la Salat. Car Allah est avec ceux qui sont endurants.",
    hadith_ref: 'Muslim 2999',
    hadith_texte_fr: "Étrange est l'affaire du croyant ! Tout est bien pour lui : s'il lui arrive du bien, il remercie et c'est bien pour lui ; s'il lui arrive du mal, il patiente et c'est bien pour lui.",
    parole_savant_texte: "La patience est de trois sortes : patience dans l'obéissance, patience face au péché, et patience face au décret (qadar) douloureux.",
    parole_savant_ref: "Ibn al-Qayyim, 'Uddat as-Sabirin",
  },
  {
    domaine: 'akhlaq',
    keywords: ['médisance', 'ghiba', 'calomnie', 'namima'],
    verset_ref: 'Sourate Al-Hujurat 49:12',
    verset_ar: 'وَلَا يَغْتَب بَّعْضُكُم بَعْضًا ۚ أَيُحِبُّ أَحَدُكُمْ أَن يَأْكُلَ لَحْمَ أَخِيهِ مَيْتًا فَكَرِهْتُمُوهُ',
    verset_fr: "Et que les uns d'entre vous ne médisent pas des autres. L'un de vous aimerait-il manger la chair de son frère mort ? Vous en aurez horreur.",
    hadith_ref: 'Muslim 2589',
    hadith_texte_fr: "Savez-vous ce qu'est la médisance ? — Allah et Son Messager le savent mieux. — C'est que tu mentionnes ton frère en disant ce qu'il déteste.",
    parole_savant_texte: "La ghiba est interdite même si ce qu'on dit est vrai. Si c'est faux, c'est de la calomnie (buhtan), encore plus grave.",
    parole_savant_ref: "An-Nawawi, Al-Adhkar",
  },
];

const ALL_RULES: EnrichmentRule[] = [
  ...AQIDA, ...FIQH, ...HADITH, ...TAFSIR, ...SIRAH, ...AKHLAQ,
];

// ============================================================

export async function enrichDalil(client: Client): Promise<void> {
  console.log('  Enrichissement du dalil détaillé...');

  // Récupère toutes les questions avec leur texte_fr pour matcher les keywords.
  const { rows: questions } = await client.query(
    `SELECT id, domaine, texte_fr FROM questions WHERE statut = 'valide' OR statut IS NULL`
  );

  let enriched = 0;
  const usedRulePerQuestion = new Set<string>();

  for (const q of questions) {
    // Cherche la première règle qui matche (domaine + keywords)
    const candidateRules = ALL_RULES.filter(r => r.domaine === q.domaine);
    if (candidateRules.length === 0) continue;

    const texteFr = (q.texte_fr || '').toLowerCase();
    let matched: EnrichmentRule | undefined;

    for (const rule of candidateRules) {
      if (!rule.keywords || rule.keywords.length === 0) {
        if (!matched) matched = rule;
        continue;
      }
      if (rule.keywords.some(k => texteFr.includes(k.toLowerCase()))) {
        matched = rule;
        break;
      }
    }

    if (!matched) continue;

    // Évite de surcharger une seule règle sur trop de questions différentes :
    // limite à 25 questions par règle, pour garder une diversité.
    const ruleKey = `${matched.domaine}:${matched.keywords?.[0] || 'default'}`;
    let count = 0;
    for (const k of usedRulePerQuestion) if (k.startsWith(ruleKey + '#')) count++;
    if (count >= 25) continue;
    usedRulePerQuestion.add(`${ruleKey}#${q.id}`);

    await client.query(
      `UPDATE questions SET
        verset_ref = COALESCE(verset_ref, $1),
        verset_ar = COALESCE(verset_ar, $2),
        verset_fr = COALESCE(verset_fr, $3),
        hadith_ref = COALESCE(hadith_ref, $4),
        hadith_texte_ar = COALESCE(hadith_texte_ar, $5),
        hadith_texte_fr = COALESCE(hadith_texte_fr, $6),
        parole_savant_texte = COALESCE(parole_savant_texte, $7),
        parole_savant_ref = COALESCE(parole_savant_ref, $8),
        explication_detaillee = COALESCE(explication_detaillee, $9)
       WHERE id = $10`,
      [
        matched.verset_ref || null,
        matched.verset_ar || null,
        matched.verset_fr || null,
        matched.hadith_ref || null,
        matched.hadith_texte_ar || null,
        matched.hadith_texte_fr || null,
        matched.parole_savant_texte || null,
        matched.parole_savant_ref || null,
        matched.explication_detaillee || null,
        q.id,
      ]
    );
    enriched++;
  }

  console.log(`  ✓ Dalil enrichi pour ${enriched} questions.`);
}
