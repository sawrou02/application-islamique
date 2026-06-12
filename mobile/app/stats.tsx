import { useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgressionStore, getLevelStat, isLevelUnlocked } from '../store/progressionStore';
import { COLORS } from '../constants/colors';
import { getCurrentLang } from '../i18n';

const DOMAINS = ['fiqh', 'aqida', 'tafsir', 'hadith', 'sirah', 'akhlaq'] as const;

const DOMAIN_NAMES: Record<string, { fr: string; ar: string; en: string }> = {
  fiqh:   { fr: 'Fiqh',   ar: 'الفقه',    en: 'Fiqh' },
  aqida:  { fr: 'Aqida',  ar: 'العقيدة',  en: 'Aqida' },
  tafsir: { fr: 'Tafsir', ar: 'التفسير',  en: 'Tafsir' },
  hadith: { fr: 'Hadith', ar: 'الحديث',   en: 'Hadith' },
  sirah:  { fr: 'Sirah',  ar: 'السيرة',   en: 'Sirah' },
  akhlaq: { fr: 'Akhlaq', ar: 'الأخلاق',  en: 'Akhlaq' },
};

const LEVEL_NAMES = ['Novice', 'Intermédiaire', 'Avancé', 'Expert', 'Maître'];

export default function StatsScreen() {
  const { data, loading, load } = useProgressionStore();
  const lang = getCurrentLang();

  useEffect(() => {
    load();
  }, []);

  // Compute global totals
  let totalAnswered = 0;
  let totalQuestions = 0;
  if (data) {
    for (const domain of DOMAINS) {
      for (let lvl = 1; lvl <= 5; lvl++) {
        const stat = getLevelStat(data, domain, lvl);
        totalAnswered += stat.answered;
        totalQuestions += stat.total || 30;
      }
    }
  }

  const canTournament = data?.can_tournament ?? false;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerFr}>Statistiques</Text>
          <Text style={styles.headerAr}>إحصاءات</Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Section: Résumé global */}
          <Text style={styles.sectionTitle}>Résumé global</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{totalAnswered}</Text>
                <Text style={styles.summaryLabel}>Réponses données</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{totalQuestions}</Text>
                <Text style={styles.summaryLabel}>Total questions</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0}%
                </Text>
                <Text style={styles.summaryLabel}>Complété</Text>
              </View>
            </View>
            <View style={[styles.tournamentChip, canTournament ? styles.chipGreen : styles.chipRed]}>
              <Text style={styles.chipText}>
                {canTournament ? '✅ Tournoi débloqué' : '🔒 Tournoi verrouillé'}
              </Text>
            </View>
          </View>

          {/* Section: Progression par domaine */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Progression par domaine</Text>
          {DOMAINS.map((domain) => {
            const names = DOMAIN_NAMES[domain];
            const unlockedMax = data?.domains[domain]?.unlocked_max ?? 1;

            return (
              <View key={domain} style={styles.domainCard}>
                {/* Domain header */}
                <View style={styles.domainHeader}>
                  <Text style={styles.domainAr}>{names.ar}</Text>
                  <Text style={styles.domainFr}>{names.fr}</Text>
                  <View style={styles.unlockedBadge}>
                    <Text style={styles.unlockedText}>🔓 Niv. {unlockedMax}</Text>
                  </View>
                </View>

                {/* 5 mini progress bars */}
                <View style={styles.levelsRow}>
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const stat = getLevelStat(data, domain, lvl);
                    const unlocked = isLevelUnlocked(data, domain, lvl);
                    const total = stat.total || 30;
                    const answered = stat.answered || 0;
                    const pct = total > 0 ? answered / total : 0;

                    let barColor = '#E0E0E0';
                    if (!unlocked) {
                      barColor = '#E0E0E0';
                    } else if (stat.completed) {
                      barColor = '#2E7D32';
                    } else if (answered > 0) {
                      barColor = '#FFD700';
                    } else {
                      barColor = '#E0E0E0';
                    }

                    return (
                      <View key={lvl} style={styles.levelItem}>
                        <Text style={styles.levelName} numberOfLines={1}>{LEVEL_NAMES[lvl - 1]}</Text>
                        <View style={styles.miniBarBg}>
                          <View
                            style={[
                              styles.miniBarFill,
                              { width: `${Math.round(pct * 100)}%`, backgroundColor: barColor },
                            ]}
                          />
                        </View>
                        <Text style={styles.levelPct}>
                          {unlocked ? `${answered}/${total}` : '—'}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: { fontSize: 32, color: '#FFFFFF', fontWeight: '300', lineHeight: 36 },
  headerTitles: { alignItems: 'center' },
  headerFr: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  headerAr: { fontSize: 14, color: COLORS.gold },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 16, paddingBottom: 40 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },

  // Summary card
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  summaryLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },
  summaryDivider: { width: 1, height: 40, backgroundColor: COLORS.border },
  tournamentChip: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  chipGreen: { backgroundColor: '#E8F5E9' },
  chipRed: { backgroundColor: '#FFEBEE' },
  chipText: { fontSize: 14, fontWeight: '700', color: COLORS.text },

  // Domain card
  domainCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  domainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  domainAr: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  domainFr: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  unlockedBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  unlockedText: { fontSize: 11, color: '#2E7D32', fontWeight: '700' },

  levelsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  levelItem: {
    flex: 1,
    alignItems: 'center',
  },
  levelName: {
    fontSize: 8,
    color: COLORS.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  miniBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  levelPct: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 3,
    textAlign: 'center',
  },
});
