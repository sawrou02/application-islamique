import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { DOMAINS, MADHABS, QUIZ_MODES } from '../../constants/islamic';
import { useQuizStore } from '../../store/quizStore';
import { QuizConfig } from '../../types';

const { width } = Dimensions.get('window');

const LEVELS_OPTS = [
  { id: 1, label: 'Débutant', labelAr: 'مبتدئ', desc: "Bases" },
  { id: 2, label: 'Initié', labelAr: 'متعلم', desc: "Essentiels" },
  { id: 3, label: 'Intermédiaire', labelAr: 'متوسط', desc: "Approfondi" },
  { id: 4, label: 'Avancé', labelAr: 'متقدم', desc: "Sciences" },
  { id: 5, label: 'Expert', labelAr: 'خبير', desc: "Savant" },
];

const DOMAIN_DESC: Record<string, string> = {
  fiqh: 'Jurisprudence islamique',
  aqida: 'Croyance authentique',
  tafsir: 'Exégèse du Coran',
  hadith: 'Sciences du hadith',
  sirah: 'Vie du Prophète ﷺ',
  akhlaq: 'Comportement & éthique',
};

const NB_QUESTIONS = [5, 10, 20, 30];

export default function QuizSelection() {
  const params = useLocalSearchParams();
  const { startQuiz } = useQuizStore();

  const [selectedMode, setSelectedMode] = useState<string>(
    (params.presetMode as string) || 'solo',
  );
  const [selectedDomain, setSelectedDomain] = useState<string | undefined>(
    (params.presetDomain as string) || undefined,
  );
  const [selectedNiveau, setSelectedNiveau] = useState<number>(0);
  const [selectedMadhab, setSelectedMadhab] = useState<string>('general');
  const [nbQuestions, setNbQuestions] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);

  // Sync when params change (e.g. navigating from home with presetDomain)
  useEffect(() => {
    if (params.presetDomain) {
      setSelectedDomain(params.presetDomain as string);
    }
    if (params.presetMode) {
      setSelectedMode(params.presetMode as string);
    }
  }, [params.presetDomain, params.presetMode]);

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

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choisir un Quiz</Text>
          <Text style={styles.titleAr}>اختر الاختبار</Text>
        </View>

        {/* ── Mode de jeu ── */}
        <Text style={styles.sectionLabel}>Mode de jeu</Text>
        <View style={styles.modesGrid}>
          {QUIZ_MODES.map((mode) => {
            const active = selectedMode === mode.id;
            return (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.modeCard,
                  active && { borderColor: mode.color, borderWidth: 2.5, backgroundColor: `${mode.color}10` },
                ]}
                onPress={() => setSelectedMode(mode.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.modeIcon}>{mode.icon}</Text>
                <Text style={[styles.modeName, active && { color: mode.color }]}>{mode.name}</Text>
                <Text style={styles.modeNameAr}>{mode.nameAr}</Text>
                <Text style={styles.modeDesc}>{mode.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Domaine ── */}
        <Text style={styles.sectionLabel}>Domaine</Text>
        <View style={styles.domainGrid}>
          {/* All domains option */}
          <TouchableOpacity
            style={[
              styles.domainCard,
              !selectedDomain && { borderColor: COLORS.primary, borderWidth: 2, backgroundColor: `${COLORS.primary}0D` },
            ]}
            onPress={() => setSelectedDomain(undefined)}
            activeOpacity={0.85}
          >
            <Text style={styles.domainCardIcon}>۞</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.domainCardName}>Tous les domaines</Text>
              <Text style={styles.domainCardNameAr}>جميع المجالات</Text>
              <Text style={styles.domainCardDesc}>Toutes les sciences mélangées</Text>
            </View>
            {!selectedDomain && <Text style={[styles.checkMark, { color: COLORS.primary }]}>✓</Text>}
          </TouchableOpacity>

          {DOMAINS.map((d) => {
            const active = selectedDomain === d.id;
            return (
              <TouchableOpacity
                key={d.id}
                style={[
                  styles.domainCard,
                  { borderLeftColor: d.color, borderLeftWidth: 4 },
                  active && { borderColor: d.color, borderWidth: 2, backgroundColor: `${d.color}0D` },
                ]}
                onPress={() => setSelectedDomain(d.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.domainCardIcon}>{d.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.domainCardName, active && { color: d.color }]}>{d.name}</Text>
                  <Text style={styles.domainCardNameAr}>{d.nameAr}</Text>
                  <Text style={styles.domainCardDesc}>{DOMAIN_DESC[d.id] || ''}</Text>
                </View>
                {active && <Text style={[styles.checkMark, { color: d.color }]}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Niveau ── */}
        <Text style={styles.sectionLabel}>Niveau de difficulté</Text>
        <View style={styles.levelRow}>
          {LEVELS_OPTS.map((l) => {
            const active = selectedNiveau === l.id;
            return (
              <TouchableOpacity
                key={l.id}
                style={[styles.levelDot, active && styles.levelDotActive]}
                onPress={() => setSelectedNiveau(l.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.levelDotNum, active && styles.levelDotNumActive]}>{l.id}</Text>
                <Text style={[styles.levelDotLabel, active && styles.levelDotLabelActive]} numberOfLines={1}>
                  {l.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          style={[styles.mixteBtn, selectedNiveau === 0 && styles.mixteBtnActive]}
          onPress={() => setSelectedNiveau(0)}
          activeOpacity={0.85}
        >
          <Text style={[styles.mixteBtnText, selectedNiveau === 0 && styles.mixteBtnTextActive]}>
            ✦ Mixte — tous niveaux confondus
          </Text>
        </TouchableOpacity>

        {/* ── Madhab (fiqh only) ── */}
        {selectedDomain === 'fiqh' && (
          <>
            <Text style={styles.sectionLabel}>Madhab</Text>
            <View style={styles.chipRow}>
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

        {/* ── Nombre de questions ── */}
        {selectedMode !== 'quotidien' && (
          <>
            <Text style={styles.sectionLabel}>Nombre de questions</Text>
            <View style={styles.chipRow}>
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

        {/* ── Bouton démarrer ── */}
        <TouchableOpacity
          style={[styles.startBtn, isLoading && { opacity: 0.6 }]}
          onPress={handleStart}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.startBtnIcon}>▶</Text>
          <Text style={styles.startBtnText}>
            {isLoading ? 'Chargement...' : 'Commencer le Quiz'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_W = (width - 42) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 16, paddingBottom: 48 },

  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: COLORS.text },
  titleAr: { fontSize: 15, color: COLORS.primary, marginTop: 2 },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 18,
    marginBottom: 10,
  },

  // Mode cards — 2-col grid
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  modeCard: {
    width: CARD_W,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 3,
  },
  modeIcon: { fontSize: 28, marginBottom: 4 },
  modeName: { fontSize: 13, fontWeight: 'bold', color: COLORS.text },
  modeNameAr: { fontSize: 11, color: COLORS.arabicText, marginBottom: 2 },
  modeDesc: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 15 },

  // Domain cards
  domainGrid: { gap: 8 },
  domainCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  domainCardIcon: { fontSize: 28, width: 36, textAlign: 'center' },
  domainCardName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  domainCardNameAr: { fontSize: 12, color: COLORS.arabicText, marginTop: 1 },
  domainCardDesc: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  checkMark: { fontSize: 20, fontWeight: 'bold' },

  // Level
  levelRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 4,
  },
  levelDot: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    borderRadius: 10,
  },
  levelDotActive: {
    backgroundColor: COLORS.primary,
  },
  levelDotNum: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  levelDotNumActive: { color: COLORS.gold },
  levelDotLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  levelDotLabelActive: { color: 'rgba(255,255,255,0.85)' },
  mixteBtn: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  mixteBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  mixteBtnText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  mixteBtnTextActive: { color: '#FFFFFF' },

  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.text, fontWeight: '500' },
  chipTextActive: { color: '#FFFFFF' },

  // Start button
  startBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  startBtnIcon: { fontSize: 16, color: COLORS.gold },
  startBtnText: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' },
});
