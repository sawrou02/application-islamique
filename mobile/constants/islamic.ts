export const LEVELS = [
  { id: 1, name: "Mubtadi'", nameAr: 'مبتدئ', desc: 'Débutant', color: '#795548' },
  { id: 2, name: "Muta'allim", nameAr: 'متعلم', desc: 'Apprenant', color: '#607D8B' },
  { id: 3, name: 'Mutawassit', nameAr: 'متوسط', desc: 'Intermédiaire', color: '#1976D2' },
  { id: 4, name: 'Mutaqaddim', nameAr: 'متقدم', desc: 'Avancé', color: '#7B1FA2' },
  { id: 5, name: "'Alim", nameAr: 'عالم', desc: 'Savant', color: '#F57C00' },
  { id: 6, name: 'Mufti', nameAr: 'مفتي', desc: 'Expert', color: '#FFD700' },
];

export const MADHABS = [
  { id: 'hanafi', name: 'Hanafi', nameAr: 'حنفي' },
  { id: 'maliki', name: 'Maliki', nameAr: 'مالكي' },
  { id: 'shafii', name: "Shafi'i", nameAr: 'شافعي' },
  { id: 'hanbali', name: 'Hanbali', nameAr: 'حنبلي' },
  { id: 'general', name: 'Général', nameAr: 'عام' },
];

export const DOMAINS = [
  { id: 'fiqh', name: 'Fiqh', nameAr: 'فقه', icon: '⚖', color: '#1B5E20' },
  { id: 'aqida', name: 'Aqida', nameAr: 'عقيدة', icon: '☪', color: '#1A237E' },
  { id: 'tafsir', name: 'Tafsir / Coran', nameAr: 'تفسير', icon: '۩', color: '#4A148C' },
  { id: 'hadith', name: 'Hadith', nameAr: 'حديث', icon: '◉', color: '#BF360C' },
  { id: 'sirah', name: 'Sirah', nameAr: 'سيرة', icon: '✦', color: '#01579B' },
  { id: 'akhlaq', name: 'Akhlaq', nameAr: 'أخلاق', icon: '✧', color: '#006064' },
];

