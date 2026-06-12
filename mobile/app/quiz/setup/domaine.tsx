import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { QuizSetupShell, SelectCard } from '../../../components/QuizSetupShell';
import { useQuizSetupStore, SETUP_DOMAINS } from '../../../store/quizSetupStore';
import { COLORS } from '../../../constants/colors';
import { t } from '../../../i18n';

const { width } = Dimensions.get('window');
const CARD_W = (width - 16 * 2 - 12) / 2;

export default function StepDomaine() {
  const { setup_domaine, setDomaine } = useQuizSetupStore();

  const anims = useRef(SETUP_DOMAINS.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(55, anims.map(a =>
      Animated.spring(a, { toValue: 1, useNativeDriver: true, friction: 7, tension: 70 })
    )).start();
  }, []);

  return (
    <QuizSetupShell
      step={2} total={5}
      title={t('choisir_domaine')}
      titleAr="مجال العلم"
      subtitle="Sur quelle science voulez-vous être interrogé ?"
      canNext={!!setup_domaine}
      onNext={() => router.push('/quiz/setup/niveau')}
    >
      <View style={styles.grid}>
        {SETUP_DOMAINS.map((d, i) => (
          <Animated.View
            key={d.id}
            style={{
              opacity: anims[i],
              transform: [
                { scale: anims[i].interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
                { translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
              ],
              width: CARD_W,
            }}
          >
            <SelectCard
              selected={setup_domaine === d.id}
              accent={d.color}
              onPress={() => setDomaine(d.id)}
              style={{ minHeight: 140 }}
            >
              <Text style={[styles.icon, { color: d.color }]}>{d.icon}</Text>
              <Text style={styles.name}>{d.name}</Text>
              <Text style={styles.nameAr}>{d.nameAr}</Text>
              <Text style={styles.desc}>{d.desc}</Text>
            </SelectCard>
          </Animated.View>
        ))}
      </View>
    </QuizSetupShell>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  icon: { fontSize: 34, marginBottom: 6 },
  name: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  nameAr: { fontSize: 12, color: COLORS.arabicText, marginTop: 2 },
  desc: { fontSize: 11, color: COLORS.textSecondary, marginTop: 5, lineHeight: 15 },
});
