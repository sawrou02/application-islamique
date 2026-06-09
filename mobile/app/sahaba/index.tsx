import { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';
import { SAHABA, Person, Era } from '../../data/sahaba';

export default function SahabaIndex() {
  const lang = getCurrentLang();
  const isAr = lang === 'ar';
  const [filter, setFilter] = useState<Era | 'all'>('all');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return SAHABA.filter(p => {
      if (filter !== 'all' && p.era !== filter) return false;
      if (!ql) return true;
      return (
        p.nameFr.toLowerCase().includes(ql) ||
        p.nameEn.toLowerCase().includes(ql) ||
        p.nameAr.includes(q.trim()) ||
        (p.laqabFr || '').toLowerCase().includes(ql)
      );
    });
  }, [q, filter]);

  const tabs: { id: Era | 'all'; label: string; labelAr: string; labelEn: string }[] = [
    { id: 'all', label: 'Tous', labelAr: 'الكل', labelEn: 'All' },
    { id: 'sahabi', label: 'Sahaba', labelAr: 'الصحابة', labelEn: 'Sahaba' },
    { id: 'tabii', label: "Tabi'in", labelAr: 'التابعون', labelEn: "Tabi'in" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IslamicIcon name="back" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            {isAr ? 'الصحابة والتابعون' : lang === 'en' ? 'Companions & Successors' : 'Sahaba & Tabi’in'}
          </Text>
          <Text style={styles.headerSub}>
            {isAr ? 'سير الصالحين' : lang === 'en' ? 'Lives of the righteous' : 'Vies des pieux prédécesseurs'}
          </Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder={isAr ? 'بحث…' : lang === 'en' ? 'Search…' : 'Rechercher…'}
          placeholderTextColor={COLORS.textSecondary}
          value={q}
          onChangeText={setQ}
        />
      </View>

      <View style={styles.tabs}>
        {tabs.map(tab => {
          const active = filter === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setFilter(tab.id)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {isAr ? tab.labelAr : lang === 'en' ? tab.labelEn : tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={list}
        keyExtractor={(it: Person) => it.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/sahaba/${item.id}`)}
            activeOpacity={0.85}
          >
            <View style={[styles.eraDot, { backgroundColor: item.era === 'sahabi' ? COLORS.primary : '#6A1B9A' }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.nameAr}>{item.nameAr}</Text>
              <Text style={styles.nameFr}>
                {isAr ? item.nameAr : lang === 'en' ? item.nameEn : item.nameFr}
              </Text>
              {item.laqabFr && (
                <Text style={styles.laqab}>
                  {isAr ? item.laqab : item.laqabFr} · {item.died}
                </Text>
              )}
              <Text style={styles.category} numberOfLines={1}>
                {isAr ? item.categoryAr : item.category}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {isAr ? 'لا نتائج' : lang === 'en' ? 'No results' : 'Aucun résultat'}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 14,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  headerSub: { fontSize: 11, color: '#FFFFFF99' },
  searchWrap: { paddingHorizontal: 16, paddingTop: 12 },
  searchInput: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: COLORS.text,
  },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  tab: {
    flex: 1, paddingVertical: 8, alignItems: 'center',
    borderRadius: 8, backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: '#FFF' },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  eraDot: { width: 10, height: 10, borderRadius: 5 },
  nameAr: { fontSize: 18, fontWeight: '700', color: COLORS.primary, textAlign: 'right' },
  nameFr: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginTop: 2 },
  laqab: { fontSize: 11, color: COLORS.gold, marginTop: 2, fontStyle: 'italic' },
  category: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  chevron: { fontSize: 22, color: COLORS.textSecondary },
  empty: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 40 },
});
