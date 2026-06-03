import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface Props {
  dalil_texte_ar?: string;
  dalil_texte_fr?: string;
  dalil_ref?: string;
  explication?: string;
  savant_reference?: string;
  grade_hadith?: string;
}

export default function DalilCard({
  dalil_texte_ar, dalil_texte_fr, dalil_ref,
  explication, savant_reference, grade_hadith,
}: Props) {
  if (!dalil_texte_ar && !dalil_texte_fr && !explication) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerLabel}>📜 Dalil</Text>
        {grade_hadith && (
          <View style={styles.gradeBadge}>
            <Text style={styles.gradeText}>{grade_hadith}</Text>
          </View>
        )}
      </View>

      {dalil_texte_ar && (
        <Text style={styles.arabicText}>{dalil_texte_ar}</Text>
      )}

      {dalil_texte_fr && (
        <Text style={styles.frenchText}>"{dalil_texte_fr}"</Text>
      )}

      {dalil_ref && (
        <Text style={styles.reference}>— {dalil_ref}</Text>
      )}

      {explication && (
        <View style={styles.explicContainer}>
          <Text style={styles.explicLabel}>Explication</Text>
          <Text style={styles.explicText}>{explication}</Text>
        </View>
      )}

      {savant_reference && (
        <Text style={styles.savantRef}>Ref : {savant_reference}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(27,94,32,0.07)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  gradeBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  gradeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  arabicText: {
    fontSize: 17,
    color: COLORS.arabicText,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 26,
    marginBottom: 8,
  },
  frenchText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: 6,
    lineHeight: 19,
  },
  reference: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
    marginBottom: 4,
  },
  explicContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(27,94,32,0.2)',
  },
  explicLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  explicText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  savantRef: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 6,
    fontStyle: 'italic',
  },
});
