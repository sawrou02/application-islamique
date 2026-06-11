import { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image,
  Dimensions, ActivityIndicator, Modal, ScrollView, Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';
import { fetchSurahList, SurahMeta } from '../../services/quran';
import {
  SURAH_PAGE, TOTAL_PAGES, surahFromPage, pageImageUrl,
  RECITERS, recitationUrl, Reciter,
} from '../../data/quran-meta';

const { width, height } = Dimensions.get('window');
const PAGE_W = width;
const PAGE_H = height - 180;
const RECITER_KEY = 'coran_reciter_id';

export default function MushafScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const initialSurah = Math.max(1, Math.min(114, parseInt(params.id || '1', 10) || 1));
  const initialPage = SURAH_PAGE[initialSurah] || 1;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [showSurahPicker, setShowSurahPicker] = useState(false);
  const [showReciterPicker, setShowReciterPicker] = useState(false);
  const [reciter, setReciter] = useState<Reciter>(RECITERS[0]);
  const [playing, setPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const listRef = useRef<FlatList>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const lang = getCurrentLang();
  const isAr = lang === 'ar';

  useEffect(() => {
    fetchSurahList().then(setSurahs).catch(() => {});
    AsyncStorage.getItem(RECITER_KEY).then(id => {
      if (id) {
        const r = RECITERS.find(x => x.id === id);
        if (r) setReciter(r);
      }
    });
    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const onScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / PAGE_W);
    const newPage = idx + 1;
    if (newPage !== currentPage) setCurrentPage(newPage);
  };

  const jumpToSurah = (n: number) => {
    const p = SURAH_PAGE[n];
    if (!p) return;
    setShowSurahPicker(false);
    listRef.current?.scrollToIndex({ index: p - 1, animated: false });
    setCurrentPage(p);
  };

  const stopAudio = async () => {
    try {
      await soundRef.current?.stopAsync();
      await soundRef.current?.unloadAsync();
    } catch {}
    soundRef.current = null;
    setPlaying(false);
  };

  const playAudio = async (r: Reciter = reciter) => {
    const surah = surahFromPage(currentPage);
    const url = recitationUrl(r.edition, surah);
    setLoadingAudio(true);
    try {
      await stopAudio();
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status?.didJustFinish) setPlaying(false);
      });
      setPlaying(true);
    } catch (e: any) {
      Alert.alert(
        isAr ? 'خطأ' : 'Erreur',
        `${isAr ? 'تعذر تشغيل الصوت' : 'Lecture audio impossible'}\n\n${e?.message || ''}\n${url}`,
      );
    } finally {
      setLoadingAudio(false);
    }
  };

  const chooseReciter = async (r: Reciter) => {
    setReciter(r);
    setShowReciterPicker(false);
    await AsyncStorage.setItem(RECITER_KEY, r.id);
    if (playing) {
      await stopAudio();
      await playAudio(r);
    }
  };

  const togglePlay = () => {
    if (playing) stopAudio();
    else playAudio();
  };

  const currentSurah = surahFromPage(currentPage);
  const surahMeta = surahs.find(s => s.number === currentSurah);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { stopAudio(); router.back(); }} style={styles.iconBtn}>
          <IslamicIcon name="back" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.surahTitleBtn} onPress={() => setShowSurahPicker(true)}>
          <Text style={styles.surahTitle} numberOfLines={1}>
            {surahMeta ? (isAr ? surahMeta.name : surahMeta.englishName) : `Sourate ${currentSurah}`}
          </Text>
          <Text style={styles.pageInfo}>
            {isAr ? `صفحة ${currentPage} / ${TOTAL_PAGES}` : `Page ${currentPage} / ${TOTAL_PAGES}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowReciterPicker(true)} style={styles.iconBtn}>
          <IslamicIcon name="settings" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Mushaf pages — inverted so swipe right = next page (RTL reading) */}
      <FlatList
        ref={listRef}
        data={Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1)}
        keyExtractor={(p) => String(p)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialPage - 1}
        getItemLayout={(_, index) => ({ length: PAGE_W, offset: PAGE_W * index, index })}
        onMomentumScrollEnd={onScroll}
        inverted
        renderItem={({ item: page }) => (
          <View style={styles.pageWrap}>
            <Image
              source={{ uri: pageImageUrl(page) }}
              style={styles.pageImage}
              resizeMode="contain"
            />
          </View>
        )}
      />

      {/* Bottom audio bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.reciterChip} onPress={() => setShowReciterPicker(true)}>
          <IslamicIcon name="user" size={14} color={COLORS.primary} />
          <Text style={styles.reciterText} numberOfLines={1}>
            {isAr ? reciter.nameAr : reciter.name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playBtn} onPress={togglePlay} disabled={loadingAudio}>
          {loadingAudio ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <IslamicIcon name={playing ? 'close' : 'next'} size={22} color="#FFF" />
          )}
          <Text style={styles.playText}>
            {playing
              ? (isAr ? 'إيقاف' : 'Stop')
              : (isAr ? `سورة ${currentSurah}` : `Sourate ${currentSurah}`)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sourate picker modal */}
      <Modal visible={showSurahPicker} animationType="slide" onRequestClose={() => setShowSurahPicker(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isAr ? 'اختر السورة' : 'Choisir une sourate'}
            </Text>
            <TouchableOpacity onPress={() => setShowSurahPicker(false)}>
              <IslamicIcon name="close" size={26} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {Array.from({ length: 114 }, (_, i) => i + 1).map(n => {
              const m = surahs.find(s => s.number === n);
              return (
                <TouchableOpacity key={n} style={styles.surahRow} onPress={() => jumpToSurah(n)}>
                  <View style={styles.surahNum}><Text style={styles.surahNumText}>{n}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.surahName}>{m?.englishName || `Surah ${n}`}</Text>
                    {m && <Text style={styles.surahSub}>{m.englishNameTranslation} • {m.numberOfAyahs} versets</Text>}
                  </View>
                  <Text style={styles.surahNameAr}>{m?.name || ''}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Reciter picker modal */}
      <Modal visible={showReciterPicker} animationType="slide" transparent onRequestClose={() => setShowReciterPicker(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.reciterSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isAr ? 'اختر القارئ' : 'Choisir un récitateur'}
              </Text>
              <TouchableOpacity onPress={() => setShowReciterPicker(false)}>
                <IslamicIcon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {RECITERS.map(r => (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.reciterRow, r.id === reciter.id && styles.reciterRowActive]}
                  onPress={() => chooseReciter(r)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reciterRowName}>{r.name}</Text>
                    <Text style={styles.reciterRowAr}>{r.nameAr}</Text>
                  </View>
                  {r.id === reciter.id && <IslamicIcon name="check" size={20} color={COLORS.success} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5E8' },
  header: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary,
    paddingHorizontal: 12, paddingVertical: 12, gap: 8,
  },
  iconBtn: { padding: 6 },
  surahTitleBtn: { flex: 1, alignItems: 'center' },
  surahTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  pageInfo: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  pageWrap: {
    width: PAGE_W, height: PAGE_H,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#FAF5E8',
  },
  pageImage: { width: PAGE_W, height: PAGE_H },
  bottomBar: {
    flexDirection: 'row', alignItems: 'center',
    padding: 12, gap: 10, backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  reciterChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primary + '12',
    borderWidth: 1, borderColor: COLORS.primary + '30',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
  },
  reciterText: { flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.primary },
  playBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primary, borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  playText: { color: '#FFF', fontWeight: '700', fontSize: 13 },

  modal: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  surahRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  surahNum: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  surahNumText: { fontWeight: '700', color: COLORS.primary, fontSize: 13 },
  surahName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  surahSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  surahNameAr: { fontSize: 18, color: COLORS.arabicText, fontWeight: '600' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  reciterSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  reciterRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  reciterRowActive: { backgroundColor: COLORS.primary + '08' },
  reciterRowName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  reciterRowAr: { fontSize: 14, color: COLORS.arabicText, marginTop: 2 },
});
