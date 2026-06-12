import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { QuizSetupShell } from '../../../components/QuizSetupShell';
import {
  useQuizSetupStore, SETUP_MODES, SETUP_DOMAINS, SETUP_LEVELS,
} from '../../../store/quizSetupStore';
import { COLORS } from '../../../constants/colors';
import { t } from '../../../i18n';

export default function StepRecap() {
  const s = useQuizSetupStore();
  const mode = SETUP_MODES.find(m => m.id === s.setup_mode);
  const domain = SETUP_DOMAINS.find(d => d.id === s.setup_domaine);
  const level = s.setup_niveau === 'mixte'
    ? { name: 'Mixte', nameAr: 'متنوع' }
    : SETUP_LEVELS.find(l => l.id === s.setup_niveau);

  const showFiqh = mode && mode.id !== 'quotidien' && mode.id !== 'murajaah';

  const lines: { label: string; value: string; icon: string; color?: string }[] = [];
  if (mode) lines.push({ label: 'Mode', value: `${mode.name} (${mode.nameAr})`, icon: mode.icon, color: mode.color });
  if (showFiqh && domain) lines.push({ label: 'Domaine', value: `${domain.name} (${domain.nameAr})`, icon: domain.icon, color: domain.color });
  if (showFiqh && level) lines.push({ label: 'Niveau', value: `${level.name} · ${level.nameAr}`, icon: '◆' });
  if (showFiqh && s.setup_nb) lines.push({ label: 'Questions', value: `${s.setup_nb}`, icon: '#' });

  return (
    <QuizSetupShell
      step={5} total={5}
      title="Récapitulatif"
      titleAr="ملخّص"
      subtitle="Vérifiez vos choix avant de commencer."
      canNext={!!mode}
      nextLabel={t('commencer_quiz')}
      onNext={() => router.push('/quiz/setup/countdown')}
    >
      <View style={styles.card}>
        <Text style={styles.bismi}>﷽</Text>
        {lines.map((l, i) => (
          <View key={i} style={[styles.row, i < lines.length - 1 && styles.rowBorder]}>
            <View style={[styles.iconBox, { backgroundColor: (l.color || '#1B5E20') + '15' }]}>
              <Text style={[styles.icon, { color: l.color || '#1B5E20' }]}>{l.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lbl}>{l.label}</Text>
              <Text style={styles.val}>{l.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.foot}>Bismillah · Qu'Allah facilite votre apprentissage</Text>
    </QuizSetupShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface, borderRadius: 24, padding: 18,
    borderWidth: 1.5, borderColor: '#FFD70055',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
  },
  bismi: {
    fontSize: 30, textAlign: 'center', color: COLORS.arabicText,
    marginBottom: 12, marginTop: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#EEE' },
  iconBox: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: 20, fontWeight: '700' },
  lbl: { fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '700' },
  val: { fontSize: 15, color: COLORS.text, fontWeight: '700', marginTop: 2 },
  foot: {
    marginTop: 18, textAlign: 'center', color: COLORS.textSecondary,
    fontSize: 12, fontStyle: 'italic',
  },
});
