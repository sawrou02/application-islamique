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
