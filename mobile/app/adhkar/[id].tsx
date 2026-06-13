import { useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Pressable, Dimensions, ViewToken,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';
import { ADHKAR_CATEGORIES, Dhikr } from '../../data/adhkar';

const { width } = Dimensions.get('window');

const CATEGORY_COLORS: Record<string, { accent: string; bg: string }> = {
  matin:        { accent: '#E65100', bg: '#FFF3E0' },
  soir:         { accent: '#4527A0', bg: '#EDE7F6' },
  apres_priere: { accent: '#1B5E20', bg: '#E8F5E9' },
  sommeil:      { accent: '#1A237E', bg: '#E8EAF6' },
  reveil:       { accent: '#F57F17', bg: '#FFFDE7' },
  avant_repas:  { accent: '#BF360C', bg: '#FBE9E7' },
  apres_repas:  { accent: '#004D40', bg: '#E0F2F1' },
  maison:       { accent: '#4E342E', bg: '#EFEBE9' },
  mosquee:      { accent: '#006064', bg: '#E0F7FA' },
  wc:           { accent: '#37474F', bg: '#ECEFF1' },
  voyage:       { accent: '#0D47A1', bg: '#E3F2FD' },
  detresse:     { accent: '#6A1B9A', bg: '#F3E5F5' },
  maladie:      { accent: '#C62828', bg: '#FFEBEE' },
  pluie:        { accent: '#01579B', bg: '#E1F5FE' },
  istikfar:     { accent: '#2E7D32', bg: '#E8F5E9' },
  salat_nabi:   { accent: '#827717', bg: '#F9FBE7' },
};

const SOURCE_NAMES: Record<string, string> = {
  'مسلم': 'Sahîh Muslim',
  'البخاري': 'Sahîh al-Bukhârî',
  'البخاري ومسلم': 'Bukhârî & Muslim',
  'متفق عليه': 'Bukhârî & Muslim',
  'أبو داود': 'Sunan Abî Dâwûd',
  'الترمذي': 'Sunan at-Tirmidhî',
  'أحمد': 'Musnad Ahmad',
  'ابن ماجة': 'Sunan Ibn Mâja',
  'ابن ماجه': 'Sunan Ibn Mâja',
  'النسائي': `Sunan an-Nasâ'i`,
  'أبن السني': 'Ibn as-Sunni',
  'الحاكم': 'Al-Mustadrak',
  'سورة الإخلاص': 'Sourate Al-Ikhlâs (112)',
  'سورة الناس': 'Sourate An-Nâs (114)',
  'سورة الفلق': 'Sourate Al-Falaq (113)',
  'سورة البقرة': 'Sourate Al-Baqara (2)',
  'آية الكرسي': 'Ayat Al-Kursî (2:255)',
};

function formatSource(src: string): string {
  return SOURCE_NAMES[src.trim()] || src;
}

function getAccent(id: string) {
  return CATEGORY_COLORS[id] || { accent: COLORS.primary, bg: '#E8F5E9' };
}

interface CardProps {
  dhikr: Dhikr;
  index: number;
  total: number;
  accent: string;
  cardBg: string;
  isAr: boolean;
  lang: string;
}

function DhikrCard({ dhikr, index, total, accent, cardBg, isAr, lang }: CardProps) {
  const needsCounter = dhikr.count > 1;
  const [count, setCount] = useState(0);
  const done = count >= dhikr.count;

  const tap = () => {
    setCount(prev => (prev >= dhikr.count ? 0 : prev + 1));
  };

  return (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.card, { borderTopColor: accent }]}>
        {/* Position indicator */}
        <View style={[styles.badge, { backgroundColor: accent }]}>
          <Text style={styles.badgeText}>{index + 1} / {total}</Text>
        </View>

        {/* Arabic text */}
        <Text style={styles.arabicText}>{dhikr.ar}</Text>

        {/* Transliteration */}
        {dhikr.translit && !isAr && (
          <Text style={[styles.translit, { color: accent }]}>{dhikr.translit}</Text>
        )}

        {/* Translation */}
        {(dhikr.fr || dhikr.en) && (
          <Text style={styles.translation}>
            {lang === 'en' && dhikr.en ? dhikr.en : dhikr.fr}
          </Text>
        )}

        {/* Source */}
        <View style={[styles.sourceRow, { backgroundColor: cardBg }]}>
          <Text style={styles.sourceIcon}>📖</Text>
          <Text style={styles.sourceText}>{formatSource(dhikr.source)}</Text>
        </View>

        {/* Counter — only if count > 1 */}
        {needsCounter && (
          <Pressable
            onPress={tap}
            style={({ pressed }) => [
              styles.counter,
              { borderColor: done ? '#2E7D32' : accent + '60', backgroundColor: done ? '#2E7D32' : accent + '12' },
              pressed && { opacity: 0.75 },
            ]}
          >
            {done ? (
              <>
                <Text style={styles.counterDoneCheck}>✓</Text>
                <Text style={styles.counterDoneLabel}>
                  {isAr ? 'تم — اضغط للإعادة' : 'Terminé — toucher pour reset'}
                </Text>
              </>
            ) : (
              <>
                <Text style={[styles.counterNum, { color: accent }]}>{count}</Text>
                <Text style={[styles.counterSlash, { color: accent + '80' }]}>/ {dhikr.count}</Text>
                <Text style={[styles.counterHint, { color: accent + 'AA' }]}>
                  {isAr ? 'اضغط للعدّ' : 'Toucher pour compter'}
                </Text>
              </>
            )}
          </Pressable>
        )}

        {/* Simple done button if count === 1 */}
        {!needsCounter && (
          <CheckButton accent={accent} isAr={isAr} />
        )}
      </View>
    </View>
  );
}

