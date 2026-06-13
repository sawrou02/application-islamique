import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';
import { ADHKAR_CATEGORIES } from '../../data/adhkar';

const { width } = Dimensions.get('window');
const COLS = 3;
const CARD_W = (width - 16 * 2 - 12 * (COLS - 1)) / COLS;

const CATEGORY_COLORS: Record<string, { accent: string; iconBg: string }> = {
  matin:        { accent: '#E65100', iconBg: '#E65100' },
  soir:         { accent: '#4527A0', iconBg: '#4527A0' },
  apres_priere: { accent: '#1B5E20', iconBg: '#1B5E20' },
  sommeil:      { accent: '#1A237E', iconBg: '#1A237E' },
  reveil:       { accent: '#F57F17', iconBg: '#F57F17' },
  avant_repas:  { accent: '#BF360C', iconBg: '#BF360C' },
  apres_repas:  { accent: '#004D40', iconBg: '#004D40' },
  maison:       { accent: '#4E342E', iconBg: '#4E342E' },
  mosquee:      { accent: '#006064', iconBg: '#006064' },
  wc:           { accent: '#37474F', iconBg: '#37474F' },
  voyage:       { accent: '#0D47A1', iconBg: '#0D47A1' },
  detresse:     { accent: '#6A1B9A', iconBg: '#6A1B9A' },
  maladie:      { accent: '#C62828', iconBg: '#C62828' },
  pluie:        { accent: '#01579B', iconBg: '#01579B' },
  istikfar:     { accent: '#2E7D32', iconBg: '#2E7D32' },
  salat_nabi:   { accent: '#827717', iconBg: '#827717' },
};

function getStyle(id: string) {
  return CATEGORY_COLORS[id] || { accent: COLORS.primary, iconBg: COLORS.primary };
}

export default function AdhkarIndex() {
  const lang = getCurrentLang();
  const isAr = lang === 'ar';
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = ADHKAR_CATEGORIES.filter(cat => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      cat.name_fr.toLowerCase().includes(q) ||
      cat.name_ar.includes(search) ||
      cat.name_en.toLowerCase().includes(q)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isAr ? 'الأذكار' : 'Tous les Adhkar'}
        </Text>
        <View style={{ width: 34 }} />
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={isAr ? 'البحث بالعنوان...' : 'Rechercher par titre...'}
          placeholderTextColor={COLORS.textLight}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {filtered.map((cat) => {
          const st = getStyle(cat.id);
          const name = isAr ? cat.name_ar : cat.name_fr;
          const isFav = favorites.has(cat.id);
          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.card}
              onPress={() => router.push(`/adhkar/${cat.id}` as any)}
              activeOpacity={0.8}
            >
              {/* Favorite star */}
              <TouchableOpacity
                style={styles.starBtn}
                onPress={() => toggleFav(cat.id)}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <Text style={[styles.star, isFav && { color: COLORS.gold }]}>
                  {isFav ? '★' : '☆'}
                </Text>
              </TouchableOpacity>

              {/* Icon circle */}
              <View style={[styles.iconCircle, { backgroundColor: st.iconBg }]}>
                <Text style={styles.iconEmoji}>{cat.icon}</Text>
              </View>

              {/* Title */}
              <Text style={styles.cardTitle} numberOfLines={3}>{name}</Text>

              {/* Count */}
              <Text style={[styles.cardCount, { color: st.accent }]}>
                {cat.dhikrs.length}
              </Text>
            </TouchableOpacity>
          );
        })}
        {/* Empty spacer if odd */}
        {filtered.length % COLS !== 0 &&
          Array.from({ length: COLS - (filtered.length % COLS) }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.cardEmpty} />
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  backBtn: { width: 34, height: 34, justifyContent: 'center' },
  backArrow: { fontSize: 28, color: '#FFF', fontWeight: '300', lineHeight: 32 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: '#FFF' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.surface,
    margin: 14, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text, padding: 0 },
  clearBtn: { fontSize: 14, color: COLORS.textLight, padding: 2 },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 16, gap: 12,
    paddingBottom: 40,
  },

  card: {
    width: CARD_W,
    backgroundColor: COLORS.surface,
    borderRadius: 16, padding: 12,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  cardEmpty: { width: CARD_W },

  starBtn: { position: 'absolute', top: 8, right: 8 },
  star: { fontSize: 16, color: COLORS.textLight },

  iconCircle: {
    width: 62, height: 62, borderRadius: 31,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 18, marginBottom: 10,
  },
  iconEmoji: { fontSize: 28 },

  cardTitle: {
    fontSize: 12, fontWeight: '700', textAlign: 'center',
    color: COLORS.text, lineHeight: 17, marginBottom: 6,
  },
  cardCount: {
    fontSize: 11, fontWeight: '800',
  },
});
