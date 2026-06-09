import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { QuizSetupShell, SelectCard } from '../../../components/QuizSetupShell';
import { useQuizSetupStore, SETUP_LEVELS, madhabApplicable } from '../../../store/quizSetupStore';
import { COLORS } from '../../../constants/colors';
import { t } from '../../../i18n';

export default function StepNiveau() {
  const { setup_niveau, setNiveau, setup_domaine } = useQuizSetupStore();

  const anims = useRef([...SETUP_LEVELS, { id: 'mixte' }].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(50, anims.map(a =>
      Animated.spring(a, { toValue: 1, useNativeDriver: true, friction: 7, tension: 70 })
    )).start();
  }, []);

  const handleNext = () => {
    if (setup_niveau === null) return;
    if (madhabApplicable(setup_domaine)) {
      router.push('/quiz/setup/madhab');
    } else {
      router.push('/quiz/setup/questions');
    }
  };

  return (
    <QuizSetupShell
      step={3} total={6}
      title={t('choisir_niveau')}
      titleAr="مستوى الصعوبة"
      subtitle="Adaptons les questions à votre maîtrise."
      canNext={setup_niveau !== null}
      onNext={handleNext}
    >
      <View style={{ gap: 10 }}>
        {SETUP_LEVELS.map((lv, i) => (
          <Animated.View
            key={lv.id}
            style={{
              opacity: anims[i],
              transform: [
                { translateX: anims[i].interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) },
              ],
            }}
          >
            <SelectCard
              selected={setup_niveau === lv.id}
              accent="#FFD700"
              onPress={() => setNiveau(lv.id)}
            >
              <View style={styles.row}>
                <View style={styles.numBadge}>
                  <Text style={styles.numTxt}>{lv.id}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{lv.name}  <Text style={styles.descInline}>· {lv.desc}</Text></Text>
                  <Text style={styles.nameAr}>{lv.nameAr}</Text>
                </View>
              </View>
            </SelectCard>
          </Animated.View>
        ))}

        <Animated.View
          style={{
            opacity: anims[5],
            transform: [{ translateX: anims[5].interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) }],
          }}
        >
          <SelectCard
            selected={setup_niveau === 'mixte'}
            accent="#1B5E20"
            onPress={() => setNiveau('mixte')}
          >
            <View style={styles.row}>
              <View style={[styles.numBadge, { backgroundColor: '#1B5E2010' }]}>
                <Text style={[styles.numTxt, { color: COLORS.primary }]}>✦</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>Mixte</Text>
                <Text style={styles.nameAr}>متنوع · Tous niveaux confondus</Text>
              </View>
            </View>
          </SelectCard>
        </Animated.View>
      </View>
    </QuizSetupShell>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  numBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FFF7CC', borderWidth: 1.5, borderColor: '#FFD700',
    alignItems: 'center', justifyContent: 'center',
  },
  numTxt: { fontSize: 18, fontWeight: '900', color: '#8A6D00' },
  name: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  descInline: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  nameAr: { fontSize: 12, color: COLORS.arabicText, marginTop: 2 },
});