export const MOTIVATION_HADITHS = [
  {
    text: 'Rechercher le savoir est une obligation pour tout musulman.',
    textAr: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    narrator: "Rapporté par Anas ibn Malik رضي الله عنه",
    source: 'Ibn Majah, n°224',
  },
  {
    text: "Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.",
    textAr: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    narrator: "Rapporté par Uthman ibn Affan رضي الله عنه",
    source: 'Bukhari 5027',
  },
  {
    text: "Celui qui emprunte un chemin pour rechercher la science, Allah lui facilite le chemin vers le Paradis.",
    textAr: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ',
    narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    source: 'Muslim 2699',
  },
  {
    text: "Quand l'homme meurt, ses actes s'arrêtent sauf trois : une sadaqa jariya, un savoir dont on bénéficie, ou un enfant pieux qui prie pour lui.",
    textAr: 'إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ أَوْ عِلْمٍ يُنْتَفَعُ بِهِ أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ',
    narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    source: 'Muslim 1631',
  },
  {
    text: "Les actions ne valent que par les intentions.",
    textAr: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
    narrator: "Rapporté par Umar ibn al-Khattab رضي الله عنه",
    source: 'Bukhari 1, Muslim 1907',
  },
  {
    text: "La religion, c'est la sincérité.",
    textAr: 'الدِّينُ النَّصِيحَةُ',
    narrator: "Rapporté par Tamim al-Dari رضي الله عنه",
    source: 'Muslim 55',
  },
  {
    text: "Aucun d'entre vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    textAr: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    narrator: "Rapporté par Anas ibn Malik رضي الله عنه",
    source: 'Bukhari 13, Muslim 45',
  },
  {
    text: "Facilitez les choses et ne les compliquez pas.",
    textAr: 'يَسِّرُوا وَلَا تُعَسِّرُوا',
    narrator: "Rapporté par Abu Musa al-Ash'ari رضي الله عنه",
    source: 'Bukhari 69',
  },
  {
    text: "Le musulman est celui dont les musulmans sont préservés de sa langue et de sa main.",
    textAr: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    narrator: "Rapporté par Abdullah ibn Amr رضي الله عنه",
    source: 'Bukhari 10',
  },
  {
    text: "Parmi les meilleures des actions : la prière en son temps, puis honorer ses parents.",
    textAr: 'أَفْضَلُ الْأَعْمَالِ الصَّلَاةُ لِوَقْتِهَا ثُمَّ بِرُّ الْوَالِدَيْنِ',
    narrator: "Rapporté par Abdullah ibn Masud رضي الله عنه",
    source: 'Bukhari 527',
  },
  {
    text: "Allah est beau et Il aime la beauté.",
    textAr: 'إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ',
    narrator: "Rapporté par Abdullah ibn Masud رضي الله عنه",
    source: 'Muslim 91',
  },
  {
    text: "La pudeur ne produit que du bien.",
    textAr: 'الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ',
    narrator: "Rapporté par Imran ibn Husayn رضي الله عنه",
    source: 'Bukhari 6117',
  },
  {
    text: "Souriez à votre frère, c'est une sadaqa.",
    textAr: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ',
    narrator: "Rapporté par Abu Dharr al-Ghifari رضي الله عنه",
    source: 'Tirmidhi 1956',
  },
  {
    text: "Retenez-vous de trop rire, car le rire excessif mortifie le cœur.",
    textAr: 'لَا تُكْثِرُوا الضَّحِكَ فَإِنَّ كَثْرَةَ الضَّحِكِ تُمِيتُ الْقَلْبَ',
    narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    source: 'Ibn Majah 4193',
  },
  {
    text: "Celui qui ne remercie pas les gens ne remercie pas Allah.",
    textAr: 'مَنْ لَمْ يَشْكُرِ النَّاسَ لَمْ يَشْكُرِ اللَّهَ',
    narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    source: 'Tirmidhi 1954',
  },
  {
    text: "L'Islam est fondé sur cinq piliers.",
    textAr: 'بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ',
    narrator: "Rapporté par Abdullah ibn Umar رضي الله عنهما",
    source: 'Bukhari 8, Muslim 16',
  },
  {
    text: "Le paradis est sous les pieds des mères.",
    textAr: 'الْجَنَّةُ تَحْتَ أَقْدَامِ الْأُمَّهَاتِ',
    narrator: "Rapporté par Mu'awiya ibn Jahima رضي الله عنه",
    source: "Nasai 3104",
  },
  {
    text: "Les liens du sang sont suspendus au Trône.",
    textAr: 'الرَّحِمُ مُعَلَّقَةٌ بِالْعَرْشِ',
    narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    source: 'Muslim 2555',
  },
  {
    text: "Allah aime que lorsque l'un d'entre vous fait un travail, il le fasse avec excellence.",
    textAr: 'إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ',
    narrator: "Rapporté par Aïcha رضي الله عنها",
    source: 'Bayhaqi / Silsilah Sahiha 1113',
  },
  {
    text: "Le fort n'est pas celui qui terrasse les autres, mais celui qui se maîtrise dans la colère.",
    textAr: 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ',
    narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    source: 'Bukhari 6114',
  },
  {
    text: "Ne soyez pas en colère, et le Paradis sera pour vous.",
    textAr: 'لَا تَغْضَبْ وَلَكَ الْجَنَّةُ',
    narrator: "Rapporté par un homme des Compagnons رضي الله عنه",
    source: 'Tabarani / Silsilah Sahiha 1893',
  },
  {
    text: "Aidez votre frère qu'il soit oppresseur ou opprimé.",
    textAr: 'انْصُرْ أَخَاكَ ظَالِمًا أَوْ مَظْلُومًا',
    narrator: "Rapporté par Anas ibn Malik رضي الله عنه",
    source: 'Bukhari 2444',
  },
  {
    text: "La meilleure des aumônes est celle que donne l'homme pauvre.",
    textAr: 'أَفْضَلُ الصَّدَقَةِ جُهْدُ الْمُقِلِّ',
    narrator: "Rapporté par Abu Hurayra رضي الله عنه",
    source: 'Abu Dawud 1677',
  },
  {
    text: "Prenez soin de votre corps car il a des droits sur vous.",
    textAr: 'إِنَّ لِجَسَدِكَ عَلَيْكَ حَقًّا',
    narrator: "Rapporté par Abdullah ibn Amr رضي الله عنه",
    source: 'Bukhari 1975',
  },
  {
    text: "Allah est doux et Il aime la douceur en toute chose.",
    textAr: 'إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الْأَمْرِ كُلِّهِ',
    narrator: "Rapporté par Aïcha رضي الله عنها",
    source: 'Bukhari 6927',
  },
  {
    text: "Le meilleur des hommes est celui qui est le plus utile aux autres.",
    textAr: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
    narrator: "Rapporté par Jabir ibn Abdillah رضي الله عنه",
    source: 'Silsilah Sahiha 426',
  },
  {
    text: "Visitez les malades, nourrissez le pauvre, libérez le captif.",
    textAr: 'عُودُوا الْمَرِيضَ وَأَطْعِمُوا الْجَائِعَ وَفُكُّوا الْعَانِيَ',
    narrator: "Rapporté par Abu Musa al-Ash'ari رضي الله عنه",
    source: 'Bukhari 5373',
  },
  {
    text: "Quiconque croit en Allah et au Dernier Jour, qu'il honore son hôte.",
    textAr: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ',
    narrator: "Rapporté par Abu Shurayh al-Adawi رضي الله عنه",
    source: 'Bukhari 6018',
  },
  {
    text: "Dieu est avec ceux qui ont la patience.",
    textAr: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    narrator: "Verset coranique",
    source: 'Coran 2:153',
  },
];

