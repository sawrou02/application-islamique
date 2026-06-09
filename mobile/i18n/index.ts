import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

export type Lang = 'fr' | 'ar' | 'en';

const translations: Record<Lang, Record<string, string>> = {
  fr: {
    // Nav
    'nav.home': 'Accueil',
    'nav.quiz': 'Quiz',
    'nav.multi': 'Multi',
    'nav.rank': 'Classement',
    'nav.profile': 'Profil',
    // Home
    'home.bismillah': 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    'home.greeting.morning': 'صباح الخير',
    'home.greeting.afternoon': 'مساء الخير',
    'home.greeting.night': 'ليلة طيبة',
    'home.greeting.sub': "Assalamu 'Alaikum,",
    'home.xp': 'XP Total',
    'home.streak': 'Streak',
    'home.level': 'Niveau',
    'home.progress': 'Progression vers',
    'home.event': "Événement du jour",
    'home.challenge': 'Défi Quotidien',
    'home.challenge.ar': 'التحدي اليومي',
    'home.hadith': 'Hadith du Jour',
    'home.domains': 'Choisir un domaine',
    // Quiz
    'quiz.title': 'Choisir un Quiz',
    'quiz.title.ar': 'اختر الاختبار',
    'quiz.mode': 'Mode de jeu',
    'quiz.domain': 'Domaine',
    'quiz.level': 'Niveau de difficulté',
    'quiz.madhab': 'Madhab',
    'quiz.nb': 'Nombre de questions',
    'quiz.start': 'Commencer le Quiz',
    'quiz.loading': 'Chargement...',
    'quiz.all_domains': 'Tous les domaines',
    'quiz.all_domains.ar': 'جميع المجالات',
    'quiz.all_domains.desc': 'Toutes les sciences mélangées',
    // Results
    'result.score': 'Score',
    'result.correct': 'Bonnes réponses',
    'result.xp': 'XP gagnés',
    'result.retry': 'Recommencer',
    'result.home': 'Accueil',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.quiz': 'اختبار',
    'nav.multi': 'متعدد',
    'nav.rank': 'الترتيب',
    'nav.profile': 'الملف',
    'home.bismillah': 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    'home.greeting.morning': 'صباح الخير',
    'home.greeting.afternoon': 'مساء الخير',
    'home.greeting.night': 'ليلة طيبة',
    'home.greeting.sub': 'السلام عليكم،',
    'home.xp': 'مجموع النقاط',
    'home.streak': 'سلسلة',
    'home.level': 'المستوى',
    'home.progress': 'التقدم نحو',
    'home.event': 'حدث اليوم',
    'home.challenge': 'تحدي اليوم',
    'home.challenge.ar': 'التحدي اليومي',
    'home.hadith': 'حديث اليوم',
    'home.domains': 'اختر مجالاً',
    'quiz.title': 'اختر الاختبار',
    'quiz.title.ar': 'اختر الاختبار',
    'quiz.mode': 'وضع اللعبة',
    'quiz.domain': 'المجال',
    'quiz.level': 'مستوى الصعوبة',
    'quiz.madhab': 'المذهب',
    'quiz.nb': 'عدد الأسئلة',
    'quiz.start': 'ابدأ الاختبار',
    'quiz.loading': 'جارٍ التحميل...',
    'quiz.all_domains': 'جميع المجالات',
    'quiz.all_domains.ar': 'جميع المجالات',
    'quiz.all_domains.desc': 'جميع العلوم الإسلامية',
    'result.score': 'النتيجة',
    'result.correct': 'الإجابات الصحيحة',
    'result.xp': 'النقاط المكتسبة',
    'result.retry': 'إعادة المحاولة',
    'result.home': 'الرئيسية',
  },
  en: {
    'nav.home': 'Home',
    'nav.quiz': 'Quiz',
    'nav.multi': 'Multi',
    'nav.rank': 'Leaderboard',
    'nav.profile': 'Profile',
    'home.bismillah': 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    'home.greeting.morning': 'Good morning',
    'home.greeting.afternoon': 'Good afternoon',
    'home.greeting.night': 'Good evening',
    'home.greeting.sub': "Assalamu 'Alaikum,",
    'home.xp': 'Total XP',
    'home.streak': 'Streak',
    'home.level': 'Level',
    'home.progress': 'Progress to',
    'home.event': "Today's Event",
    'home.challenge': 'Daily Challenge',
    'home.challenge.ar': 'التحدي اليومي',
    'home.hadith': "Hadith of the Day",
    'home.domains': 'Choose a domain',
    'quiz.title': 'Choose a Quiz',
    'quiz.title.ar': 'اختر الاختبار',
    'quiz.mode': 'Game mode',
    'quiz.domain': 'Domain',
    'quiz.level': 'Difficulty level',
    'quiz.madhab': 'Madhab',
    'quiz.nb': 'Number of questions',
    'quiz.start': 'Start Quiz',
    'quiz.loading': 'Loading...',
    'quiz.all_domains': 'All domains',
    'quiz.all_domains.ar': 'جميع المجالات',
    'quiz.all_domains.desc': 'All Islamic sciences mixed',
    'result.score': 'Score',
    'result.correct': 'Correct answers',
    'result.xp': 'XP earned',
    'result.retry': 'Try again',
    'result.home': 'Home',
  },
};

let _currentLang: Lang = 'fr';

export function t(key: string, lang?: Lang): string {
  const l = lang ?? _currentLang;
  return translations[l]?.[key] ?? translations['fr'][key] ?? key;
}

export function setLang(lang: Lang): void {
  _currentLang = lang;
  I18nManager.forceRTL(lang === 'ar');
  AsyncStorage.setItem('app_lang', lang).catch(() => {});
}

export async function loadLang(): Promise<Lang> {
  try {
    const stored = await AsyncStorage.getItem('app_lang');
    if (stored === 'fr' || stored === 'ar' || stored === 'en') {
      _currentLang = stored;
      I18nManager.forceRTL(stored === 'ar');
      return stored;
    }
  } catch {}
  return 'fr';
}

export function getCurrentLang(): Lang {
  return _currentLang;
}

export function useLang(): Lang {
  return _currentLang;
}
