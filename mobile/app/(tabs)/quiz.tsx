import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { DOMAINS, MADHABS, QUIZ_MODES } from '../../constants/islamic';
import { useQuizStore } from '../../store/quizStore';
import { QuizConfig } from '../../types';

const LEVELS_OPTS = [
  { id: 1, label: 'Débutant', labelAr: 'مبتدئ' },
  { id: 2, label: 'Intermédiaire', labelAr: 'متوسط' },
  { id: 3, label: 'Avancé', labelAr: 'متقدم' },
  { id: 0, label: 'Mixte', labelAr: 'مختلط' },
];
const NB_QUESTIONS = [10, 20, 30];

export default function QuizSelection() {
  const params = useLocalSearchParams();
  const { startQuiz } = useQuizStore();

  const [selectedMode, setSelectedMode] = useState<string>('solo');
  const [selectedDomain, setSelectedDomain] = useState<string | undefined>(params.presetDomain as string | undefined);
  const [selectedNiveau, setSelectedNiveau] = useState<number>(0);
  const [selectedMadhab, setSelectedMadhab] = useState<string>('general');
  const [nbQuestions, setNbQuestions] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const config: QuizConfig = {
        mode: selectedMode as QuizConfig['mode'],
        domaine: selectedDomain as QuizConfig['domaine'],
        niveau: selectedNiveau === 0 ? 'mixte' : selectedNiveau,
        madhab: selectedMadhab as QuizConfig['madhab'],
        nb_questions: selectedMode === 'quotidien' ? 5 : nbQuestions,
        temps_par_question: 30,
      };
      await startQuiz(config);
      if (useQuizStore.getState().questions.length === 0) {
        Alert.alert(
          'Aucune question',
          selectedMode === 'murajaah'
            ? "Vous n'avez aucune erreur à réviser. Continuez à jouer pour en accumuler !"
            : 'Aucune question disponible pour ces critères.',
        );
        return;
      }
      router.push({ pathname: '/quiz/[mode]', params: { mode: selectedMode } });
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les questions. Vérifiez votre connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Choisir un Quiz</Text>
        <Text style={styles.titleAr}>اختر الاختبار</Text>

        {/* Mode Selection */}
        <Text style={styles.sectionLabel}>Mode de jeu</Text>
        <View style={styles.modesGrid}>
          {QUIZ_MODES.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.modeCard, selectedMode === mode.id && { borderColor: mode.color, borderWidth: 2.5 }]}
              onPress={() => setSelectedMode(mode.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.modeIcon}>{mode.icon}</Text>
              <Text style={styles.modeName}>{mode.name}</Text>
              <Text style={styles.modeDesc}>{mode.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Domain Selection */}
        <Text style={styles.sectionLabel}>Domaine</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.chip, !selectedDomain && styles.chipActive]}
            onPress={() => setSelectedDomain(undefined)}
          >
            <Text style={[styles.chipText, !selectedDomain && styles.chipTextActive]}>Tous</Text>
          </TouchableOpacity>
          {DOMAINS.map((d) => (
            <TouchableOpacity
              key={d.id}
              style={[styles.chip, selectedDomain === d.id && styles.chipActive]}
              onPress={() => setSelectedDomain(d.id)}
            >
              <Text style={styles.chipIcon}>{d.icon}</Text>
              <Text style={[styles.chipText, selectedDomain === d.id && styles.chipTextActive]}>
                {d.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Level Selection */}
        <Text style={styles.sectionLabel}>Niveau</Text>
        <View style={styles.row}>
          {LEVELS_OPTS.map((l) => (
            <TouchableOpacity
              key={l.id}
              style={[styles.chip, selectedNiveau === l.id && styles.chipActive]}
              onPress={() => setSelectedNiveau(l.id)}
            >
              <Text style={[styles.chipText, selectedNiveau === l.id && styles.chipTextActive]}>
                {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Madhab (if fiqh selected) */}
        {selectedDomain === 'fiqh' && (
          <>
            <Text style={styles.sectionLabel}>Madhab</Text>
            <View style={styles.row}>
              {MADHABS.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.chip, selectedMadhab === m.id && styles.chipActive]}
                  onPress={() => setSelectedMadhab(m.id)}
                >
                  <Text style={[styles.chipText, selectedMadhab === m.id && styles.chipTextActive]}>
                    {m.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Number of questions */}
        {selectedMode !== 'quotidien' && (
          <>
            <Text style={styles.sectionLabel}>Nombre de questions</Text>
            <View style={styles.row}>
              {NB_QUESTIONS.map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.chip, nbQuestions === n && styles.chipActive]}
                  onPress={() => setNbQuestions(n)}
                >
                  <Text style={[styles.chipText, nbQuestions === n && styles.chipTextActive]}>
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startButton, isLoading && styles.buttonDisabled]}
          onPress={handleStart}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <Ionicons name="play" size={20} color="#FFFFFF" style={styles.startIcon} />
          <Text style={styles.startButtonText}>
            {isLoading ? 'Chargement...' : 'Commencer le Quiz'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: 'bold', color: COLORS.text, marginBottom: 2 },
  titleAr: { fontSize: 16, color: COLORS.primary, marginBottom: 20 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginTop: 16, marginBottom: 8 },
  modesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  modeCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  modeIcon: { fontSize: 28, marginBottom: 6 },
  modeName: { fontSize: 13, fontWeight: 'bold', color: COLORS.text, marginBottom: 3 },
  modeDesc: { fontSize: 11, color: COLORS.textSecondary },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 4,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.text, fontWeight: '500' },
  chipTextActive: { color: '#FFFFFF' },
  chipIcon: { fontSize: 14 },
  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: { opacity: 0.6 },
  startIcon: {},
  startButtonText: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' },
});
