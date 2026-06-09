import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS } from '../constants/colors';

interface Props {
  step: number;
  total: number;
  title: string;
  titleAr?: string;
  subtitle?: string;
  children: ReactNode;
  canNext: boolean;
  onNext: () => void;
  nextLabel?: string;
  onBack?: () => void;
}

export function QuizSetupShell({
  step, total, title, titleAr, subtitle, children, canNext, onNext, nextLabel, onBack,
}: Props) {
  const pct = (step / total) * 100;
  const back = onBack || (() => router.back());
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={back} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>
        <View style={styles.stepBox}>
          <Text style={styles.stepTxt}>Étape {step}/{total}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%` }]} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {titleAr ? <Text style={styles.titleAr}>{titleAr}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, !canNext && styles.nextBtnDisabled]}
          disabled={!canNext}
          onPress={onNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextTxt}>{nextLabel || 'Suivant'}</Text>
          <Text style={styles.nextArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FDF8' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingTop: 4, paddingBottom: 6,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  backTxt: { fontSize: 28, color: COLORS.primary, lineHeight: 30, marginTop: -4 },
  stepBox: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14,
    backgroundColor: '#FFF7CC', borderWidth: 1, borderColor: '#FFD700',
  },
  stepTxt: { fontSize: 12, fontWeight: '700', color: '#8A6D00', letterSpacing: 0.5 },
  progressTrack: {
    height: 6, backgroundColor: '#E6F2E6', marginHorizontal: 16,
    borderRadius: 3, overflow: 'hidden', marginTop: 6,
  },
  progressFill: {
    height: '100%', backgroundColor: '#FFD700', borderRadius: 3,
  },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 6 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  titleAr: { fontSize: 15, color: COLORS.arabicText, marginTop: 4 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6, lineHeight: 18 },
  scroll: { padding: 16, paddingBottom: 24 },
  footer: {
    padding: 16, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: '#E6F2E6', backgroundColor: '#F8FDF8',
  },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, paddingVertical: 17, borderRadius: 20,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  nextBtnDisabled: {
    backgroundColor: '#B5C9B5', shadowOpacity: 0,
  },
  nextTxt: { color: '#FFFFFF', fontWeight: '800', fontSize: 16, letterSpacing: 0.3 },
  nextArrow: { color: '#FFD700', fontSize: 22, fontWeight: '700', marginTop: -2 },
});

interface CardProps {
  selected: boolean;
  accent?: string;
  onPress: () => void;
  children: ReactNode;
  style?: any;
}

export function SelectCard({ selected, accent = '#FFD700', onPress, children, style }: CardProps) {
  return (
    <TouchableOpacity
      style={[
        cardStyles.card,
        selected && { borderColor: accent, borderWidth: 3, backgroundColor: `${accent}12` },
        style,
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {children}
      {selected && (
        <View style={[cardStyles.check, { backgroundColor: accent }]}>
          <Text style={cardStyles.checkTxt}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface, borderRadius: 20, padding: 16,
    borderWidth: 1.5, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    position: 'relative',
  },
  check: {
    position: 'absolute', top: 10, right: 10,
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  checkTxt: { color: '#1B5E20', fontWeight: '900', fontSize: 14 },
});
