import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../constants/colors';
import { DOMAINS, MOTIVATION_HADITHS, LEVELS } from '../../constants/islamic';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [hadithIndex] = useState(Math.floor(Math.random() * MOTIVATION_HADITHS.length));
  const hadith = MOTIVATION_HADITHS[hadithIndex];
  const level = LEVELS.find(l => l.id === (user?.niveau || 1)) || LEVELS[0];

  const xpForNextLevel = [0, 500, 2000, 5000, 10000, 20000, 999999];
  const currentXp = user?.xp_total || 0;
  const nextXp = xpForNextLevel[(user?.niveau || 1)];
  const prevXp = xpForNextLevel[(user?.niveau || 1) - 1];
  const progress = nextXp === 999999 ? 1 : (currentXp - prevXp) / (nextXp - prevXp);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.bismillah}>بِسْمِ اللَّهِ</Text>
            <Text style={styles.greeting}>Assalamu 'Alaikum,</Text>
            <Text style={styles.pseudo}>{user?.pseudo || 'Frère/Sœur'} 👋</Text>
          </View>
          <View style={styles.levelBadgeContainer}>
            <View style={[styles.levelBadge, { backgroundColor: level.color }]}>
              <Text style={styles.levelText}>{level.nameAr}</Text>
              <Text style={styles.levelTextFr}>{level.name}</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="star" size={20} color={COLORS.gold} />
            <Text style={styles.statValue}>{currentXp}</Text>
            <Text style={styles.statLabel}>XP Total</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={20} color={COLORS.error} />
            <Text style={styles.statValue}>{user?.streak_days || 0}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={20} color={COLORS.primary} />
            <Text style={styles.statValue}>{user?.niveau || 1}/6</Text>
            <Text style={styles.statLabel}>Niveau</Text>
          </View>
        </View>

        {/* XP Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progression vers {LEVELS[(user?.niveau || 1)]?.name || 'Mufti'}</Text>
            <Text style={styles.progressXp}>{currentXp} / {nextXp === 999999 ? '∞' : nextXp} XP</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
          </View>
        </View>

        {/* Daily Challenge */}
        <TouchableOpacity
          style={styles.dailyCard}
          onPress={() => router.push({ pathname: '/quiz/[mode]', params: { mode: 'quotidien' } })}
          activeOpacity={0.85}
        >
          <View style={styles.dailyLeft}>
            <Text style={styles.dailyIcon}>🌅</Text>
            <View>
              <Text style={styles.dailyTitle}>Défi Quotidien</Text>
              <Text style={styles.dailySubtitle}>التحدي اليومي</Text>
              <Text style={styles.dailyDesc}>5 questions • Renouvellement quotidien</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gold} />
        </TouchableOpacity>

        {/* Hadith du jour */}
        <View style={styles.hadithCard}>
          <Text style={styles.hadithLabel}>Hadith du Jour</Text>
          <Text style={styles.hadithAr}>{hadith.textAr}</Text>
          <Text style={styles.hadithFr}>"{hadith.text}"</Text>
          <Text style={styles.hadithSource}>— {hadith.source}</Text>
        </View>

        {/* Domains Grid */}
        <Text style={styles.sectionTitle}>Choisir un domaine</Text>
        <View style={styles.domainsGrid}>
          {DOMAINS.map((domain) => (
            <TouchableOpacity
              key={domain.id}
              style={[styles.domainCard, { borderLeftColor: domain.color }]}
              onPress={() => router.push({
                pathname: '/(tabs)/quiz',
                params: { presetDomain: domain.id },
              })}
              activeOpacity={0.8}
            >
              <Text style={styles.domainIcon}>{domain.icon}</Text>
              <View style={styles.domainTextContainer}>
                <Text style={styles.domainName}>{domain.name}</Text>
                <Text style={styles.domainNameAr}>{domain.nameAr}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 16, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
  },
  bismillah: { fontSize: 14, color: COLORS.gold, marginBottom: 4 },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  pseudo: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  levelBadgeContainer: { alignItems: 'flex-end' },
  levelBadge: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  levelText: { fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' },
  levelTextFr: { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textSecondary },
  progressContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13, color: COLORS.textSecondary },
  progressXp: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  progressBar: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  dailyCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dailyLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  dailyIcon: { fontSize: 32 },
  dailyTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  dailySubtitle: { fontSize: 13, color: COLORS.gold },
  dailyDesc: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  hadithCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
  },
  hadithLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textLight, textTransform: 'uppercase', marginBottom: 8 },
  hadithAr: { fontSize: 16, color: COLORS.arabicText, textAlign: 'right', writingDirection: 'rtl', marginBottom: 8, lineHeight: 24 },
  hadithFr: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', marginBottom: 6 },
  hadithSource: { fontSize: 11, color: COLORS.textLight },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  domainsGrid: { gap: 8 },
  domainCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  domainIcon: { fontSize: 24, width: 32, textAlign: 'center' },
  domainTextContainer: { flex: 1 },
  domainName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  domainNameAr: { fontSize: 13, color: COLORS.textSecondary, marginTop: 1 },
});
