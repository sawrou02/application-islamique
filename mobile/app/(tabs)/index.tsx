import { useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Dimensions, Animated,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../constants/colors';
import { t } from '../../i18n';
import {
  DOMAINS, LEVELS, getTodayEvent, getTodayChallenge, getTodayHadithIndex,
  MOTIVATION_HADITHS,
} from '../../constants/islamic';

const { width } = Dimensions.get('window');

function getGreeting(): { ar: string; sub: string } {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { ar: 'صباح الخير', sub: t('salutation_matin') + ' —' };
  if (h >= 12 && h < 18) return { ar: 'مساء الخير', sub: t('salutation_apres_midi') + ' —' };
  return { ar: 'ليلة طيبة', sub: t('salutation_soir') + ' —' };
}

const DOMAIN_TINTS: Record<string, string> = {
  fiqh: '#E8F5E9',
  aqida: '#E8EAF6',
  tafsir: '#F3E5F5',
  hadith: '#FBE9E7',
  sirah: '#E1F5FE',
  akhlaq: '#E0F2F1',
};

export default function HomeScreen() {
  const { user } = useAuthStore();
  const greeting = getGreeting();
  const todayEvent = getTodayEvent();
  const todayChallenge = getTodayChallenge();
  const hadith = MOTIVATION_HADITHS[getTodayHadithIndex()];

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

        {/* ── Stats Row ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statIcon, { color: COLORS.gold }]}>✦</Text>
            <Text style={styles.statValue}>{currentXp}</Text>
            <Text style={styles.statLabel}>XP Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statIcon, { color: COLORS.error }]}>❋</Text>
            <Text style={styles.statValue}>{user?.streak_days || 0}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statIcon, { color: COLORS.primary }]}>◈</Text>
            <Text style={styles.statValue}>{user?.niveau || 1}/6</Text>
            <Text style={styles.statLabel}>Niveau</Text>
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
          onPress={() => router.push({
            pathname: '/(tabs)/quiz',
            params: { presetDomain: todayEvent.quizDomaine },
          })}
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
          onPress={() => router.push({
            pathname: '/(tabs)/quiz',
            params: { presetDomain: todayChallenge.domaine, presetMode: 'quotidien' },
          })}
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

        {/* ── Domaines — grille 2 colonnes ── */}
        <Text style={styles.sectionTitle}>{t('choisir_domaine')}</Text>
        <View style={styles.domainsGrid}>
          {DOMAINS.map((domain) => (
            <TouchableOpacity
              key={domain.id}
              style={[
                styles.domainCard,
                { backgroundColor: DOMAIN_TINTS[domain.id] || COLORS.cardBg },
              ]}
              onPress={() => router.push({
                pathname: '/(tabs)/quiz',
                params: { presetDomain: domain.id },
              })}
              activeOpacity={0.8}
            >
              <Text style={[styles.domainSymbol, { color: COLORS.gold }]}>{domain.icon}</Text>
              <Text style={styles.domainName}>{domain.name}</Text>
              <Text style={[styles.domainNameAr, { color: domain.color }]}>{domain.nameAr}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Hadith du Jour ── */}
        <View style={styles.hadithCard}>
          <Text style={styles.hadithLabel}>◉ {t('hadith_du_jour').toUpperCase()}</Text>
          <Text style={styles.hadithAr}>{hadith.textAr}</Text>
          <Text style={styles.hadithFr}>« {hadith.text} »</Text>
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
    // Simulate gradient with darker overlay at bottom
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

  // Domains
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  domainsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  domainCard: {
    width: (width - 42) / 2,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  domainSymbol: {
    fontSize: 32,
    marginBottom: 8,
  },
  domainName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 3,
  },
  domainNameAr: {
    fontSize: 13,
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
  hadithSource: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '600',
  },
});
