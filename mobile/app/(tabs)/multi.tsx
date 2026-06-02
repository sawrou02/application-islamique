import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useGameStore } from '../../store/gameStore';
import { useAuthStore } from '../../store/authStore';

export default function MultiScreen() {
  const [code, setCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const { createRoom, joinRoom, connectSocket } = useGameStore();
  const { user } = useAuthStore();

  const handleCreate = async () => {
    if (!user) return;
    setIsCreating(true);
    try {
      const room = await createRoom({
        nb_questions: 10,
        temps_par_question: 30,
        mode: 'prive',
      });
      connectSocket(room.id, user.id);
      router.push({ pathname: '/multi/room', params: { roomId: room.id } });
    } catch {
      Alert.alert('Erreur', 'Impossible de créer la salle');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoin = async () => {
    if (!user || !code.trim()) {
      Alert.alert('Erreur', 'Entrez un code de salle');
      return;
    }
    setIsJoining(true);
    try {
      const room = await joinRoom(code.trim());
      connectSocket(room.id, user.id);
      router.push({ pathname: '/multi/room', params: { roomId: room.id } });
    } catch {
      Alert.alert('Salle introuvable', 'Vérifiez le code et réessayez');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ</Text>
          <Text style={styles.title}>Mode Multijoueur</Text>
          <Text style={styles.titleAr}>وضع اللعب الجماعي</Text>
        </View>

        {/* Create Room */}
        <TouchableOpacity
          style={[styles.createCard, isCreating && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={isCreating}
          activeOpacity={0.85}
        >
          <View style={styles.cardIconContainer}>
            <Ionicons name="add-circle" size={40} color={COLORS.gold} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Créer une salle</Text>
            <Text style={styles.cardTitleAr}>إنشاء غرفة</Text>
            <Text style={styles.cardDesc}>Invitez vos frères à jouer ensemble</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        {/* Join Room */}
        <View style={styles.joinCard}>
          <View style={styles.joinHeader}>
            <Ionicons name="enter" size={24} color={COLORS.primary} />
            <View style={styles.joinTextContainer}>
              <Text style={styles.joinTitle}>Rejoindre une salle</Text>
              <Text style={styles.joinTitleAr}>الانضمام لغرفة</Text>
            </View>
          </View>
          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={setCode}
            placeholder="Entrez le code à 6 chiffres"
            placeholderTextColor={COLORS.textLight}
            keyboardType="number-pad"
            maxLength={6}
          />
          <TouchableOpacity
            style={[styles.joinButton, isJoining && styles.buttonDisabled]}
            onPress={handleJoin}
            disabled={isJoining}
            activeOpacity={0.85}
          >
            <Text style={styles.joinButtonText}>
              {isJoining ? 'Connexion...' : 'Rejoindre'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mode Halaqat Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🕌</Text>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Mode Halaqat</Text>
            <Text style={styles.infoDesc}>
              Apprenez ensemble en groupe, comme dans les cercles de connaissance islamique traditionnels.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: 20 },
  header: { alignItems: 'center', marginBottom: 28, paddingTop: 8 },
  bismillah: { fontSize: 16, color: COLORS.primary, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  titleAr: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  createCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 14,
  },
  buttonDisabled: { opacity: 0.6 },
  cardIconContainer: { width: 48, alignItems: 'center' },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' },
  cardTitleAr: { fontSize: 13, color: COLORS.gold, marginTop: 2 },
  cardDesc: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 3 },
  joinCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  joinHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  joinTextContainer: {},
  joinTitle: { fontSize: 17, fontWeight: 'bold', color: COLORS.text },
  joinTitleAr: { fontSize: 13, color: COLORS.textSecondary },
  codeInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 12,
    letterSpacing: 4,
  },
  joinButton: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  joinButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  infoCard: {
    backgroundColor: 'rgba(27,94,32,0.07)',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(27,94,32,0.15)',
  },
  infoIcon: { fontSize: 28 },
  infoTextContainer: { flex: 1 },
  infoTitle: { fontSize: 15, fontWeight: '600', color: COLORS.primary, marginBottom: 4 },
  infoDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
});
