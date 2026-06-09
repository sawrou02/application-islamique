import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import { DOMAINS, MADHABS, QUIZ_MODES } from '../../constants/islamic';
import { useQuizStore } from '../../store/quizStore';
import { QuizConfig } from '../../types';

const LEVELS_OPTS = [
  { id: 1, label: 'Débutant', labelAr: 'مبتدئ', desc: 'Bases de l\'islam' },
  { id: 2, label: 'Initié', labelAr: 'مبتدئ متقدم', desc: 'Connaissances essentielles' },
  { id: 3, label: 'Intermédiaire', labelAr: 'متوسط', desc: 'Approfondissement' },
  { id: 4, label: 'Avancé', labelAr: 'متقدم', desc: 'Sciences islamiques' },
  { id: 5, label: 'Expert', labelAr: 'خبير', desc: 'Niveau savant' },
  { id: 0, label: 'Mixte', labelAr: 'مختلط', desc: 'Tous niveaux' },
];

const DOMAIN_DESC: Record<string, string> = {
  fiqh: 'Jurisprudence islamique',
  aqida: 'Croyance authentique',
  tafsir: 'Exégèse du Coran',
  hadith: 'Sciences du hadith',
  sirah: 'Vie du Prophète ﷺ',
  akhlaq: 'Comportement & éthique',
};
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

        {/* Domain Selection — riches cartes */}
        <Text style={styles.sectionLabel}>Domaine</Text>
        <View style={styles.domainGrid}>
          <TouchableOpacity
            style={[styles.domainRichCard, !selectedDomain && { borderColor: COLORS.primary, borderWidth: 2 }]}
            onPress={() => setSelectedDomain(undefined)}
            activeOpacity={0.85}
          >
            <Text style={styles.domainRichIcon}>۞</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.domainRichName}>Tous les domaines</Text>
              <Text style={styles.domainRichNameAr}>جميع المجالات</Text>
              <Text style={styles.domainRichDesc}>Toutes les sciences mélangées</Text>
            </View>
          </TouchableOpacity>
          {DOMAINS.map((d) => {
            const active = selectedDomain === d.id;
            return (
              <TouchableOpacity
                key={d.id}
                style={[
                  styles.domainRichCard,
                  { borderLeftColor: d.color, borderLeftWidth: 4 },
                  active && { borderColor: d.color, borderWidth: 2, backgroundColor: `${d.color}11` },
                ]}
                onPress={() => setSelectedDomain(d.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.domainRichIcon}>{d.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.domainRichName}>{d.name}</Text>
                  <Text style={styles.domainRichNameAr}>{d.nameAr}</Text>
                  <Text style={styles.domainRichDesc}>{DOMAIN_DESC[d.id] || ''}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Level Selection — barre de progression 1→5 */}
        <Text style={styles.sectionLabel}>Niveau de difficulté</Text>
        <View style={styles.levelTrack}>
          {LEVELS_OPTS.filter(l => l.id !== 0).map((l) => {
            const active = selectedNiveau === l.id;
            return (
              <TouchableOpacity
                key={l.id}
                style={styles.levelStep}
                onPress={() => setSelectedNiveau(l.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.levelDot, active && styles.levelDotActive]}>
                  <Text style={[styles.levelDotText, active && styles.levelDotTextActive]}>{l.id}</Text>
                </View>
                <Text style={[styles.levelStepLabel, active && styles.levelStepLabelActive]} numberOfLines={1}>
                  {l.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          style={[styles.levelMixte, selectedNiveau === 0 && styles.levelMixteActive]}
          onPress={() => setSelectedNiveau(0)}
          activeOpacity={0.85}
        >
          <Text style={[styles.levelMixteText, selectedNiveau === 0 && styles.levelMixteTextActive]}>
            ✦ Mixte — tous niveaux confondus
          </Text>
        </TouchableOpacity>

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
          <IslamicIcon name="play" size={20} color="#FFFFFF" style={styles.startIcon} />
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
  domainGrid: { gap: 8 },
  domainRichCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  domainRichIcon: { fontSize: 28, width: 36, textAlign: 'center' },
  domainRichName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  domainRichNameAr: { fontSize: 13, color: COLORS.arabicText, marginTop: 1 },
  domainRichDesc: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  levelTrack: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  levelStep: { alignItems: 'center', flex: 1, gap: 6 },
  levelDot: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.background,
    borderWidth: 1.5, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center',
  },
  levelDotActive: {
    backgroundColor: COLORS.primary, borderColor: COLORS.gold,
    shadowColor: COLORS.gold, shadowOpacity: 0.4, shadowRadius: 6, elevation: 4,
  },
  levelDotText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  levelDotTextActive: { color: COLORS.gold },
  levelStepLabel: { fontSize: 10, color: COLORS.textSecondary, textAlign: 'center' },
  levelStepLabelActive: { color: COLORS.primary, fontWeight: '700' },
  levelMixte: {
    marginTop: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: 'center',
  },
  levelMixteActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  levelMixteText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  levelMixteTextActive: { color: '#FFFFFF' },
});
