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

/**
 * DalilDetaille — Panneau "Dalil détaillé" cliquable qui s'expand
 * pour afficher 4 sections distinctes (Coran, Hadith, Savants, Explication).
 * Les sections vides sont automatiquement masquées.
 */
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
  // Fallback legacy (anciennes questions sans nouvelles colonnes)
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
        <Text style={styles.headerTitle}>{getCurrentLang() === 'en' ? 'Detailed Dalil' : 'Dalil détaillé'}</Text>
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
            />
          )}
          {hasHadith && (
            <Section
              icon="quiz"
              title={t('hadith_label')}
              ar={question.hadith_texte_ar}
              fr={hadithText}
              source={question.hadith_ref}
            />
          )}
          {hasSavant && (
            <Section
              icon="profile"
              title={t('parole_savants')}
              fr={savantText}
              source={question.parole_savant_ref}
            />
          )}
          {hasExplication && (
            <Section
              icon="info"
              title={t('explication')}
              fr={explicationText}
            />
          )}
          {!hasCoran && !hasHadith && !hasSavant && !hasExplication && hasLegacyDalil && (
            <Section
              icon="book"
              title={getCurrentLang() === 'en' ? 'Source' : 'Source'}
              ar={question.dalil_texte_ar}
              fr={question.dalil_texte_fr}
              source={question.dalil_ref}
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
}

function Section({ icon, title, ar, fr, source: refStr }: SectionProps) {
  const lang = getCurrentLang();
  const isAr = lang === 'ar';
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <IslamicIcon name={icon} size={14} color={COLORS.gold} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {ar && <Text style={styles.ar}>{ar}</Text>}
      {!isAr && fr && <Text style={styles.fr}>{ar ? `« ${fr} »` : fr}</Text>}
      {refStr && <Text style={styles.ref}>— {refStr}</Text>}
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
    marginBottom: 6,
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
    marginBottom: 6,
    fontWeight: '500',
  },
  fr: {
    fontSize: 13.5,
    color: COLORS.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  ref: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 6,
  },
});

export default DalilDetaille;
