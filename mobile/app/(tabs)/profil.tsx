import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { useAuthStore } from '../../store/authStore';
import { badgesApi } from '../../services/api';
import { Badge } from '../../types';
import { COLORS } from '../../constants/colors';
import { LEVELS, DOMAINS } from '../../constants/islamic';

export default function ProfilScreen() {
  const { user, logout } = useAuthStore();
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    badgesApi.getMyBadges()
      .then(r => setBadges(r.data.data))
      .catch(() => {});
  }, []);

  const level = LEVELS.find(l => l.id === (user?.niveau || 1)) || LEVELS[0];
  const xpThresholds = [0, 500, 2000, 5000, 10000, 20000, 999999];
  const currentXp = user?.xp_total || 0;
  const nextXp = xpThresholds[(user?.niveau || 1)];
  const prevXp = xpThresholds[(user?.niveau || 1) - 1];
  const progress = nextXp === 999999 ? 1 : Math.max(0, (currentXp - prevXp) / (nextXp - prevXp));

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/* Islamic geometric avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarOuter}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarText}>{user?.pseudo?.charAt(0).toUpperCase() || '?'}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.pseudo}>{user?.pseudo}</Text>
          <View style={[styles.levelPill, { backgroundColor: level.color }]}>
            <Text style={styles.levelPillText}>{level.nameAr} • {level.name}</Text>
          </View>
          {user?.pays && <Text style={styles.pays}>{user.pays}</Text>}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentXp.toLocaleString()}</Text>
            <Text style={styles.statLabel}>XP Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.streak_days || 0}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.niveau || 1}</Text>
            <Text style={styles.statLabel}>Niveau</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{badges.length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progression</Text>
            <Text style={styles.progressXp}>{currentXp} / {nextXp === 999999 ? '∞' : nextXp} XP</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
          </View>
          <Text style={styles.progressNext}>
            Prochain niveau : {LEVELS[(user?.niveau || 1)]?.name || 'Max'}
          </Text>
        </View>

        {/* Badges */}
        {badges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Badges obtenus ({badges.length})</Text>
            <View style={styles.badgesGrid}>
              {badges.map((badge) => (
                <View key={badge.id} style={styles.badgeItem}>
                  <Text style={styles.badgeIcon}>{badge.icone || '🏅'}</Text>
                  <Text style={styles.badgeName} numberOfLines={2}>{badge.nom}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Madhab & Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <IslamicIcon name="book" size={18} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Madhab</Text>
              <Text style={styles.infoValue}>{user?.madhab || 'Général'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <IslamicIcon name="language" size={18} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Langue</Text>
              <Text style={styles.infoValue}>{user?.langue || 'fr'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <IslamicIcon name="mail" size={18} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <IslamicIcon name="logout" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: 40 },
  profileHeader: {
    backgroundColor: COLORS.primary,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: { marginBottom: 12 },
  avatarOuter: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 3, borderColor: COLORS.gold,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarInner: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,215,0,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: COLORS.gold },
  pseudo: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  levelPill: { borderRadius: 20, paddingVertical: 5, paddingHorizontal: 14, marginBottom: 6 },
  levelPillText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  pays: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  statsGrid: {
    flexDirection: 'row', backgroundColor: COLORS.surface,
    marginHorizontal: 16, marginTop: 16, borderRadius: 14,
    padding: 16, gap: 0,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  progressCard: {
    backgroundColor: COLORS.surface, borderRadius: 14, padding: 16,
    marginHorizontal: 16, marginTop: 12,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  progressXp: { fontSize: 13, color: COLORS.primary },
  progressBar: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  progressNext: { fontSize: 12, color: COLORS.textSecondary },
  section: { marginHorizontal: 16, marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeItem: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 12,
    alignItems: 'center', width: 80,
    borderWidth: 1, borderColor: COLORS.border,
  },
  badgeIcon: { fontSize: 28, marginBottom: 4 },
  badgeName: { fontSize: 10, color: COLORS.textSecondary, textAlign: 'center' },
  infoCard: { backgroundColor: COLORS.surface, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  infoLabel: { flex: 1, fontSize: 14, color: COLORS.textSecondary },
  infoValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 14 },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 16, marginTop: 24, padding: 16,
    borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.error,
    gap: 8,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: COLORS.error },
});
