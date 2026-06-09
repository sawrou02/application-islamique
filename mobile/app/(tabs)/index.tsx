import { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Dimensions, Animated,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useQuizSetupStore } from '../../store/quizSetupStore';
import { COLORS } from '../../constants/colors';
import { t, getCurrentLang } from '../../i18n';
import {
  LEVELS, getTodayEvent, getTodayChallenge, getTodayHadithIndex,
  MOTIVATION_HADITHS,
} from '../../constants/islamic';
import { getCurrentXpBoost } from '../../services/islamicBoosts';
import { quizApi, badgesApi, usersApi } from '../../services/api';
import { Badge } from '../../types';

const { width } = Dimensions.get('window');

// ── Quran verses ──────────────────────────────────────────────────────────────
const QURAN_VERSES = [
  { ar: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', fr: 'Certes, avec la difficulté vient la facilité.', ref: 'Sourate Al-Inshirah (94:6)' },
  { ar: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', fr: 'Quiconque craint Allah, Il lui ménagera une issue.', ref: 'Sourate At-Talaq (65:2)' },
  { ar: 'فَاذْكُرُونِي أَذْكُرْكُمْ', fr: 'Souvenez-vous de Moi, Je me souviendrai de vous.', ref: 'Sourate Al-Baqara (2:152)' },
  { ar: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ', fr: 'Lorsque Mes serviteurs t\'interrogent sur Moi, Je suis proche.', ref: 'Sourate Al-Baqara (2:186)' },
  { ar: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', fr: 'Allah ! Pas de divinité sauf Lui, le Vivant, l\'Éternel Subsistant.', ref: 'Sourate Al-Baqara (2:255) — Al-Kursi' },
  { ar: 'وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ', fr: 'Nous sommes plus proche de lui que sa veine jugulaire.', ref: 'Sourate Qaf (50:16)' },
  { ar: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', fr: 'Certes, Allah est avec les patients.', ref: 'Sourate Al-Baqara (2:153)' },
  { ar: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ', fr: 'Ne désespérez pas de la miséricorde d\'Allah.', ref: 'Sourate Yusuf (12:87)' },
  { ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً', fr: 'Seigneur, accorde-nous le bien ici-bas et dans l\'Au-delà.', ref: 'Sourate Al-Baqara (2:201)' },
  { ar: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ', fr: 'Ceux qui croient et dont les cœurs se tranquillisent par le rappel d\'Allah.', ref: 'Sourate Ar-Ra\'d (13:28)' },
  { ar: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ', fr: 'Je n\'ai créé les djinns et les hommes que pour qu\'ils M\'adorent.', ref: 'Sourate Adh-Dhariyat (51:56)' },
  { ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ', fr: 'Dis : Il est Allah, Unique.', ref: 'Sourate Al-Ikhlas (112:1)' },
  { ar: 'وَعَسَى أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ', fr: 'Il se peut que vous aimiez une chose alors qu\'elle vous est mauvaise.', ref: 'Sourate Al-Baqara (2:216)' },
  { ar: 'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّى يُغَيِّرُوا مَا بِأَنفُسِهِمْ', fr: 'Allah ne change pas l\'état d\'un peuple tant que ses membres ne changent pas ce qui est en eux-mêmes.', ref: 'Sourate Ar-Ra\'d (13:11)' },
  { ar: 'وَبَشِّرِ الصَّابِرِينَ', fr: 'Et annonce la bonne nouvelle aux endurants.', ref: 'Sourate Al-Baqara (2:155)' },
];

// ── Scholar quotes ─────────────────────────────────────────────────────────────
const SCHOLAR_QUOTES = [
  { text: "Le savoir est une lumière qu'Allah place dans le cœur de qui Il veut.", ar: 'العلم نور يضعه الله في قلب من يشاء.', scholar: 'Ibn Masud رضي الله عنه' },
  { text: 'Qui se connaît lui-même connaît son Seigneur.', ar: 'من عرف نفسه عرف ربه.', scholar: 'Ibn Arabi رحمه الله' },
  { text: "L'humilité est la couronne des savants.", ar: 'التواضع تاج العلماء.', scholar: 'Al-Hasan Al-Basri رحمه الله' },
  { text: 'La patience est moitié de la foi, et la certitude est la foi tout entière.', ar: 'الصبر نصف الإيمان، واليقين الإيمان كله.', scholar: 'Ibn Al-Qayyim رحمه الله' },
  { text: "Multiplie tes actes bons en secret ; c'est la sincérité que les anges exaltent.", ar: 'أكثر من الأعمال الصالحة في السر، فإنَّ الإخلاص ما خفي عن الناس.', scholar: 'Ibn Rajab Al-Hanbali رحمه الله' },
  { text: 'Le cœur ne se rectifie pas sans que la langue ne soit rectifiée d\'abord.', ar: 'لا يستقيم القلب حتى تستقيم اللسان أولاً.', scholar: 'Ibn Taymiyya رحمه الله' },
  { text: "Traite les gens comme tu aimerais être traité ; c'est la quintessence de la jurisprudence.", ar: 'عامل الناس كما تحبّ أن يعاملوك، فهذا جوهر الفقه.', scholar: "Imam Shafi'i رحمه الله" },
  { text: 'Le meilleur des actions est celle qui est constante, même si elle est petite.', ar: 'خير الأعمال أدومها وإن قلَّ.', scholar: 'Aïcha رضي الله عنها' },
  { text: 'Ne compte pas le nombre de tes prières, mais la qualité de ta présence en elles.', ar: 'لا تحصِ عدد صلواتك، بل اهتمَّ بحضور قلبك فيها.', scholar: 'Imam Al-Ghazali رحمه الله' },
  { text: "Qui veut le monde, il lui faut le savoir ; qui veut l'Au-delà, il lui faut le savoir.", ar: 'من أراد الدنيا فعليه بالعلم، ومن أراد الآخرة فعليه بالعلم.', scholar: "Imam Al-Shafi'i رحمه الله" },
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function getGreeting(): { ar: string; sub: string } {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { ar: 'صباح الخير', sub: t('salutation_matin') + ' —' };
  if (h >= 12 && h < 18) return { ar: 'مساء الخير', sub: t('salutation_apres_midi') + ' —' };
  return { ar: 'ليلة طيبة', sub: t('salutation_soir') + ' —' };
}

interface PersonalizedData {
  mistakesCount: number;
  nextBadge: Badge | null;
  totalParties: number | null;
}

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { reset, setMode, setNb } = useQuizSetupStore();
  const lang = getCurrentLang();
  const isAr = lang === 'ar';
  const greeting = getGreeting();
  const todayEvent = getTodayEvent();
  const todayChallenge = getTodayChallenge();
  const hadith = MOTIVATION_HADITHS[getTodayHadithIndex()];
  const xpBoost = getCurrentXpBoost();

  const dayOfYear = getDayOfYear();
  const todayVerse = QURAN_VERSES[dayOfYear % QURAN_VERSES.length];
  const todayQuote = SCHOLAR_QUOTES[dayOfYear % SCHOLAR_QUOTES.length];

  const [personalizedData, setPersonalizedData] = useState<PersonalizedData | null>(null);
  const [personalizedLoading, setPersonalizedLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchPersonalized() {
      try {
        const [mistakesRes, myBadgesRes, allBadgesRes, statsRes] = await Promise.allSettled([
          quizApi.getMistakes(3),
          badgesApi.getMyBadges(),
          badgesApi.getAllBadges(),
          usersApi.getStats(),
        ]);

        if (cancelled) return;

        const mistakesCount =
          mistakesRes.status === 'fulfilled' ? (mistakesRes.value.data.data?.length ?? 0) : 0;

        let nextBadge: Badge | null = null;
        if (myBadgesRes.status === 'fulfilled' && allBadgesRes.status === 'fulfilled') {
          const earned = new Set(myBadgesRes.value.data.data.map((b: Badge) => b.id));
          nextBadge = allBadgesRes.value.data.data.find((b: Badge) => !earned.has(b.id)) ?? null;
        }

        let totalParties: number | null = null;
        if (statsRes.status === 'fulfilled') {
          const stats = statsRes.value.data.data as Record<string, unknown> | null;
          if (stats && typeof stats['total_parties'] === 'number') {
            totalParties = stats['total_parties'];
          } else if (stats && typeof stats['parties_jouees'] === 'number') {
            totalParties = stats['parties_jouees'];
          }
        }

        setPersonalizedData({ mistakesCount, nextBadge, totalParties });
      } catch {
        if (!cancelled) setPersonalizedData({ mistakesCount: 0, nextBadge: null, totalParties: null });
      } finally {
        if (!cancelled) setPersonalizedLoading(false);
      }
    }
    fetchPersonalized();
    return () => { cancelled = true; };
  }, []);

  // Bannière pulsante (uniquement si boost actif)
  const boostPulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (xpBoost.multiplier <= 1) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(boostPulse, { toValue: 1.04, duration: 800, useNativeDriver: true }),
        Animated.timing(boostPulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [xpBoost.multiplier]);

  const level = LEVELS.find(l => l.id === (user?.niveau || 1)) || LEVELS[0];
  const xpForNextLevel = [0, 500, 2000, 5000, 10000, 20000, 999999];
  const currentXp = user?.xp_total || 0;
  const nextXp = xpForNextLevel[(user?.niveau || 1)];
  const prevXp = xpForNextLevel[(user?.niveau || 1) - 1];
  const progress = nextXp === 999999 ? 1 : Math.min((currentXp - prevXp) / (nextXp - prevXp), 1);

  // Animated XP bar
  const progressAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  function handleMurajaahPress() {
    reset();
    setMode('murajaah');
    setNb(10);
    router.push('/quiz/setup/recap');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
            <Text style={styles.greetingAr}>{greeting.ar}</Text>
            <Text style={styles.greetingSub}>{greeting.sub}</Text>
            <Text style={styles.pseudo}>{user?.pseudo || 'Frère / Sœur'}</Text>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: level.color }]}>
            <Text style={styles.levelBadgeAr}>{level.nameAr}</Text>
            <Text style={styles.levelBadgeFr}>{level.name}</Text>
          </View>
        </View>

        {/* ── Bannière boost XP saisonnier ── */}
        {xpBoost.multiplier > 1 && (
          <Animated.View style={[styles.boostBanner, { transform: [{ scale: boostPulse }] }]}>
            <Text style={styles.boostText}>
              ✨ {xpBoost.label} — XP ×{xpBoost.multiplier}
            </Text>
          </Animated.View>
        )}

        {/* ── Stats Row ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statIcon, { color: COLORS.gold }]}>✦</Text>
            <Text style={styles.statValue}>{currentXp}</Text>
            <Text style={styles.statLabel}>{t('home.xp')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statIcon, { color: COLORS.error }]}>❋</Text>
            <Text style={styles.statValue}>{user?.streak_days || 0}</Text>
            <Text style={styles.statLabel}>{t('home.streak')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statIcon, { color: COLORS.primary }]}>◈</Text>
            <Text style={styles.statValue}>{user?.niveau || 1}/6</Text>
            <Text style={styles.statLabel}>{t('home.level')}</Text>
          </View>
        </View>

        {/* ── XP Progress Bar ── */}
        <View style={styles.xpCard}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>
              {t('home.progress')} {LEVELS[(user?.niveau || 1)]?.name || 'Mufti'}
            </Text>
            <Text style={styles.xpValue}>
              {currentXp} / {nextXp === 999999 ? '∞' : nextXp} XP
            </Text>
          </View>
          <View style={styles.xpBarBg}>
            <Animated.View style={[styles.xpBarFill, { width: barWidth }]} />
          </View>
        </View>

        {/* ── Événement islamique du jour ── */}
        <TouchableOpacity
          style={[styles.eventCard, { borderLeftColor: todayEvent.color }]}
          onPress={() => router.push('/evenement')}
          activeOpacity={0.85}
        >
          <View style={[styles.eventIconWrap, { backgroundColor: `${todayEvent.color}18` }]}>
            <Text style={styles.eventIconText}>{todayEvent.icon}</Text>
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventLabel}>{t('evenement_du_jour').toUpperCase()}</Text>
            <Text style={styles.eventName}>{todayEvent.name}</Text>
            <Text style={styles.eventNameAr}>{todayEvent.nameAr}</Text>
            <Text style={styles.eventDesc} numberOfLines={2}>{todayEvent.description}</Text>
          </View>
          <Text style={[styles.eventArrow, { color: todayEvent.color }]}>›</Text>
        </TouchableOpacity>

        {/* ── Défi Quotidien ── */}
        <TouchableOpacity
          style={styles.challengeCard}
          onPress={() => router.push({ pathname: '/evenement', params: { type: 'challenge' } })}
          activeOpacity={0.85}
        >
          <View style={styles.challengeLeft}>
            <View style={styles.challengeIconWrap}>
              <Text style={styles.challengeIconText}>🌅</Text>
            </View>
            <View style={styles.challengeTextWrap}>
              <Text style={styles.challengeTitle}>{todayChallenge.title}</Text>
              <Text style={styles.challengeTitleAr}>{todayChallenge.titleAr}</Text>
              <Text style={styles.challengeDesc}>{todayChallenge.desc}</Text>
            </View>
          </View>
          <View style={styles.challengeArrowWrap}>
            <Text style={styles.challengeArrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ── Section 1 : Pour toi aujourd'hui ── */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Text style={styles.sectionTitle}>{isAr ? 'لك اليوم' : lang === 'en' ? 'For you today' : "Pour toi aujourd'hui"}</Text>

        {personalizedLoading ? (
          /* Loading skeletons */
          <View style={styles.skeletonGroup}>
            <View style={[styles.skeleton, { height: 90 }]} />
            <View style={[styles.skeleton, { height: 72, marginTop: 10 }]} />
            <View style={[styles.skeleton, { height: 60, marginTop: 10 }]} />
          </View>
        ) : (
          <View style={styles.personalizedGroup}>
            {/* Erreurs à revoir */}
            {personalizedData && personalizedData.mistakesCount > 0 && (
              <View style={styles.personalCard}>
                <View style={styles.personalCardLeft}>
                  <Text style={styles.personalCardIcon}>🔄</Text>
                  <View style={styles.personalCardText}>
                    <Text style={styles.personalCardTitle}>
                      {isAr
                        ? `${personalizedData.mistakesCount} خطأ للمراجعة`
                        : lang === 'en'
                          ? `${personalizedData.mistakesCount} mistake${personalizedData.mistakesCount > 1 ? 's' : ''} to review`
                          : `${personalizedData.mistakesCount} erreur${personalizedData.mistakesCount > 1 ? 's' : ''} à revoir`}
                    </Text>
                    <Text style={styles.personalCardSub}>{isAr ? 'وضع المراجعة' : lang === 'en' ? "Muraja'ah mode — targeted review" : "Mode Muraja'ah — révision ciblée"}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.personalCardBtn} onPress={handleMurajaahPress} activeOpacity={0.8}>
                  <Text style={styles.personalCardBtnText}>{isAr ? 'راجع' : lang === 'en' ? 'Review' : 'Réviser'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Prochain badge */}
            {personalizedData?.nextBadge && (
              <View style={styles.personalCard}>
                <View style={styles.personalCardLeft}>
                  <Text style={styles.personalCardIcon}>🏅</Text>
                  <View style={styles.personalCardText}>
                    <Text style={styles.personalCardTitle}>
                      {isAr ? 'الشارة التالية : ' : lang === 'en' ? 'Next badge: ' : 'Prochain badge : '}{personalizedData.nextBadge.nom ?? '—'}
                    </Text>
                    <Text style={styles.personalCardSub}>{isAr ? 'واصل التقدم لفتحه' : lang === 'en' ? 'Keep progressing to unlock it' : 'Continue à progresser pour le débloquer'}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Parties jouées */}
            {personalizedData?.totalParties !== null && personalizedData?.totalParties !== undefined && (
              <View style={[styles.personalCard, styles.personalCardCompact]}>
                <Text style={styles.personalCardIcon}>🎮</Text>
                <Text style={styles.personalCardStatLabel}>{isAr ? 'الجولات' : lang === 'en' ? 'Games played' : 'Parties jouées'}</Text>
                <Text style={styles.personalCardStatValue}>{personalizedData.totalParties}</Text>
              </View>
            )}

            {/* Fallback si rien à afficher */}
            {personalizedData &&
              personalizedData.mistakesCount === 0 &&
              !personalizedData.nextBadge &&
              personalizedData.totalParties === null && (
                <View style={styles.personalCard}>
                  <Text style={styles.personalCardIcon}>✦</Text>
                  <View style={styles.personalCardText}>
                    <Text style={styles.personalCardTitle}>{isAr ? 'أحسنت!' : lang === 'en' ? 'Great progress!' : 'Bonne continuité !'}</Text>
                    <Text style={styles.personalCardSub}>{isAr ? 'لا أخطاء في الانتظار. واصل هكذا.' : lang === 'en' ? 'No mistakes pending. Keep it up.' : 'Aucune erreur en attente. Continue ainsi.'}</Text>
                  </View>
                </View>
              )}
          </View>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ── Section 2 : Contenu islamique du jour ── */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{isAr ? 'المحتوى الإسلامي اليومي' : lang === 'en' ? 'Islamic content of the day' : 'Contenu islamique du jour'}</Text>

        {/* Verset du Jour */}
        <View style={styles.verseCard}>
          <Text style={styles.verseLabel}>◉ {isAr ? 'آية اليوم' : lang === 'en' ? 'VERSE OF THE DAY' : 'VERSET DU JOUR'}</Text>
          <Text style={styles.verseAr}>{todayVerse.ar}</Text>
          {!isAr && <Text style={styles.verseFr}>« {todayVerse.fr} »</Text>}
          <Text style={styles.verseRef}>— {todayVerse.ref}</Text>
        </View>

        {/* Parole du Jour */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteLabel}>✦ {isAr ? 'قول اليوم' : lang === 'en' ? 'QUOTE OF THE DAY' : 'PAROLE DU JOUR'}</Text>
          {isAr
            ? <Text style={[styles.quoteText, { textAlign: 'right', writingDirection: 'rtl', fontStyle: 'normal', fontSize: 16 }]}>{todayQuote.ar}</Text>
            : <Text style={styles.quoteText}>« {todayQuote.text} »</Text>
          }
          <Text style={styles.quoteScholar}>— {todayQuote.scholar}</Text>
        </View>

        {/* ── Hadith du Jour ── */}
        <View style={styles.hadithCard}>
          <Text style={styles.hadithLabel}>◉ {t('hadith_du_jour').toUpperCase()}</Text>
          <Text style={styles.hadithAr}>{hadith.textAr}</Text>
          {!isAr && <Text style={styles.hadithFr}>« {hadith.text} »</Text>}
          {hadith.narrator && (
            <Text style={styles.hadithNarrator}>{hadith.narrator}</Text>
          )}
          <Text style={styles.hadithSource}>— {hadith.source}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 16, paddingBottom: 40 },

  // Header
  header: {
    backgroundColor: COLORS.gradientStart,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },
  headerInner: { flex: 1 },
  bismillah: {
    fontSize: 12,
    color: COLORS.gold,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  greetingAr: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginBottom: 2,
  },
  greetingSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  pseudo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  levelBadge: {
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  levelBadgeAr: { fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' },
  levelBadgeFr: { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  // Boost banner
  boostBanner: {
    backgroundColor: COLORS.gold,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  boostText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#3D2A00',
    letterSpacing: 0.3,
  },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statIcon: { fontSize: 20 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },

  // XP
  xpCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  xpLabel: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  xpValue: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  xpBarBg: {
    height: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 5,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },

  // Event card
  eventCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  eventIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventIconText: { fontSize: 26 },
  eventContent: { flex: 1 },
  eventLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textLight,
    letterSpacing: 1,
    marginBottom: 3,
  },
  eventName: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  eventNameAr: {
    fontSize: 13,
    color: COLORS.arabicText,
    textAlign: 'right',
    marginTop: 1,
  },
  eventDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  eventArrow: { fontSize: 28, fontWeight: '300', marginLeft: 4 },

  // Challenge card
  challengeCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  challengeLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  challengeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeIconText: { fontSize: 24 },
  challengeTextWrap: { flex: 1 },
  challengeTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  challengeTitleAr: { fontSize: 12, color: COLORS.gold, marginTop: 1 },
  challengeDesc: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 3 },
  challengeArrowWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeArrow: { fontSize: 20, color: COLORS.gold, fontWeight: '700' },

  // Section titles
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },

  // Skeleton loading
  skeletonGroup: { marginBottom: 20 },
  skeleton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    width: '100%',
  },

  // Personalized cards
  personalizedGroup: { gap: 10, marginBottom: 8 },
  personalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  personalCardCompact: {
    justifyContent: 'flex-start',
    gap: 10,
  },
  personalCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  personalCardIcon: { fontSize: 28 },
  personalCardText: { flex: 1 },
  personalCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  personalCardSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  personalCardBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  personalCardBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  personalCardStatLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  personalCardStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  // Verse card
  verseCard: {
    backgroundColor: '#FFFBF0',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
    marginBottom: 10,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  verseLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.goldDark,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  verseAr: {
    fontSize: 22,
    color: COLORS.arabicText,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 36,
    marginBottom: 10,
    fontWeight: '600',
  },
  verseFr: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
  },
  verseRef: {
    fontSize: 11,
    color: COLORS.goldDark,
    fontWeight: '600',
  },

  // Scholar quote card
  quoteCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  quoteLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 14,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 8,
  },
  quoteScholar: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },

  // Hadith
  hadithCard: {
    backgroundColor: '#FFFBF0',
    borderRadius: 18,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 14,
  },
  hadithLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.goldDark,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  hadithAr: {
    fontSize: 18,
    color: COLORS.arabicText,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 30,
    marginBottom: 10,
    fontWeight: '500',
  },
  hadithFr: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
  },
  hadithNarrator: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
    fontWeight: '500',
    marginBottom: 4,
  },
  hadithSource: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '600',
  },
});
