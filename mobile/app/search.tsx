import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, ListRenderItem,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { questionsApi } from '../services/api';
import { Question } from '../types';
import { COLORS } from '../constants/colors';
import { getCurrentLang } from '../i18n';

const DOMAIN_NAMES: Record<string, { fr: string; ar: string; en: string }> = {
  fiqh:   { fr: 'Fiqh',   ar: 'الفقه',    en: 'Fiqh' },
  aqida:  { fr: 'Aqida',  ar: 'العقيدة',  en: 'Aqida' },
  tafsir: { fr: 'Tafsir', ar: 'التفسير',  en: 'Tafsir' },
  hadith: { fr: 'Hadith', ar: 'الحديث',   en: 'Hadith' },
  sirah:  { fr: 'Sirah',  ar: 'السيرة',   en: 'Sirah' },
  akhlaq: { fr: 'Akhlaq', ar: 'الأخلاق',  en: 'Akhlaq' },
};

const LEVEL_LABELS = ['', 'Novice', 'Intermédiaire', 'Avancé', 'Expert', 'Maître'];

export default function SearchScreen() {
  const lang = getCurrentLang();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await questionsApi.getQuestions({ search: query.trim(), limit: 20 } as any);
        setResults(res.data.data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const renderItem: ListRenderItem<Question> = ({ item }) => {
    const correctAnswer = item.reponses?.find((r) => r.est_correcte);
    const domainName = DOMAIN_NAMES[item.domaine]?.[lang] || item.domaine;
    const levelLabel = LEVEL_LABELS[item.niveau] || `Niv. ${item.niveau}`;

    return (
      <View style={styles.card}>
        <View style={styles.cardMeta}>
          <View style={styles.domainChip}>
            <Text style={styles.domainChipText}>{domainName}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>{levelLabel}</Text>
          </View>
        </View>
        <Text style={styles.questionText}>{item.texte_fr}</Text>
        {correctAnswer && (
          <Text style={styles.answerText}>✓ {correctAnswer.texte_fr}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerFr}>Recherche</Text>
          <Text style={styles.headerAr}>بحث</Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      {/* Search input */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une question..."
          placeholderTextColor={COLORS.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoFocus
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : !query.trim() ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Recherchez parmi les questions...</Text>
          <Text style={styles.emptySubtitle}>Tapez un mot-clé en français ou arabe</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>😶</Text>
          <Text style={styles.emptyTitle}>Aucun résultat</Text>
          <Text style={styles.emptySubtitle}>Essayez un autre terme de recherche</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: { fontSize: 32, color: '#FFFFFF', fontWeight: '300', lineHeight: 36 },
  headerTitles: { alignItems: 'center' },
  headerFr: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  headerAr: { fontSize: 14, color: COLORS.gold },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    margin: 16,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  searchIcon: { fontSize: 18 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  listContent: { padding: 16, paddingTop: 0, paddingBottom: 40 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  domainChip: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  domainChipText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  levelBadge: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  levelBadgeText: { fontSize: 11, fontWeight: '700', color: '#F57F17' },
  questionText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  answerText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '600',
  },
});
