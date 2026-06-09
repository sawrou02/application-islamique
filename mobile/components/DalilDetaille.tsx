import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { COLORS } from '../constants/colors';
import { IslamicIcon } from './IslamicIcon';
import { Question } from '../types';
import { getCurrentLang, t } from '../i18n';

/**
 * pickText — sélectionne la version EN si la langue courante est 'en' et qu'elle
 * existe, sinon retombe sur la version FR. L'arabe reste affiché à part.
 */
export function pickText(
  question: Question,
  field: 'verset' | 'hadith' | 'parole_savant' | 'explication',
): string {
  const lang = getCurrentLang();
  switch (field) {
    case 'verset': {
      const en = question.verset_en;
      const fr = question.verset_fr;
      return (lang === 'en' && en) ? en : (fr || '');
    }
    case 'hadith': {
      const en = question.hadith_texte_en;
      const fr = question.hadith_texte_fr;
      return (lang === 'en' && en) ? en : (fr || '');
    }
    case 'parole_savant': {
      const en = question.parole_savant_en;
      const fr = question.parole_savant_texte;
      return (lang === 'en' && en) ? en : (fr || '');
    }
    case 'explication': {
      const en = question.explication_en;
      const fr = question.explication_detaillee || question.explication;
      return (lang === 'en' && en) ? en : (fr || '');
    }
  }
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  question: Question;
  initialOpen?: boolean;
}

export function DalilDetaille({ question, initialOpen = false }: Props) {
  const [open, setOpen] = useState(initialOpen);

  const versetText = pickText(question, 'verset');
  const hadithText = pickText(question, 'hadith');
  const savantText = pickText(question, 'parole_savant');
  const explicationText = pickText(question, 'explication');

  const hasCoran = !!(question.verset_ar || versetText || question.verset_ref);
  const hasHadith = !!(question.hadith_texte_ar || hadithText || question.hadith_ref);
  const hasSavant = !!(savantText || question.parole_savant_ref);
  const hasExplication = !!explicationText;
  const hasLegacyDalil = !!(question.dalil_texte_ar || question.dalil_texte_fr || question.dalil_ref);

  if (!hasCoran && !hasHadith && !hasSavant && !hasExplication && !hasLegacyDalil) {
    return null;
  }

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(o => !o);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={toggle} style={styles.header}>
        <IslamicIcon name="book" size={18} color={COLORS.gold} />
        <Text style={styles.headerTitle}>{getCurrentLang() === 'en' ? 'Detailed Dalil' : getCurrentLang() === 'ar' ? 'الدليل التفصيلي' : 'Dalil détaillé'}</Text>
        <View style={{ flex: 1 }} />
        <IslamicIcon name={open ? 'up' : 'down'} size={16} color={COLORS.primary} />
      </Pressable>

      {open && (
        <View style={styles.body}>
          {hasCoran && (
            <Section
              icon="book"
              title={t('verset_coran')}
              ar={question.verset_ar}
              fr={versetText}
              source={question.verset_ref}
              type="verset"
            />
          )}
          {hasHadith && (
            <Section
              icon="quiz"
              title={t('hadith_label')}
              ar={question.hadith_texte_ar}
              fr={hadithText}
              source={question.hadith_ref}
              type="hadith"
            />
          )}
          {hasSavant && (
            <Section
              icon="profile"
              title={t('parole_savants')}
              fr={savantText}
              source={question.parole_savant_ref}
              type="savant"
            />
          )}
          {hasExplication && (
            <Section
              icon="info"
              title={t('explication')}
              fr={explicationText}
              type="explication"
            />
          )}
          {!hasCoran && !hasHadith && !hasSavant && !hasExplication && hasLegacyDalil && (
            <Section
              icon="book"
              title="Source"
              ar={question.dalil_texte_ar}
              fr={question.dalil_texte_fr}
              source={question.dalil_ref}
              type="verset"
            />
          )}
        </View>
      )}
    </View>
  );
}

interface SectionProps {
  icon: string;
  title: string;
  ar?: string;
  fr?: string;
  source?: string;
  type: 'verset' | 'hadith' | 'savant' | 'explication';
}

/**
 * Parse source string — format: "Rapporté par X | Collection Y | Grade Z"
 * Falls back to displaying source as-is if no pipe separator.
 */
function parseSource(source: string, type: string): { narrator?: string; collection: string; grade?: string } {
  if (source.includes(' | ')) {
    const parts = source.split(' | ');
    if (type === 'hadith') {
      return { narrator: parts[0], collection: parts[1] || '', grade: parts[2] };
    }
    return { collection: parts[0], grade: parts[1] };
  }
  return { collection: source };
}

function GradeChip({ grade }: { grade: string }) {
  const isSahih = grade.toLowerCase().includes('sahih') || grade.toLowerCase().includes('صحيح');
  const isHasan = grade.toLowerCase().includes('hasan') || grade.toLowerCase().includes('حسن');
  const color = isSahih ? '#1B5E20' : isHasan ? '#E65100' : COLORS.textSecondary;
  const bg = isSahih ? '#E8F5E9' : isHasan ? '#FFF3E0' : '#F5F5F5';
  return (
    <View style={[styles.gradeChip, { backgroundColor: bg, borderColor: color }]}>
      <Text style={[styles.gradeText, { color }]}>{grade}</Text>
    </View>
  );
}

function Section({ icon, title, ar, fr, source: refStr, type }: SectionProps) {
  const lang = getCurrentLang();
  const isAr = lang === 'ar';

  const parsed = refStr ? parseSource(refStr, type) : null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <IslamicIcon name={icon} size={14} color={COLORS.gold} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {ar && <Text style={styles.ar}>{ar}</Text>}
      {!isAr && fr && <Text style={styles.fr}>{ar ? `« ${fr} »` : fr}</Text>}

      {parsed && (
        <View style={styles.sourceBlock}>
          {parsed.narrator && (
            <View style={styles.narratorRow}>
              <Text style={styles.narratorIcon}>◉</Text>
              <Text style={styles.narratorText}>{parsed.narrator}</Text>
            </View>
          )}
          <View style={styles.refRow}>
            <Text style={styles.refText}>— {parsed.collection}</Text>
            {parsed.grade && <GradeChip grade={parsed.grade} />}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: 'rgba(27,94,32,0.06)',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  body: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 10,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  ar: {
    fontSize: 17,
    color: COLORS.arabicText,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 28,
    marginBottom: 8,
    fontWeight: '500',
  },
  fr: {
    fontSize: 13.5,
    color: COLORS.text,
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  sourceBlock: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 8,
    gap: 4,
  },
  narratorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  narratorIcon: {
    fontSize: 10,
    color: COLORS.primary,
  },
  narratorText: {
    fontSize: 12.5,
    color: COLORS.primary,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  refText: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  gradeChip: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  gradeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
});

export default DalilDetaille;
