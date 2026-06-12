import { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert,
  Modal, Animated, Easing,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import { LIGUES } from '../../constants/islamic';
import { tournoisApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useProgressionStore } from '../../store/progressionStore';

interface Tournoi {
  id: string;
  nom: string;
  nom_ar: string;
  theme: string;
  description: string;
  date_debut: string;
  date_fin: string;
}

interface TournoiPublic extends Tournoi {
  nb_participants: number;
}

interface ClassementEntry {
  rang: number;
  user_id: string;
  pseudo: string;
  pays: string;
  points: number;
  xp_total: number;
  ligue: { id: string; nom: string; nom_ar: string };
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Terminé';
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${sec.toString().padStart(2, '0')}s`;
}

export default function TournoiScreen() {
  const { user } = useAuthStore();
  const { data: progression, load: loadProgression } = useProgressionStore();
  useEffect(() => { loadProgression(); }, []);
  const canTournament = progression?.can_tournament ?? false;
  const [tournoi, setTournoi] = useState<Tournoi | null>(null);
  const [classement, setClassement] = useState<ClassementEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  // Tournoi public mondial
  const [publicTournoi, setPublicTournoi] = useState<TournoiPublic | null>(null);
  const [publicClassement, setPublicClassement] = useState<ClassementEntry[]>([]);
  const [publicRegistered, setPublicRegistered] = useState(false);
  const [joiningPublic, setJoiningPublic] = useState(false);
  const [showPublicClass, setShowPublicClass] = useState(false);
  const [now, setNow] = useState(Date.now());

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.04, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const load = async () => {
    try {
      const tRes = await tournoisApi.getActif();
      const t = tRes.data.data;
      setTournoi(t);
      const cRes = await tournoisApi.getClassement(t.id);
      setClassement(cRes.data.data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger le tournoi.');
    } finally {
      setLoading(false);
    }
  };

  const loadPublic = async () => {
    try {
      const pRes = await tournoisApi.getPublicActif();
      const p = pRes.data.data;
      setPublicTournoi(p);
      if (p) {
        const cRes = await tournoisApi.classementPublic();
        setPublicClassement(cRes.data.data);
        setPublicRegistered(cRes.data.data.some(c => c.user_id === user?.id));
      }
    } catch {
      // silencieux : tournoi public optionnel
    }
  };

  useEffect(() => { load(); loadPublic(); }, []);

  const handleJoin = async () => {
    if (!tournoi) return;
    setJoining(true);
    try {
      await tournoisApi.join(tournoi.id);
      Alert.alert('Inscription confirmée', 'Vos points de quiz compteront pour ce tournoi inshāAllāh !');
      await load();
    } catch {
      Alert.alert('Erreur', 'Inscription impossible.');
    } finally {
      setJoining(false);
    }
  };

  const handleJoinPublic = async () => {
    setJoiningPublic(true);
    try {
      await tournoisApi.rejoindrePublic();
      Alert.alert('Bienvenue !', 'Vous êtes inscrit au Tournoi Mondial du jour.');
      await loadPublic();
    } catch {
      Alert.alert('Erreur', 'Inscription impossible.');
    } finally {
      setJoiningPublic(false);
    }
  };

  const openPublicClass = async () => {
    try {
      const cRes = await tournoisApi.classementPublic();
      setPublicClassement(cRes.data.data);
    } catch {}
    setShowPublicClass(true);
  };

  const ligueColor = (id: string) => LIGUES.find(l => l.id === id)?.color || COLORS.textLight;
  const isRegistered = classement.some(c => c.user_id === user?.id);

  const remainingMs = publicTournoi ? new Date(publicTournoi.date_fin).getTime() - now : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IslamicIcon name="back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tournoi — Munafasa</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={COLORS.primary} size="large" />
      ) : !canTournament ? (
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedIcon}>🔒</Text>
          <Text style={styles.lockedTitle}>Tournoi verrouillé</Text>
          <Text style={styles.lockedTitleAr}>التورنوي مغلق</Text>
          <Text style={styles.lockedText}>
            Pour participer au tournoi, vous devez atteindre le niveau 5 (100%) dans les 6 domaines.
          </Text>
          <View style={styles.progressGrid}>
            {progression && Object.entries(progression.domains).map(([d, p]) => {
              const lv5 = p.levels[5];
              const done = lv5?.completed;
              return (
                <View key={d} style={[styles.progressChip, done && styles.progressChipDone]}>
                  <Text style={[styles.progressChipText, done && { color: '#FFF' }]}>
                    {done ? '✓ ' : ''}{d}
                  </Text>
                  {!done && lv5 && (
                    <Text style={styles.progressChipSub}>{lv5.answered}/{lv5.total} N5</Text>
                  )}
                </View>
              );
            })}
          </View>
          <Text style={styles.lockedHint}>
            Vous pouvez toujours jouer entre amis dans les salons privés.
          </Text>
          <TouchableOpacity style={styles.lockedBtn} onPress={() => router.replace('/multi/room')}>
            <Text style={styles.lockedBtnText}>Créer un salon privé</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {publicTournoi && (
            <Animated.View style={[styles.publicCard, { transform: [{ scale: pulse }] }]}>
              <Text style={styles.publicBadge}>TOURNOI MONDIAL DU JOUR</Text>
              <Text style={styles.publicIcon}>🌍</Text>
              <Text style={styles.publicNom}>{publicTournoi.nom}</Text>
              {publicTournoi.theme && (
                <Text style={styles.publicTheme}>Thème : {publicTournoi.theme}</Text>
              )}
              <Text style={styles.publicCountdown}>{formatCountdown(remainingMs)}</Text>
              <Text style={styles.publicParticipants}>
                {publicTournoi.nb_participants} participant{publicTournoi.nb_participants > 1 ? 's' : ''}
              </Text>
              {!publicRegistered ? (
                <TouchableOpacity
                  style={[styles.publicBtn, joiningPublic && styles.disabled]}
                  onPress={handleJoinPublic}
                  disabled={joiningPublic}
                >
                  <Text style={styles.publicBtnText}>{joiningPublic ? '...' : 'Rejoindre'}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.publicBtnAlt} onPress={openPublicClass}>
                  <Text style={styles.publicBtnAltText}>Voir le classement</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          )}

          {tournoi && (
            <View style={styles.tournoiCard}>
              <Text style={styles.tournoiIcon}>🏆</Text>
              <Text style={styles.tournoiNom}>{tournoi.nom}</Text>
              <Text style={styles.tournoiNomAr}>{tournoi.nom_ar}</Text>
              <Text style={styles.tournoiDesc}>{tournoi.description}</Text>
              <Text style={styles.tournoiDates}>
                Du {tournoi.date_debut} au {tournoi.date_fin}
              </Text>
              {!isRegistered && (
                <TouchableOpacity
                  style={[styles.joinBtn, joining && styles.disabled]}
                  onPress={handleJoin}
                  disabled={joining}
                >
                  <Text style={styles.joinBtnText}>{joining ? '...' : "S'inscrire au tournoi"}</Text>
                </TouchableOpacity>
              )}
              {isRegistered && (
                <View style={styles.registeredBadge}>
                  <IslamicIcon name="check-circle" size={16} color={COLORS.success} />
                  <Text style={styles.registeredText}>Inscrit</Text>
                </View>
              )}
            </View>
          )}

          <Text style={styles.sectionTitle}>Classement</Text>
          {classement.length === 0 && (
            <Text style={styles.empty}>Aucun participant pour l'instant. Soyez le premier !</Text>
          )}
          {classement.map((c) => (
            <View
              key={c.user_id}
              style={[styles.row, c.user_id === user?.id && styles.rowMe]}
            >
              <Text style={styles.rang}>{c.rang}</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.pseudo}>{c.pseudo}</Text>
                <View style={[styles.ligueChip, { backgroundColor: ligueColor(c.ligue.id) }]}>
                  <Text style={styles.ligueText}>{c.ligue.nom}</Text>
                </View>
              </View>
              <Text style={styles.points}>{c.points} pts</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={showPublicClass} animationType="slide" onRequestClose={() => setShowPublicClass(false)}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setShowPublicClass(false)} style={styles.backBtn}>
              <IslamicIcon name="back" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Classement mondial</Text>
          </View>
          <ScrollView contentContainerStyle={styles.scroll}>
            {publicClassement.length === 0 && (
              <Text style={styles.empty}>Aucun participant inscrit.</Text>
            )}
            {publicClassement.map((c) => (
              <View key={c.user_id} style={[styles.row, c.user_id === user?.id && styles.rowMe]}>
                <Text style={styles.rang}>{c.rang}</Text>
                <View style={styles.rowInfo}>
                  <Text style={styles.pseudo}>{c.pseudo}</Text>
                  <View style={[styles.ligueChip, { backgroundColor: ligueColor(c.ligue.id) }]}>
                    <Text style={styles.ligueText}>{c.ligue.nom}</Text>
                  </View>
                </View>
                <Text style={styles.points}>{c.points} pts</Text>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.primary, padding: 16,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  loader: { marginTop: 60 },
  scroll: { padding: 16, paddingBottom: 40 },

  publicCard: {
    backgroundColor: COLORS.gold || '#D4AF37',
    borderRadius: 18, padding: 20, alignItems: 'center', marginBottom: 20,
    shadowColor: '#D4AF37', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
  },
  publicBadge: {
    fontSize: 11, fontWeight: 'bold', color: '#FFFFFF',
    letterSpacing: 1.5, marginBottom: 4,
  },
  publicIcon: { fontSize: 38, marginBottom: 4 },
  publicNom: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center' },
  publicTheme: { fontSize: 13, color: '#3a3a3a', marginTop: 4, fontStyle: 'italic' },
  publicCountdown: {
    fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginTop: 10,
    fontVariant: ['tabular-nums'],
  },
  publicParticipants: { fontSize: 13, color: '#2a2a2a', marginTop: 6, fontWeight: '600' },
  publicBtn: {
    backgroundColor: '#1a1a1a', borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 32, marginTop: 14,
  },
  publicBtnText: { color: '#FFD700', fontWeight: 'bold', fontSize: 16 },
  publicBtnAlt: {
    backgroundColor: '#FFFFFF', borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 24, marginTop: 14,
  },
  publicBtnAltText: { color: '#1a1a1a', fontWeight: 'bold', fontSize: 14 },

  tournoiCard: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 20,
    borderLeftWidth: 4, borderLeftColor: COLORS.gold,
  },
  tournoiIcon: { fontSize: 40, marginBottom: 8 },
  tournoiNom: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  tournoiNomAr: { fontSize: 16, color: COLORS.arabicText, marginTop: 2 },
  tournoiDesc: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8 },
  tournoiDates: { fontSize: 12, color: COLORS.textLight, marginTop: 8 },
  joinBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 28, marginTop: 14,
  },
  joinBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  disabled: { opacity: 0.6 },
  registeredBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  registeredText: { color: COLORS.success, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  empty: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', textAlign: 'center', marginTop: 12 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 12,
    padding: 12, marginBottom: 8, gap: 12,
  },
  rowMe: { borderWidth: 2, borderColor: COLORS.primary },
  rang: { fontSize: 16, fontWeight: 'bold', color: COLORS.textSecondary, width: 28, textAlign: 'center' },
  rowInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  pseudo: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  ligueChip: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  ligueText: { fontSize: 10, fontWeight: 'bold', color: '#FFFFFF' },
  points: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },

  lockedContainer: { padding: 24, alignItems: 'center' },
  lockedIcon: { fontSize: 64, marginTop: 20 },
  lockedTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginTop: 12 },
  lockedTitleAr: { fontSize: 16, color: COLORS.arabicText, marginTop: 4 },
  lockedText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 16, lineHeight: 20 },
  progressGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 20 },
  progressChip: {
    backgroundColor: COLORS.surface, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: '#DDD', alignItems: 'center', minWidth: 90,
  },
  progressChipDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  progressChipText: { fontSize: 13, fontWeight: '700', color: COLORS.text, textTransform: 'capitalize' },
  progressChipSub: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
  lockedHint: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 24, fontStyle: 'italic' },
  lockedBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 16,
  },
  lockedBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});
