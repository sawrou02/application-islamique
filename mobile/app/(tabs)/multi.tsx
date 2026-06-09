import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
            <IslamicIcon name="add" size={36} color={COLORS.gold} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Créer une salle</Text>
            <Text style={styles.cardTitleAr}>إنشاء غرفة</Text>
            <Text style={styles.cardDesc}>Invitez vos frères à jouer ensemble</Text>
          </View>
          <IslamicIcon name="next" size={22} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        {/* Join Room */}
        <View style={styles.joinCard}>
          <View style={styles.joinHeader}>
            <IslamicIcon name="enter" size={24} color={COLORS.primary} />
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

        <Text style={styles.sectionTitle}>Autres modes</Text>

        {/* Duel 1v1 temps réel */}
        <TouchableOpacity
          style={styles.navCard}
          onPress={() => router.push('/multi/duel')}
          activeOpacity={0.85}
        >
          <Text style={styles.navIcon}>⚔️</Text>
          <View style={styles.navTextContainer}>
            <Text style={styles.navTitle}>Duel 1 vs 1 — Mubara'a</Text>
            <Text style={styles.navDesc}>Affronte un ami en temps réel</Text>
          </View>
          <IslamicIcon name="next" size={20} color={COLORS.textLight} />
        </TouchableOpacity>

        {/* Tournoi */}
        <TouchableOpacity
          style={styles.navCard}
          onPress={() => router.push('/multi/tournoi')}
          activeOpacity={0.85}
        >
          <Text style={styles.navIcon}>🏆</Text>
          <View style={styles.navTextContainer}>
            <Text style={styles.navTitle}>Tournoi — Munafasa</Text>
            <Text style={styles.navDesc}>Compétition hebdomadaire & classement par ligue</Text>
          </View>
          <IslamicIcon name="next" size={20} color={COLORS.textLight} />
        </TouchableOpacity>

        {/* Halaqat */}
        <TouchableOpacity
          style={styles.navCard}
          onPress={() => router.push('/multi/halaqat')}
          activeOpacity={0.85}
        >
          <Text style={styles.navIcon}>🕌</Text>
          <View style={styles.navTextContainer}>
            <Text style={styles.navTitle}>Mode Halaqat</Text>
            <Text style={styles.navDesc}>Cercle d'étude pour enseignants & élèves</Text>
          </View>
          <IslamicIcon name="next" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
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
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary, marginTop: 8, marginBottom: 10, textTransform: 'uppercase' },
  navCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  navIcon: { fontSize: 28 },
  navTextContainer: { flex: 1 },
  navTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  navDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
});
