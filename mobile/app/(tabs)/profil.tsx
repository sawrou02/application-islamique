import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { ShareButton } from '../../components/ShareButton';
import { useAuthStore } from '../../store/authStore';
import { badgesApi, usersApi } from '../../services/api';
import { t, setLang, getCurrentLang, type Lang } from '../../i18n';
import { Badge } from '../../types';
import { COLORS } from '../../constants/colors';
import { LEVELS, DOMAINS } from '../../constants/islamic';
import { Switch } from 'react-native';
import {
  loadPrayerPrefs, savePrayerPrefs, schedulePrayerNotifications,
  PrayerPrefs, DEFAULT_PRAYER_PREFS,
} from '../../services/notifications';

export default function ProfilScreen() {
  const { user, logout, updateUser } = useAuthStore();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [currentLang, setCurrentLang] = useState<Lang>((user?.langue as Lang) || getCurrentLang());
  const [prayerPrefs, setPrayerPrefs] = useState<PrayerPrefs>(DEFAULT_PRAYER_PREFS);
  const lang = getCurrentLang();
  const isAr = lang === 'ar';

  const handleChangeLang = async (lang: Lang) => {
    setCurrentLang(lang);
    setLang(lang);
    try {
      const res = await usersApi.updateProfile({ langue: lang });
      if (res?.data?.data) updateUser(res.data.data);
    } catch {}
    Alert.alert(t('language_changed', lang), t('restart_required', lang), [{ text: t('ok', lang) }]);
  };

  const LANGS: { code: Lang; flag: string; name: string }[] = [
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'ar', flag: '🇸🇦', name: 'العربية' },
    { code: 'en', flag: '🇬🇧', name: 'English' },
  ];

  useEffect(() => {
    badgesApi.getMyBadges()
      .then(r => setBadges(r.data.data))
      .catch(() => {});
    loadPrayerPrefs().then(setPrayerPrefs);
  }, []);

  const handlePrayerToggle = async (key: keyof PrayerPrefs, value: boolean) => {
    const updated = { ...prayerPrefs, [key]: { ...prayerPrefs[key], enabled: value } };
    setPrayerPrefs(updated);
    await savePrayerPrefs(updated);
    await schedulePrayerNotifications(updated, lang).catch(() => {});
  };

  const level = LEVELS.find(l => l.id === (user?.niveau || 1)) || LEVELS[0];
  const xpThresholds = [0, 500, 2000, 5000, 10000, 20000, 999999];
  const currentXp = user?.xp_total || 0;
  const nextXp = xpThresholds[(user?.niveau || 1)];
  const prevXp = xpThresholds[(user?.niveau || 1) - 1];
  const progress = nextXp === 999999 ? 1 : Math.max(0, (currentXp - prevXp) / (nextXp - prevXp));

  const handleLogout = () => {
    Alert.alert(
      t('deconnexion'),
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: t('annuler'), style: 'cancel' },
        {
          text: t('deconnexion'),
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
            <Text style={styles.progressTitle}>{t('ma_progression')}</Text>
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
            <Text style={styles.sectionTitle}>{t('mes_badges')} ({badges.length})</Text>
            <View style={styles.badgesGrid}>
              {badges.map((badge) => (
                <View key={badge.id} style={styles.badgeItem}>
                  <View style={styles.badgeShareWrap}>
                    <ShareButton
                      compact
                      message={`J'ai débloqué le badge '${badge.nom}' sur Quiz Islamique ! 🏆 ${badge.description || ''}`}
                      url="https://quizislamique.app"
                    />
                  </View>
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
              <Text style={styles.infoLabel}>{t('langue')}</Text>
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

        {/* Langue / اللغة / Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Langue / اللغة / Language</Text>
          <View style={styles.langGrid}>
            {LANGS.map((l) => {
              const selected = currentLang === l.code;
              return (
                <TouchableOpacity
                  key={l.code}
                  style={[styles.langCard, selected && styles.langCardSelected]}
                  onPress={() => handleChangeLang(l.code)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.langFlag}>{l.flag}</Text>
                  <Text style={[styles.langName, selected && styles.langNameSelected]}>{l.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Rappels de prière */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isAr ? '🕌 تذكيرات الصلاة' : lang === 'en' ? '🕌 Prayer Reminders' : '🕌 Rappels de prière'}
          </Text>
          <View style={styles.infoCard}>
            {(Object.entries(prayerPrefs) as [keyof PrayerPrefs, PrayerPrefs[keyof PrayerPrefs]][]).map(([key, pref], i, arr) => {
              const names: Record<keyof PrayerPrefs, string> = {
                fajr:    isAr ? 'الفجر'  : lang === 'en' ? 'Fajr'    : 'Fajr',
                dhuhr:   isAr ? 'الظهر'  : lang === 'en' ? 'Dhuhr'   : 'Dhuhr',
                asr:     isAr ? 'العصر'  : lang === 'en' ? 'Asr'     : 'Asr',
                maghrib: isAr ? 'المغرب' : lang === 'en' ? 'Maghrib' : 'Maghrib',
                isha:    isAr ? 'العشاء' : lang === 'en' ? 'Isha'    : 'Isha',
              };
              const pad = (n: number) => String(n).padStart(2, '0');
              return (
                <View key={key}>
                  <View style={styles.prayerRow}>
                    <Text style={styles.prayerName}>{names[key]}</Text>
                    <Text style={styles.prayerTime}>{pad(pref.hour)}:{pad(pref.minute)}</Text>
                    <Switch
                      value={pref.enabled}
                      onValueChange={(v) => handlePrayerToggle(key, v)}
                      trackColor={{ false: COLORS.border, true: COLORS.primary }}
                      thumbColor={pref.enabled ? COLORS.gold : '#FFF'}
                    />
                  </View>
                  {i < arr.length - 1 && <View style={styles.divider} />}
                </View>
              );
            })}
          </View>
          <Text style={styles.prayerHint}>
            {isAr ? 'الأوقات تقريبية — عدّلها حسب منطقتك' : lang === 'en' ? 'Times are approximate — adjust to your location' : 'Horaires indicatifs — ajustez selon votre lieu'}
          </Text>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <IslamicIcon name="logout" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>{t('deconnexion')}</Text>
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
    position: 'relative',
  },
  badgeShareWrap: { position: 'absolute', top: 4, right: 4, zIndex: 2 },
  badgeIcon: { fontSize: 28, marginBottom: 4 },
  badgeName: { fontSize: 10, color: COLORS.textSecondary, textAlign: 'center' },
  infoCard: { backgroundColor: COLORS.surface, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  infoLabel: { flex: 1, fontSize: 14, color: COLORS.textSecondary },
  infoValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 14 },
  prayerRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12,
  },
  prayerName: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '600' },
  prayerTime: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500', minWidth: 40 },
  prayerHint: {
    fontSize: 11, color: COLORS.textSecondary, fontStyle: 'italic',
    marginTop: 8, textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 16, marginTop: 24, padding: 16,
    borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.error,
    gap: 8,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: COLORS.error },
  langGrid: { flexDirection: 'row', gap: 10 },
  langCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 14, padding: 14,
    alignItems: 'center', borderWidth: 2, borderColor: COLORS.border, gap: 6,
  },
  langCardSelected: { borderColor: COLORS.gold, backgroundColor: '#FFFBF0' },
  langFlag: { fontSize: 28 },
  langName: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  langNameSelected: { color: COLORS.text, fontWeight: '800' },
});
