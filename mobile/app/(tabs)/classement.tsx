import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { LEVELS } from '../../constants/islamic';
import { leaderboardApi } from '../../services/api';
import { LeaderboardEntry } from '../../types';
import { useAuthStore } from '../../store/authStore';

const TYPES = ['global', 'national', 'amis'];
const PERIODS = ['Cette semaine', 'Ce mois', 'Tout temps'];
const PERIOD_VALUES = ['weekly', 'monthly', 'alltime'];

function MedalIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Text style={styles.medal}>🥇</Text>;
  if (rank === 2) return <Text style={styles.medal}>🥈</Text>;
  if (rank === 3) return <Text style={styles.medal}>🥉</Text>;
  return <Text style={styles.rankNum}>{rank}</Text>;
}

export default function ClassementScreen() {
  const [type, setType] = useState('global');
  const [periodIndex, setPeriodIndex] = useState(2);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [type, periodIndex]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await leaderboardApi.getLeaderboard({
        type,
        period: PERIOD_VALUES[periodIndex],
      });
      setEntries(response.data.data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelColor = (niveau: number) => {
    return LEVELS.find(l => l.id === niveau)?.color || COLORS.textSecondary;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Classement</Text>
        <Text style={styles.titleAr}>الترتيب</Text>
      </View>

      {/* Type toggles */}
      <View style={styles.toggleRow}>
        {TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.toggleBtn, type === t && styles.toggleBtnActive]}
            onPress={() => setType(t)}
          >
            <Text style={[styles.toggleText, type === t && styles.toggleTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Period toggles */}
      <View style={styles.periodRow}>
        {PERIODS.map((p, i) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodBtn, periodIndex === i && styles.periodBtnActive]}
            onPress={() => setPeriodIndex(i)}
          >
            <Text style={[styles.periodText, periodIndex === i && styles.periodTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {entries.slice(0, 3).length === 3 && (
            <View style={styles.podium}>
              {/* 2nd */}
              <View style={[styles.podiumItem, styles.podiumSecond]}>
                <Text style={styles.podiumPseudo} numberOfLines={1}>{entries[1]?.pseudo}</Text>
                <View style={[styles.podiumBase, { height: 60, backgroundColor: COLORS.silver }]}>
                  <Text style={styles.podiumRank}>2</Text>
                </View>
              </View>
              {/* 1st */}
              <View style={[styles.podiumItem, styles.podiumFirst]}>
                <Text style={styles.podiumPseudo} numberOfLines={1}>{entries[0]?.pseudo}</Text>
                <View style={[styles.podiumBase, { height: 80, backgroundColor: COLORS.gold }]}>
                  <Text style={styles.podiumRank}>1</Text>
                </View>
              </View>
              {/* 3rd */}
              <View style={[styles.podiumItem, styles.podiumThird]}>
                <Text style={styles.podiumPseudo} numberOfLines={1}>{entries[2]?.pseudo}</Text>
                <View style={[styles.podiumBase, { height: 45, backgroundColor: COLORS.bronze }]}>
                  <Text style={styles.podiumRank}>3</Text>
                </View>
              </View>
            </View>
          )}

          {entries.map((entry) => {
            const isMe = entry.user_id === user?.id;
            return (
              <View key={entry.user_id} style={[styles.entryRow, isMe && styles.entryRowMe]}>
                <View style={styles.rankContainer}>
                  <MedalIcon rank={entry.rank} />
                </View>
                <View style={styles.entryInfo}>
                  <Text style={[styles.entryPseudo, isMe && styles.entryPseudoMe]}>
                    {entry.pseudo} {isMe ? '(Vous)' : ''}
                  </Text>
                  <View style={styles.entryMeta}>
                    {entry.pays && <Text style={styles.entryPays}>{entry.pays}</Text>}
                    <View style={[styles.levelDot, { backgroundColor: getLevelColor(entry.niveau) }]} />
                    <Text style={styles.entryStreak}>🔥 {entry.streak_days}j</Text>
                  </View>
                </View>
                <View style={styles.entryXp}>
                  <Text style={styles.xpValue}>{entry.xp_total.toLocaleString()}</Text>
                  <Text style={styles.xpLabel}>XP</Text>
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
  header: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  titleAr: { fontSize: 14, color: COLORS.textSecondary },
  toggleRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 8, gap: 8 },
  toggleBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 10,
    backgroundColor: COLORS.surface, alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  toggleBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  toggleText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  toggleTextActive: { color: '#FFFFFF' },
  periodRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, gap: 6 },
  periodBtn: { flex: 1, paddingVertical: 6, borderRadius: 8, backgroundColor: COLORS.surface, alignItems: 'center' },
  periodBtnActive: { backgroundColor: 'rgba(27,94,32,0.12)' },
  periodText: { fontSize: 11, color: COLORS.textSecondary },
  periodTextActive: { color: COLORS.primary, fontWeight: '600' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  podium: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 20, gap: 8 },
  podiumItem: { alignItems: 'center', flex: 1 },
  podiumFirst: {},
  podiumSecond: {},
  podiumThird: {},
  podiumPseudo: { fontSize: 11, color: COLORS.text, marginBottom: 4, fontWeight: '600', textAlign: 'center' },
  podiumBase: { width: '100%', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  podiumRank: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  entryRow: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 12,
  },
  entryRowMe: { borderWidth: 2, borderColor: COLORS.primary },
  rankContainer: { width: 36, alignItems: 'center' },
  medal: { fontSize: 22 },
  rankNum: { fontSize: 16, fontWeight: 'bold', color: COLORS.textSecondary },
  entryInfo: { flex: 1 },
  entryPseudo: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  entryPseudoMe: { color: COLORS.primary },
  entryMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 },
  entryPays: { fontSize: 12, color: COLORS.textSecondary },
  levelDot: { width: 8, height: 8, borderRadius: 4 },
  entryStreak: { fontSize: 12, color: COLORS.textSecondary },
  entryXp: { alignItems: 'flex-end' },
  xpValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  xpLabel: { fontSize: 11, color: COLORS.textLight },
});