function CheckButton({ accent, isAr }: { accent: string; isAr: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <Pressable
      onPress={() => setDone(d => !d)}
      style={({ pressed }) => [
        styles.checkBtn,
        { borderColor: done ? '#2E7D32' : accent + '60', backgroundColor: done ? '#2E7D32' : accent + '12' },
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text style={[styles.checkBtnText, { color: done ? '#FFF' : accent }]}>
        {done ? '✓ ' : ''}{done
          ? (isAr ? 'تم — اضغط للإعادة' : 'Récité ✓')
          : (isAr ? 'اضغط بعد القراءة' : 'Marquer comme récité')}
      </Text>
    </Pressable>
  );
}

export default function AdhkarCategory() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lang = getCurrentLang();
  const isAr = lang === 'ar';
  const category = ADHKAR_CATEGORIES.find(c => c.id === id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) setCurrentIndex(viewableItems[0].index ?? 0);
  }, []);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  if (!category) return null;

  const { accent, bg: cardBg } = getAccent(category.id);
  const name = isAr ? category.name_ar : category.name_fr;
  const total = category.dhikrs.length;

  const goTo = (idx: number) => {
    flatRef.current?.scrollToIndex({ index: idx, animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: accent }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerIcon}>{category.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{name}</Text>
          <Text style={styles.headerDesc} numberOfLines={1}>
            {isAr ? category.description_ar : category.description_fr}
          </Text>
        </View>
      </View>

      {/* Horizontal swiper */}
      <FlatList
        ref={flatRef}
        data={category.dhikrs}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => (
          <DhikrCard
            dhikr={item}
            index={index}
            total={total}
            accent={accent}
            cardBg={cardBg}
            isAr={isAr}
            lang={lang}
          />
        )}
        contentContainerStyle={{ paddingVertical: 20 }}
      />

      {/* Bottom nav: dots + arrows */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={() => goTo(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          style={[styles.navBtn, { opacity: currentIndex === 0 ? 0.3 : 1 }]}
        >
          <Text style={[styles.navArrow, { color: accent }]}>‹</Text>
        </TouchableOpacity>

        <View style={styles.dots}>
          {category.dhikrs.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)}>
              <View style={[
                styles.dot,
                {
                  backgroundColor: i === currentIndex ? accent : accent + '30',
                  width: i === currentIndex ? 20 : 8,
                },
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => goTo(Math.min(total - 1, currentIndex + 1))}
          disabled={currentIndex === total - 1}
          style={[styles.navBtn, { opacity: currentIndex === total - 1 ? 0.3 : 1 }]}
        >
          <Text style={[styles.navArrow, { color: accent }]}>›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  backBtn: { width: 34, height: 34, justifyContent: 'center' },
  backArrow: { fontSize: 28, color: '#FFF', fontWeight: '300', lineHeight: 32 },
  headerIcon: { fontSize: 24 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  headerDesc: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 1 },

  slide: { paddingHorizontal: 16 },

  card: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 20,
    padding: 20, borderTopWidth: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },

  badge: {
    alignSelf: 'flex-end', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 20, marginBottom: 16,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#FFF' },

  arabicText: {
    fontSize: 24, color: COLORS.arabicText, textAlign: 'right',
    writingDirection: 'rtl', lineHeight: 44, fontWeight: '600',
    marginBottom: 14,
  },

  translit: { fontSize: 14, fontStyle: 'italic', marginBottom: 10 },

  translation: {
    fontSize: 14, color: COLORS.text, lineHeight: 22, marginBottom: 16,
  },

  sourceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    padding: 10, borderRadius: 10, marginBottom: 16,
  },
  sourceIcon: { fontSize: 14 },
  sourceText: { fontSize: 12, color: COLORS.textSecondary, flex: 1 },

  counter: {
    borderRadius: 16, paddingVertical: 18, alignItems: 'center',
    borderWidth: 2, gap: 4,
  },
  counterNum: { fontSize: 36, fontWeight: '900', lineHeight: 40 },
  counterSlash: { fontSize: 16, fontWeight: '600' },
  counterHint: { fontSize: 12, marginTop: 2 },
  counterDoneCheck: { fontSize: 36, color: '#FFF', fontWeight: '900' },
  counterDoneLabel: { fontSize: 13, color: '#FFF', fontWeight: '600' },

  checkBtn: {
    borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 2,
  },
  checkBtnText: { fontSize: 15, fontWeight: '700' },

  bottomBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16,
    backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  navBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  navArrow: { fontSize: 36, fontWeight: '300', lineHeight: 40 },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' },
  dot: { height: 8, borderRadius: 4 },
});
