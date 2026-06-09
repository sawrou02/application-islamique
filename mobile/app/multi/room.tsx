import { useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Share,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import { useGameStore } from '../../store/gameStore';
import { useAuthStore } from '../../store/authStore';
import { LEVELS } from '../../constants/islamic';

export default function RoomScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { room, players, status, startGame } = useGameStore();
  const { user } = useAuthStore();

  const isHost = room?.hote_id === user?.id;

  useEffect(() => {
    if (status === 'playing') {
      router.push('/multi/game');
    }
  }, [status]);

  const handleShare = () => {
    if (!room?.code_salle) return;
    Share.share({
      message: `Rejoins-moi sur Quiz Islamique ! Code de salle : ${room.code_salle}\n\nأطلق تطبيق Quiz Islamique وادخل الرمز: ${room.code_salle}`,
      title: 'Quiz Islamique - Code de salle',
    });
  };

  const handleStart = () => {
    if (players.length < 1) {
      Alert.alert('Erreur', "Attendez d'autres joueurs pour commencer");
      return;
    }
    startGame();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IslamicIcon name="back" size={30} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Salle de jeu</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Room Code */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Code de la salle</Text>
          <Text style={styles.codeValue}>{room?.code_salle || '------'}</Text>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.8}>
            <IslamicIcon name="share" size={18} color={COLORS.primary} />
            <Text style={styles.shareText}>Partager</Text>
          </TouchableOpacity>
        </View>

        {/* Players */}
        <View style={styles.playersSection}>
          <Text style={styles.sectionTitle}>Joueurs ({players.length})</Text>
          {players.map((player) => {
            const level = LEVELS.find(l => l.id === player.niveau) || LEVELS[0];
            return (
              <View key={player.user_id} style={styles.playerRow}>
                <View style={[styles.playerAvatar, { backgroundColor: level.color }]}>
                  <Text style={styles.playerAvatarText}>{player.pseudo.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.pseudo}</Text>
                  <Text style={styles.playerLevel}>{level.name}</Text>
                </View>
                {player.user_id === room?.hote_id && (
                  <View style={styles.hostBadge}>
                    <Text style={styles.hostBadgeText}>Hôte</Text>
                  </View>
                )}
              </View>
            );
          })}
          {players.length === 0 && (
            <Text style={styles.waitingText}>En attente de joueurs...</Text>
          )}
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <IslamicIcon name="book" size={18} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Domaine</Text>
              <Text style={styles.settingValue}>{room?.config?.domaine || 'Tous'}</Text>
            </View>
            <View style={styles.settingRow}>
              <IslamicIcon name="layers" size={18} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Niveau</Text>
              <Text style={styles.settingValue}>{room?.config?.niveau || 'Mixte'}</Text>
            </View>
            <View style={styles.settingRow}>
              <IslamicIcon name="help" size={18} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Questions</Text>
              <Text style={styles.settingValue}>{room?.config?.nb_questions || 10}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {isHost && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
            activeOpacity={0.85}
          >
            <IslamicIcon name="play" size={20} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Commencer la partie</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isHost && (
        <View style={styles.footer}>
          <View style={styles.waitingBanner}>
            <IslamicIcon name="time" size={20} color={COLORS.textSecondary} />
            <Text style={styles.waitingBannerText}>En attente du démarrage par l'hôte...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: COLORS.text },
  placeholder: { width: 32 },
  scroll: { padding: 16, paddingBottom: 100 },
  codeCard: {
    backgroundColor: COLORS.primary, borderRadius: 16, padding: 24,
    alignItems: 'center', marginBottom: 20,
  },
  codeLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  codeValue: {
    fontSize: 44, fontWeight: 'bold', color: COLORS.gold,
    letterSpacing: 6, marginBottom: 16,
  },
  shareButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20,
    paddingVertical: 8, paddingHorizontal: 16,
  },
  shareText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  playersSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
  playerRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: 12, padding: 12, marginBottom: 8, gap: 12,
  },
  playerAvatar: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  playerAvatarText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  playerLevel: { fontSize: 12, color: COLORS.textSecondary },
  hostBadge: { backgroundColor: COLORS.gold, borderRadius: 8, paddingVertical: 3, paddingHorizontal: 8 },
  hostBadgeText: { fontSize: 11, fontWeight: '600', color: COLORS.primaryDark },
  waitingText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', padding: 20 },
  settingsSection: { marginBottom: 20 },
  settingsCard: { backgroundColor: COLORS.surface, borderRadius: 12, overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  settingLabel: { flex: 1, fontSize: 14, color: COLORS.textSecondary },
  settingValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.surface },
  startButton: {
    backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  startButtonText: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' },
  waitingBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 14,
  },
  waitingBannerText: { fontSize: 14, color: COLORS.textSecondary },
});
