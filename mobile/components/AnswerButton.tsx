import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { IslamicIcon } from './IslamicIcon';
import { COLORS } from '../constants/colors';

type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect';

interface Props {
  label: string;
  text: string;
  state?: AnswerState;
  onPress: () => void;
  disabled?: boolean;
}

export default function AnswerButton({ label, text, state = 'default', onPress, disabled }: Props) {
  const containerStyle = [
    styles.container,
    state === 'correct' && styles.correct,
    state === 'incorrect' && styles.incorrect,
    state === 'selected' && styles.selected,
  ];

  const labelStyle = [
    styles.label,
    state === 'correct' && styles.labelCorrect,
    state === 'incorrect' && styles.labelIncorrect,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || state !== 'default'}
      activeOpacity={0.85}
    >
      <View style={labelStyle}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <Text style={styles.answerText}>{text}</Text>
      {state === 'correct' && (
        <IslamicIcon name="check-circle" size={22} color={COLORS.success} />
      )}
      {state === 'incorrect' && (
        <IslamicIcon name="close-circle" size={22} color={COLORS.error} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  correct: {
    borderColor: COLORS.success,
    backgroundColor: 'rgba(46,125,50,0.08)',
  },
  incorrect: {
    borderColor: COLORS.error,
    backgroundColor: 'rgba(198,40,40,0.08)',
  },
  selected: {
    borderColor: COLORS.primary,
  },
  label: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelCorrect: {
    backgroundColor: COLORS.success,
  },
  labelIncorrect: {
    backgroundColor: COLORS.error,
  },
  labelText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  answerText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});