export const QUIZ_MODES = [
  {
    id: 'solo',
    name: 'Quiz Classique',
    nameAr: 'اختبار كلاسيكي',
    description: 'Testez vos connaissances à votre rythme',
    icon: '📝',
    color: '#1B5E20',
  },
  {
    id: 'quotidien',
    name: 'Défi Quotidien',
    nameAr: 'التحدي اليومي',
    description: '5 questions renouvelées chaque jour',
    icon: '🌅',
    color: '#F57C00',
  },
  {
    id: 'talallum',
    name: "Mode Ta'allum",
    nameAr: 'وضع التعلم',
    description: 'Apprenez avec des explications détaillées',
    icon: '🎓',
    color: '#01579B',
  },
  {
    id: 'murajaah',
    name: "Mode Mura'jaah",
    nameAr: 'وضع المراجعة',
    description: 'Révisez vos erreurs précédentes',
    icon: '🔄',
    color: '#4A148C',
  },
];

export interface Ligue {
  id: string;
  nom: string;
  nomAr: string;
  color: string;
  minXp: number;
}

export const LIGUES: Ligue[] = [
  { id: 'bronze', nom: 'Bronze', nomAr: 'برونزي', color: '#CD7F32', minXp: 0 },
  { id: 'argent', nom: 'Argent', nomAr: 'فضي', color: '#C0C0C0', minXp: 500 },
  { id: 'or', nom: 'Or', nomAr: 'ذهبي', color: '#FFD700', minXp: 2000 },
  { id: 'diamant', nom: 'Diamant', nomAr: 'ماسي', color: '#B9F2FF', minXp: 5000 },
  { id: 'savant', nom: 'Savant', nomAr: 'عالم', color: '#E040FB', minXp: 10000 },
  { id: 'mufti', nom: 'Mufti', nomAr: 'مفتي', color: '#FF6F00', minXp: 20000 },
];

export function getLigue(xp: number): Ligue {
  let result = LIGUES[0];
  for (const l of LIGUES) {
    if (xp >= l.minXp) result = l;
  }
  return result;
}

