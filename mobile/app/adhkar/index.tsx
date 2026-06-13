import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';
import { ADHKAR_CATEGORIES } from '../../data/adhkar';

const { width } = Dimensions.get('window');
const COLS = 3;
const CARD_W = (width - 16 * 2 - 10 * (COLS - 1)) / COLS;

const CATEGORY_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  matin:               'weather-sunset-up',
  soir:                'weather-night',
  reveil:              'alarm',
  nawm:                'power-sleep',
  lbs_thawb:           'tshirt-crew',
  lbs_jadid:           'star-outline',
  wada_thawb:          'tshirt-crew-outline',
  dkhul_wc:            'toilet',
  khuruj_wc:           'exit-run',
  qabla_wudu:          'hand-wash',
  baad_wudu:           'water-outline',
  khuruj_bayt:         'home-export-outline',
  dkhul_bayt:          'home-import-outline',
  dhahab_masjid:       'walk',
  dkhul_masjid:        'home-variant',
  khuruj_masjid:       'home-variant-outline',
  adhan:               'bullhorn',
  istiftah:            'hand-heart',
  ruku:                'human',
  raf_ruku:            'human',
  sujud:               'human-greeting',
  jalsa:               'seat',
  sujud_tilawa:        'book-open-variant',
  tashahud:            'hand-pointing-up',
  salat_nabi_tashahud: 'heart',
  dua_qabla_salam:     'hand-heart',
  baad_salat:          'check-circle-outline',
  istikhara:           'help-circle-outline',
  taqallub_layl:       'moon-waning-crescent',
  fazaa_nawm:          'alert-circle-outline',
  ruya:                'eye-outline',
  qunut_witr:          'hand-heart',
  baad_witr:           'star-crescent',
  hamm_huzn:           'emoticon-sad-outline',
  karb:                'heart-broken',
  liqa_aduw:           'shield',
  khawf_sultan:        'account-tie',
  dua_aduw:            'sword',
  khawf_qawm:          'account-group',
  waswas_iman:         'brain',
  qada_dayn:           'cash',
  waswas_salat:        'hand-heart',
  mustasab:            'emoticon-happy-outline',
  dhanb:               'alert-circle',
  tard_shaytan:        'shield-alert',
  la_yarda:            'cancel',
  mawlud:              'baby-face-outline',
  awlad_ruqya:         'baby',
  dua_marid:           'hospital-box-outline',
  fadl_iyada:          'heart-pulse',
  marid_yaas:          'emoticon-sick-outline',
  muhtadar:            'human-queue',
  musiba:              'emoticon-cry-outline',
  ighmad:              'eye-off',
  salat_mayt:          'hand-heart',
  farat:               'baby-carriage',
  taziya:              'hand-heart',
  qabr_idkhal:         'grave-stone',
  baad_dafn:           'flower-outline',
  ziyara_qubur:        'map-marker-outline',
  rih:                 'weather-windy',
  raad:                'weather-lightning',
  istisqa:             'water-pump',
  nuzul_matar:         'weather-rainy',
  baad_matar:          'weather-partly-rainy',
  istisha:             'help-circle',
  hilal:               'moon-new',
  iftar:               'food',
  qabla_taam:          'silverware-fork-knife',
  baad_taam:           'check',
  dayf_dua:            'account-heart',
  talib_taam:          'food',
  iftar_bayt:          'home-heart',
  saim_taam:           'food-off',
  saim_sabb:           'shield-alert',
  bakura:              'food-apple',
  atas:                'account-arrow-up',
  kafir_atas:          'account-cancel',
  zawaj_dua:           'ring',
  zawaj_shira:         'cart',
  jima:                'heart',
  ghadab:              'emoticon-angry-outline',
  mubtala:             'alert',
  majlis:              'account-group',
  kaffara_majlis:      'eraser',
  ghafara_dua:         'hand-heart',
  sanaa_maruf:         'star',
  dajjal:              'eye-off',
  uhibbuka:            'cards-heart',
  ard_mal:             'cash-multiple',
  qard:                'bank-outline',
  khawf_shirk:         'shield-check',
  barak_dua:           'gift',
  tayra:               'bird',
  rukub:               'car',
  safar:               'airplane',
  dkhul_balda:         'city',
  dkhul_suq:           'store',
  taas_markub:         'alert-circle',
  musafir_muqim:       'map-marker-check',
  muqim_musafir:       'map-marker-path',
  takbir_safar:        'chevron-up-circle',
  musafir_ashar:       'weather-sunset-up',
  manzil_safar:        'tent',
  rujua_safar:         'home-return-outline',
  khabar:              'newspaper-variant',
  fadl_salat_nabi:     'star-crescent',
  ifsha_salam:         'hand-wave',
  radd_kafir:          'account-question',
  siyah_dik:           'bird',
  nubah_kalb:          'dog',
  sabb_dua:            'emoticon-angry',
  madh:                'account-star',
  zukki:               'check-decagram',
  talbiya:             'home-city',
  hajar_aswad:         'circle',
  rukn_yamani:         'corner-up-right',
  safa_marwa:          'image-filter-hdr',
  arafat:              'mountain',
  muzdalifa:           'campfire',
  jamarat:             'pillar',
  tajub:               'emoticon-excited-outline',
  ata_yasur:           'gift-outline',
  wajaa:               'bandage',
  ayn:                 'eye-off-outline',
  fazaa:               'run-fast',
  dhabh:               'food-drumstick',
  kayd_shayatin:       'ghost',
  istighfar:           'refresh-circle',
  tasbih:              'counter',
  kayna_nabi:          'heart-flash',
  anwaa_khayr:         'star-shooting',
  ruqya_quran:         'book-open-page-variant',
  ruqya_sunna:         'book-open-variant',
};

