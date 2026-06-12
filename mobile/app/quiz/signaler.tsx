import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';

const MOTIFS = [
  { id: 'dalil_incorrect', label: 'Dalil incorrect ou mal cité', icon: '📜' },
  { id: 'reponse_incorrecte', label: 'La bonne réponse semble fausse', icon: '❓' },
  { id: 'traduction_erronee', label: 'Erreur de traduction (AR/FR)', icon: '🌍' },
  { id: 'hors_manhaj', label: "Hors du manhaj Ahlu Sunna", icon: '⚠️' },
  { id: 'autre', label: 'Autre raison', icon: '💬' },
];

export default function SignalerScreen() {
  const { question_id, question_fr } = useLocalSearchParams<{ question_id: string; question_fr: string }>();
  const [selectedMotif, setSelectedMotif] = useState<string | null>(null);
  const [detail, setDetail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMotif) {
      Alert.alert('Attention', 'Veuillez choisir un motif de signalement.');
      return;
    }
    if (!question_id) {
      Alert.alert('Erreur', 'Question introuvable.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/signalements', {
        question_id,
        motif: selectedMotif,
        detail: detail.trim() || undefined,
      });

      Alert.alert(
        'JazakAllah Khayran',
        'Votre signalement a été enregistré. L\'équipe de validation islamique l\'examinera inshāAllāh.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch {
      Alert.alert('Erreur', 'Impossible d\'envoyer le signalement. Réessayez plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IslamicIcon name="back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Signaler une question</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Question preview */}
        {question_fr && (
          <View style={styles.questionPreview}>
            <Text style={styles.questionLabel}>Question signalée :</Text>
            <Text style={styles.questionText}>{question_fr}</Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>Motif du signalement</Text>
        {MOTIFS.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.motifCard, selectedMotif === m.id && styles.motifCardActive]}
            onPress={() => setSelectedMotif(m.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.motifIcon}>{m.icon}</Text>
            <Text style={[styles.motifLabel, selectedMotif === m.id && styles.motifLabelActive]}>
              {m.label}
            </Text>
            {selectedMotif === m.id && (
              <IslamicIcon name="check-circle" size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionLabel}>Précisions (optionnel)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Ex : Le hadith cité est Da'if selon Al-Albani..."
          placeholderTextColor={COLORS.textLight}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={detail}
          onChangeText={setDetail}
          maxLength={500}
        />
        <Text style={styles.charCount}>{detail.length}/500</Text>

        <View style={styles.noteCard}>
          <IslamicIcon name="info" size={18} color={COLORS.primary} style={styles.noteIcon} />
          <Text style={styles.noteText}>
            Tout signalement est examiné par le comité de validation islamique.
            Après 3 signalements, la question est automatiquement suspendue en attente de révision.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, (!selectedMotif || isLoading) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!selectedMotif || isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <IslamicIcon name="flag" size={18} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Envoyer le signalement</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  scroll: { padding: 16, paddingBottom: 40 },
  questionPreview: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  questionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textLight, textTransform: 'uppercase', marginBottom: 6 },
  questionText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10, marginTop: 4 },
  motifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  motifCardActive: { borderColor: COLORS.primary, backgroundColor: '#F1F8E9' },
  motifIcon: { fontSize: 20 },
  motifLabel: { flex: 1, fontSize: 14, color: COLORS.text },
  motifLabelActive: { color: COLORS.primary, fontWeight: '600' },
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 14,
    fontSize: 14,
    color: COLORS.text,
    minHeight: 100,
    marginBottom: 4,
  },
  charCount: { fontSize: 11, color: COLORS.textLight, textAlign: 'right', marginBottom: 16 },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  noteIcon: { marginTop: 1 },
  noteText: { flex: 1, fontSize: 12, color: COLORS.primary, lineHeight: 18 },
  submitBtn: {
    backgroundColor: COLORS.error,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
});
