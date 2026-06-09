import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { QuizSetupShell, SelectCard } from '../../../components/QuizSetupShell';
import { useQuizSetupStore, SETUP_LEVELS } from '../../../store/quizSetupStore';
import { useProgressionStore, getLevelStat, isLevelUnlocked } from '../../../store/progressionStore';
import { COLORS } from '../../../constants/colors';
import { t } from '../../../i18n';

export default function StepNiveau() {
  const { setup_niveau, setNiveau, setup_domaine } = useQuizSetupStore();
  const { data, load } = useProgressionStore();

  useEffect(() => { load(); }, []);

  const anims = useRef([...SETUP_LEVELS, { id: 'mixte' }].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(50, anims.map(a =>
      Animated.spring(a, { toValue: 1, useNativeDriver: true, friction: 7, tension: 70 })
    )).start();
  }, []);

  const canMixte = data?.can_mixte ?? false;

  const handleNext = () => {
    if (setup_niveau === null) return;
    router.push('/quiz/setup/questions');
  };

  const tryPickLevel = (id: number) => {
    if (!setup_domaine) { setNiveau(id); return; }
    if (!isLevelUnlocked(data, setup_domaine, id)) {
      const prev = id - 1;
      const stat = getLevelStat(data, setup_domaine, prev);
      Alert.alert(
        '🔒 Niveau verrouillé',
        `Terminez d'abord le niveau ${prev} à 100% (${stat.answered}/${stat.total} bonnes réponses).`
      );
      return;
    }
    setNiveau(id);
  };

  const tryPickMixte = () => {
    if (!canMixte) {
      Alert.alert('🔒 Mode mixte verrouillé', 'Atteignez le niveau 5 dans les 6 domaines pour débloquer le mode mixte.');
      return;
    }
    setNiveau('mixte');
  };

  return (
    <QuizSetupShell
      step={3} total={5}
      title={t('choisir_niveau')}
      titleAr="مستوى الصعوبة"
      subtitle="Adaptons les questions à votre maîtrise."
      canNext={setup_niveau !== null}
      onNext={handleNext}
    >
      <View style={{ gap: 10 }}>
        {SETUP_LEVELS.map((lv, i) => {
          const unlocked = !setup_domaine || isLevelUnlocked(data, setup_domaine, lv.id);
          const stat = setup_domaine ? getLevelStat(data, setup_domaine, lv.id) : null;
          return (
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
                accent={unlocked ? '#FFD700' : '#999'}
                onPress={() => tryPickLevel(lv.id)}
                style={!unlocked ? { opacity: 0.5 } : undefined}
              >
                <View style={styles.row}>
                  <View style={[styles.numBadge, !unlocked && { backgroundColor: '#EEE', borderColor: '#999' }]}>
                    <Text style={[styles.numTxt, !unlocked && { color: '#666' }]}>{unlocked ? lv.id : '🔒'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{lv.name}  <Text style={styles.descInline}>· {lv.desc}</Text></Text>
                    <Text style={styles.nameAr}>{lv.nameAr}</Text>
                    {stat && stat.total > 0 && (
                      <Text style={styles.progress}>{stat.answered}/{stat.total} {stat.completed ? '✓' : ''}</Text>
                    )}
                  </View>
                </View>
              </SelectCard>
            </Animated.View>
          );
        })}

        <Animated.View
          style={{
            opacity: anims[5],
            transform: [{ translateX: anims[5].interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) }],
          }}
        >
          <SelectCard
            selected={setup_niveau === 'mixte'}
            accent={canMixte ? '#1B5E20' : '#999'}
            onPress={tryPickMixte}
            style={!canMixte ? { opacity: 0.5 } : undefined}
          >
            <View style={styles.row}>
              <View style={[styles.numBadge, { backgroundColor: '#1B5E2010' }]}>
                <Text style={[styles.numTxt, { color: COLORS.primary }]}>{canMixte ? '✦' : '🔒'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>Mixte</Text>
                <Text style={styles.nameAr}>متنوع · Tous niveaux confondus</Text>
                {!canMixte && (
                  <Text style={styles.progress}>Atteignez le niveau 5 dans les 6 domaines</Text>
                )}
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
  progress: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4, fontWeight: '600' },
});
