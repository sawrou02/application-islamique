import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { LIGUES } from '../../constants/islamic';
import { tournoisApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

interface Tournoi {
  id: string;
  nom: string;
  nom_ar: string;
  theme: string;
  description: string;
  date_debut: string;
  date_fin: string;
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

export default function TournoiScreen() {
  const { user } = useAuthStore();
  const [tournoi, setTournoi] = useState<Tournoi | null>(null);
  const [classement, setClassement] = useState<ClassementEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

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

  useEffect(() => { load(); }, []);

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

  const ligueColor = (id: string) => LIGUES.find(l => l.id === id)?.color || COLORS.textLight;
  const isRegistered = classement.some(c => c.user_id === user?.id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tournoi — Munafasa</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={COLORS.primary} size="large" />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
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
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
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
});
