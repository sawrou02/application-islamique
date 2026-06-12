import { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';
import { ADHKAR_CATEGORIES } from '../../data/adhkar';

export default function AdhkarCategory() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lang = getCurrentLang();
  const isAr = lang === 'ar';
  const category = useMemo(() => ADHKAR_CATEGORIES.find(c => c.id === id), [id]);
  const [counts, setCounts] = useState<Record<number, number>>({});

  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{isAr ? 'فئة غير موجودة' : 'Catégorie introuvable'}</Text>
      </SafeAreaView>
    );
  }

  const name = isAr ? category.name_ar : lang === 'en' ? category.name_en : category.name_fr;

  const tap = (idx: number, max: number) => {
    setCounts(prev => {
      const cur = prev[idx] || 0;
      if (cur >= max) return { ...prev, [idx]: 0 };
      return { ...prev, [idx]: cur + 1 };
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IslamicIcon name="back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.icon}>{category.icon}</Text>
        <Text style={styles.headerTitle}>{name}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {category.dhikrs.map((dh, i) => {
          const count = counts[i] || 0;
          const done = count >= dh.count;
          return (
            <View key={i} style={[styles.card, done && styles.cardDone]}>
              <Text style={styles.dhikrAr}>{dh.ar}</Text>
              {dh.translit && !isAr && (
                <Text style={styles.dhikrTranslit}>{dh.translit}</Text>
              )}
              {!isAr && (
                <Text style={styles.dhikrTrad}>
                  {lang === 'en' && dh.en ? dh.en : dh.fr}
                </Text>
              )}
              <Text style={styles.source}>📖 {dh.source}</Text>

              <Pressable
                onPress={() => tap(i, dh.count)}
                style={({ pressed }) => [
                  styles.counter,
                  done && styles.counterDone,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={[styles.counterText, done && { color: '#FFF' }]}>
                  {done ? '✓ ' : ''}{count} / {dh.count}
                </Text>
                <Text style={[styles.counterHint, done && { color: '#FFFFFFAA' }]}>
                  {done
                    ? (isAr ? 'تم — اضغط للبدء من جديد' : lang === 'en' ? 'Done — tap to reset' : 'Terminé — tape pour recommencer')
                    : (isAr ? 'اضغط للعدّ' : lang === 'en' ? 'Tap to count' : 'Tape pour compter')}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 14,
  },
  backBtn: { padding: 4 },
  icon: { fontSize: 22 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#FFF', flex: 1 },
  errorText: { padding: 40, textAlign: 'center', color: COLORS.textSecondary },
  card: {
    backgroundColor: COLORS.surface, padding: 16, borderRadius: 14,
    marginBottom: 14, borderWidth: 1, borderColor: COLORS.border,
  },
  cardDone: { borderColor: COLORS.success, backgroundColor: COLORS.success + '0F' },
  dhikrAr: {
    fontSize: 21, color: COLORS.arabicText, textAlign: 'right',
    writingDirection: 'rtl', lineHeight: 38, fontWeight: '600',
  },
  dhikrTranslit: { fontSize: 13, color: COLORS.primary, marginTop: 8, fontStyle: 'italic' },
  dhikrTrad: { fontSize: 13, color: COLORS.text, marginTop: 8, lineHeight: 20 },
  source: { fontSize: 11, color: COLORS.textLight, marginTop: 8 },
  counter: {
    marginTop: 14, backgroundColor: COLORS.primary + '15',
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.primary + '40',
  },
  counterDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  counterText: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
  counterHint: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
});