function getCatIcon(id: string): keyof typeof MaterialCommunityIcons.glyphMap {
  return CATEGORY_ICONS[id] || 'hand-heart';
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

  const favCats = filtered.filter(c => favorites.has(c.id));

  const renderCard = (cat: typeof ADHKAR_CATEGORIES[0]) => {
    const iconName = getCatIcon(cat.id);
    const name = isAr ? cat.name_ar : cat.name_fr;
    const isFav = favorites.has(cat.id);
    return (
      <TouchableOpacity
        key={cat.id}
        style={styles.card}
        onPress={() => router.push(`/adhkar/${cat.id}` as any)}
        activeOpacity={0.75}
      >
        <TouchableOpacity
          style={styles.starBtn}
          onPress={() => toggleFav(cat.id)}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <MaterialCommunityIcons
            name={isFav ? 'star' : 'star-outline'}
            size={18}
            color={isFav ? COLORS.gold : '#BBBBBB'}
          />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={iconName} size={28} color="#FFFFFF" />
        </View>

        <Text style={styles.cardTitle} numberOfLines={3}>{name}</Text>
        <Text style={styles.cardCount}>{cat.dhikrs.length}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isAr ? 'الأذكار' : 'Tous les Azkar'}
        </Text>
        <View style={{ width: 34 }} />
      </View>

      <View style={styles.searchWrap}>
        <MaterialCommunityIcons name="magnify" size={18} color={COLORS.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder={isAr ? 'البحث بالعنوان...' : 'Rechercher en utilisant le titre'}
          placeholderTextColor={COLORS.textLight}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <MaterialCommunityIcons name="close-circle" size={16} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {favCats.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>
              {isAr ? 'المفضلة' : 'Azkar favoris'}
            </Text>
            <View style={styles.grid}>
              {favCats.map(renderCard)}
              {favCats.length % COLS !== 0 &&
                Array.from({ length: COLS - (favCats.length % COLS) }).map((_, i) => (
                  <View key={`ef-${i}`} style={styles.cardEmpty} />
                ))}
            </View>
          </>
        )}

        <Text style={styles.sectionLabel}>
          {isAr ? 'جميع الأذكار' : 'Tous les Azkar'}
        </Text>
        <View style={styles.grid}>
          {filtered.map(renderCard)}
          {filtered.length % COLS !== 0 &&
            Array.from({ length: COLS - (filtered.length % COLS) }).map((_, i) => (
              <View key={`ea-${i}`} style={styles.cardEmpty} />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

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
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14, marginVertical: 12,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
    borderWidth: 1, borderColor: '#E0E0E0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 3, elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#333', padding: 0 },

  sectionLabel: {
    fontSize: 12, fontWeight: '800', color: '#777',
    paddingHorizontal: 16, marginBottom: 10, marginTop: 4,
    textTransform: 'uppercase', letterSpacing: 0.6,
  },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 16, gap: 10,
    marginBottom: 8,
  },

  card: {
    width: CARD_W,
    backgroundColor: '#FFFFFF',
    borderRadius: 14, padding: 10,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  cardEmpty: { width: CARD_W },

  starBtn: { position: 'absolute', top: 7, right: 7 },

  iconCircle: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 20, marginBottom: 8,
  },

  cardTitle: {
    fontSize: 11, fontWeight: '600', textAlign: 'center',
    color: '#333', lineHeight: 16, marginBottom: 4,
  },
  cardCount: {
    fontSize: 10, fontWeight: '800', color: COLORS.primaryLight,
  },
});