export interface CalendarEvent {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  color: string;
  description: string;
  quizDomaine?: string;
  /** Hijri month number (1=Muharram…12=Dhul Hijjah) */
  hijriMonth?: number;
  /** Which Gregorian week day triggers the event: 5 = Friday */
  weekDay?: number;
  /** Special keys to detect in application logic */
  key: string;
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ramadan',
    key: 'ramadan',
    name: 'Ramadan',
    nameAr: 'رَمَضَان',
    icon: '🌙',
    color: '#1A237E',
    description: 'Quiz Ramadan — 1 thème/jour, badges exclusifs',
    quizDomaine: 'fiqh',
    hijriMonth: 9,
  },
  {
    id: 'dhul_hijjah',
    key: 'dhul_hijjah',
    name: 'Dhul Hijjah',
    nameAr: 'ذو الحِجَّة',
    icon: '🕋',
    color: '#4A148C',
    description: 'Fiqh du Hajj — vertus des 10 premiers jours',
    quizDomaine: 'fiqh',
    hijriMonth: 12,
  },
  {
    id: 'muharram',
    key: 'muharram',
    name: 'Muharram',
    nameAr: 'مُحَرَّم',
    icon: '🗓️',
    color: '#01579B',
    description: 'Quiz Sirah & Hijra — enseignements d\'Achoura',
    quizDomaine: 'sirah',
    hijriMonth: 1,
  },
  {
    id: 'rabi_awwal',
    key: 'rabi_awwal',
    name: "Rabi' Al-Awwal",
    nameAr: 'رَبِيع الأَوَّل',
    icon: '🌹',
    color: '#2E7D32',
    description: 'Quiz Sirah Nabawiyya — vie du Prophète SAW',
    quizDomaine: 'sirah',
    hijriMonth: 3,
  },
  {
    id: 'jumuah',
    key: 'jumuah',
    name: "Défi Al-Jumu'ah",
    nameAr: 'تَحَدِّي الجُمُعَة',
    icon: '🕌',
    color: '#1B5E20',
    description: "Questions sur Sourate Al-Kahf et Salat Al-Jumu'ah",
    quizDomaine: 'tafsir',
    weekDay: 5,
  },
  {
    id: 'shaban',
    key: 'shaban',
    name: "Sha'ban",
    nameAr: 'شَعبَان',
    icon: '⭐',
    color: '#E65100',
    description: 'Préparation Ramadan — Fiqh du jeûne',
    quizDomaine: 'fiqh',
    hijriMonth: 8,
  },
];

/**
 * Returns today's hadith index based on day of year (cycles through 30 hadiths).
 */
export function getTodayHadithIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % MOTIVATION_HADITHS.length;
}

/**
 * Returns the active calendar event for today (if any).
 * Uses day-of-week for Friday, and a simple Hijri month estimator otherwise.
 * Falls back to a hadith-of-the-day event if no calendar event matches.
 */
export function getTodayEvent(): CalendarEvent {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 5=Fri

  // Friday override takes priority
  const friday = CALENDAR_EVENTS.find(e => e.weekDay === 5);
  if (dayOfWeek === 5 && friday) return friday;

  // Approximate current Hijri month
  // Epoch: 1 Muharram 1446H = 7 July 2024
  const HIJRI_EPOCH = new Date('2024-07-07').getTime();
  const HIJRI_MONTH_MS = 29.53059 * 24 * 3600 * 1000;
  const diffMs = today.getTime() - HIJRI_EPOCH;
  if (diffMs >= 0) {
    const totalHijriMonths = Math.floor(diffMs / HIJRI_MONTH_MS);
    const hijriMonth = (totalHijriMonths % 12) + 1;
    const monthEvent = CALENDAR_EVENTS.find(e => e.hijriMonth === hijriMonth);
    if (monthEvent) return monthEvent;
  }

  // Fallback: hadith of the day
  const hadith = MOTIVATION_HADITHS[getTodayHadithIndex()];
  return {
    id: 'hadith_du_jour',
    key: 'hadith_du_jour',
    name: 'Hadith du Jour',
    nameAr: 'حديث اليوم',
    icon: '◉',
    color: '#BF360C',
    description: hadith.text,
    quizDomaine: 'hadith',
  };
}

/**
 * Returns daily challenge info based on today's date.
 * Cycles through domains and provides a consistent challenge per day.
 */
export function getTodayChallenge(): { title: string; titleAr: string; desc: string; domaine: string; nb: number } {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const challengeDomains = DOMAINS.filter(d => d.id !== 'akhlaq');
  const domain = challengeDomains[dayOfYear % challengeDomains.length];
  const nbOptions = [5, 10, 5, 10, 5];
  const nb = nbOptions[dayOfYear % nbOptions.length];
  return {
    title: `Défi du jour — ${domain.name}`,
    titleAr: `تحدي اليوم — ${domain.nameAr}`,
    desc: `${nb} questions de ${domain.name} • Se renouvelle demain`,
    domaine: domain.id,
    nb,
  };
}
