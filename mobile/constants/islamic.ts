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
  { id: 'fiqh', name: 'Fiqh', nameAr: 'فقه', icon: '📚', color: '#1B5E20' },
  { id: 'aqida', name: 'Aqida', nameAr: 'عقيدة', icon: '🌙', color: '#1A237E' },
  { id: 'tafsir', name: 'Tafsir / Coran', nameAr: 'تفسير', icon: '📖', color: '#4A148C' },
  { id: 'hadith', name: 'Hadith', nameAr: 'حديث', icon: '📜', color: '#BF360C' },
  { id: 'sirah', name: 'Sirah', nameAr: 'سيرة', icon: '🕌', color: '#01579B' },
  { id: 'akhlaq', name: 'Akhlaq', nameAr: 'أخلاق', icon: '✨', color: '#006064' },
];

export const MOTIVATION_HADITHS = [
  {
    text: 'Rechercher le savoir est une obligation pour tout musulman.',
    textAr: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    source: 'Ibn Majah, n°224',
  },
  {
    text: "Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.",
    textAr: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    source: 'Bukhari 5027',
  },
  {
    text: "Celui qui emprunte un chemin pour rechercher la science, Allah lui facilite le chemin vers le Paradis.",
    textAr: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ',
    source: 'Muslim 2699',
  },
  {
    text: "Quand l'homme meurt, ses actes s'arrêtent sauf trois : une sadaqa jariya, un savoir dont on bénéficie, ou un enfant pieux qui prie pour lui.",
    textAr: 'إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ أَوْ عِلْمٍ يُنْتَفَعُ بِهِ أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ',
    source: 'Muslim 1631',
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
 * Returns the active calendar event for today (if any).
 * Uses day-of-week for Friday, and a simple Hijri month estimator otherwise.
 */
export function getTodayEvent(): CalendarEvent | null {
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
  if (diffMs < 0) return null;
  const totalHijriMonths = Math.floor(diffMs / HIJRI_MONTH_MS);
  const hijriMonth = (totalHijriMonths % 12) + 1;

  return CALENDAR_EVENTS.find(e => e.hijriMonth === hijriMonth) ?? null;
}
