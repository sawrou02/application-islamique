import { View, Text, StyleSheet } from 'react-native';
import { Question } from '../types';
import { COLORS } from '../constants/colors';

interface Props {
  question: Question;
  index?: number;
  total?: number;
}

export default function QuestionCard({ question, index, total }: Props) {
  return (
    <View style={styles.container}>
      {index !== undefined && total !== undefined && (
        <Text style={styles.counter}>Question {index + 1}/{total}</Text>
      )}
      <View style={styles.domainBadge}>
        <Text style={styles.domainText}>{question.domaine.toUpperCase()} • Niveau {question.niveau}</Text>
      </View>
      {question.texte_ar && (
        <Text style={styles.arabicText}>{question.texte_ar}</Text>
      )}
      <Text style={styles.frenchText}>{question.texte_fr}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  counter: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  domainBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(27,94,32,0.1)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  domainText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  arabicText: {
    fontSize: 20,
    color: COLORS.arabicText,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 30,
    marginBottom: 10,
  },
  frenchText: {
    fontSize: 17,
    color: COLORS.text,
    lineHeight: 24,
    fontWeight: '500',
  },
});
