import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image,
  Dimensions, ActivityIndicator, Modal, ScrollView, AppState, AppStateStatus,
} from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';
import { fetchSurahList, fetchSurah, fetchPageStart, SurahMeta, Ayah } from '../../services/quran';
import {
  SURAH_PAGE, TOTAL_PAGES, surahFromPage, pageImageUrl,
  RECITERS, ayahGlobalNumber, ayahAudioUrl, Reciter,
  SURAH_AYAH_COUNT,
} from '../../data/quran-meta';
import { useQuranAudioStore } from '../../store/quranAudioStore';

const { width, height } = Dimensions.get('window');
const PAGE_W = width;
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
  const [paused, setPaused] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [currentAyahIdx, setCurrentAyahIdx] = useState(0);
  const audioStore = useQuranAudioStore();
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [ayahsFr, setAyahsFr] = useState<Ayah[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);

  const listRef = useRef<FlatList>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const playingRef = useRef(false);
  const pausedRef = useRef(false);
  const currentAyahRef = useRef(0);
  const currentSurahRef = useRef(initialSurah);
  const reciterRef = useRef(reciter);
  const autoScrollRef = useRef(false);

  const lang = getCurrentLang();
  const isAr = lang === 'ar';
  const currentSurah = surahFromPage(currentPage);

  useEffect(() => { reciterRef.current = reciter; }, [reciter]);
  useEffect(() => { currentSurahRef.current = currentSurah; }, [currentSurah]);

  // Quand on change de page en cours de lecture → suivre l'audio sur cette page
  useEffect(() => {
    if (!playingRef.current) return;
    // Ignorer si le changement de page vient du défilement automatique de l'audio
    if (autoScrollRef.current) { autoScrollRef.current = false; return; }
    let cancelled = false;
    fetchPageStart(currentPage).then(start => {
      if (cancelled || !start || !playingRef.current) return;
      // Déjà en train de lire ce verset ? ne rien faire
      if (start.surah === currentSurahRef.current && start.ayahIdx === currentAyahRef.current) return;
      soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
      currentSurahRef.current = start.surah;
      currentAyahRef.current = start.ayahIdx;
      setCurrentAyahIdx(start.ayahIdx);
      playAyah(start.surah, start.ayahIdx);
    });
    return () => { cancelled = true; };
  }, [currentPage]);

  useEffect(() => {
    setLoadingAyahs(true);
    fetchSurah(currentSurah)
      .then(s => { setAyahs(s.ayahs_ar); setAyahsFr(s.ayahs_fr); })
      .catch(() => { setAyahs([]); setAyahsFr([]); })
      .finally(() => setLoadingAyahs(false));
  }, [currentSurah]);

  useFocusEffect(useCallback(() => { return () => {}; }, []));

  // Enregistrer les contrôles dans le store global pour la mini-barre
  useEffect(() => {
    audioStore.registerControls(pauseResume, stopAudio);
    return () => { audioStore.unregisterControls(); };
  }, []);

  useEffect(() => {
    fetchSurahList().then(setSurahs).catch(() => {});
    AsyncStorage.getItem(RECITER_KEY).then(id => {
      if (id) {
        const r = RECITERS.find(x => x.id === id);
        if (r) { setReciter(r); reciterRef.current = r; }
      }
    });
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true, shouldDuckAndroid: false }).catch(() => {});
    return () => {};
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
    setCurrentAyahIdx(0);
    currentAyahRef.current = 0;
  };

  const stopAudio = async () => {
    playingRef.current = false;
    pausedRef.current = false;
    try {
      await soundRef.current?.stopAsync();
      await soundRef.current?.unloadAsync();
    } catch {}
    soundRef.current = null;
    setPlaying(false);
    setPaused(false);
    audioStore.setPlaying(false);
    audioStore.setPaused(false);
  };

  const playAyah = async (surah: number, ayahIdx: number) => {
    if (!playingRef.current) return;
    const totalAyahs = SURAH_AYAH_COUNT[surah] || 1;
    if (ayahIdx >= totalAyahs) {
      const nextSurah = surah + 1;
      if (nextSurah > 114) { await stopAudio(); return; }
      currentSurahRef.current = nextSurah;
      currentAyahRef.current = 0;
      setCurrentAyahIdx(0);
      const nextPage = SURAH_PAGE[nextSurah];
      if (nextPage) {
        autoScrollRef.current = true;
        listRef.current?.scrollToIndex({ index: nextPage - 1, animated: true });
        setCurrentPage(nextPage);
      }
      playAyah(nextSurah, 0);
      return;
    }

    currentAyahRef.current = ayahIdx;
    setCurrentAyahIdx(ayahIdx);
    audioStore.setAyah(ayahIdx);

    const globalNum = ayahGlobalNumber(surah, ayahIdx + 1);
    const url = ayahAudioUrl(reciterRef.current.cdnId, globalNum);
    try {
      await soundRef.current?.unloadAsync();
      soundRef.current = null;
      const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status?.didJustFinish && playingRef.current && !pausedRef.current) {
          playAyah(currentSurahRef.current, currentAyahRef.current + 1);
        }
      });
    } catch {
      if (playingRef.current) playAyah(surah, ayahIdx + 1);
    }
  };

  const startPlay = async () => {
    await stopAudio();
    playingRef.current = true;
    setPlaying(true);
    audioStore.setPlaying(true);
    audioStore.setPaused(false);
    setLoadingAudio(true);
    await playAyah(currentSurahRef.current, currentAyahRef.current);
    setLoadingAudio(false);
  };

  // Tap sur la page → lance la lecture depuis le 1er verset de cette page
  const playFromPage = async (page: number) => {
    setLoadingAudio(true);
    const start = await fetchPageStart(page);
    await stopAudio();
    playingRef.current = true;
    setPlaying(true);
    if (start) {
      currentSurahRef.current = start.surah;
      currentAyahRef.current = start.ayahIdx;
      setCurrentAyahIdx(start.ayahIdx);
      await playAyah(start.surah, start.ayahIdx);
    } else {
      await playAyah(currentSurahRef.current, currentAyahRef.current);
    }
    setLoadingAudio(false);
  };

  const pauseResume = async () => {
    if (!playingRef.current) return;
    if (pausedRef.current) {
      pausedRef.current = false; setPaused(false);
      audioStore.setPaused(false);
      try { await soundRef.current?.playAsync(); } catch {
        playAyah(currentSurahRef.current, currentAyahRef.current);
      }
    } else {
      pausedRef.current = true; setPaused(true);
      audioStore.setPaused(true);
      try { await soundRef.current?.pauseAsync(); } catch {}
    }
  };

  const prevAyah = async () => {
    const idx = Math.max(0, currentAyahRef.current - 1);
    if (playing) {
      await soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
      pausedRef.current = false;
      playAyah(currentSurahRef.current, idx);
    } else {
      currentAyahRef.current = idx;
      setCurrentAyahIdx(idx);
    }
  };

  const nextAyah = async () => {
    const total = SURAH_AYAH_COUNT[currentSurahRef.current] || 1;
    const idx = Math.min(total - 1, currentAyahRef.current + 1);
    if (playing) {
      await soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
      pausedRef.current = false;
      playAyah(currentSurahRef.current, idx);
    } else {
      currentAyahRef.current = idx;
      setCurrentAyahIdx(idx);
    }
  };

  const chooseReciter = async (r: Reciter) => {
    setReciter(r); reciterRef.current = r;
    setShowReciterPicker(false);
    await AsyncStorage.setItem(RECITER_KEY, r.id);
    if (playingRef.current) {
      await soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
      playAyah(currentSurahRef.current, currentAyahRef.current);
    }
  };

  const surahMeta = surahs.find(s => s.number === currentSurah);

  // Sync nom de sourate dans le store global
  useEffect(() => {
    if (surahMeta) {
      audioStore.setSurah(currentSurah, surahMeta.englishName, SURAH_AYAH_COUNT[currentSurah] || 0);
    }
  }, [currentSurah, surahMeta]);
  const currentAyahAr = ayahs[currentAyahIdx]?.text || '';
  const totalAyahsInSurah = SURAH_AYAH_COUNT[currentSurah] || 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Full-screen Mushaf pages */}
      <FlatList
        ref={listRef}
        data={Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1)}
        keyExtractor={(p) => String(p)}
        horizontal pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialPage - 1}
        getItemLayout={(_, index) => ({ length: PAGE_W, offset: PAGE_W * index, index })}
        onMomentumScrollEnd={onScroll}
        inverted
        style={{ flex: 1 }}
        renderItem={({ item: page }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => playFromPage(page)}
            style={{ width: PAGE_W, flex: 1, backgroundColor: '#FAF5E8' }}
          >
            <Image source={{ uri: pageImageUrl(page) }} style={{ width: PAGE_W, flex: 1 }} resizeMode="contain" />
          </TouchableOpacity>
        )}
      />

      {/* Verse number badge only - no text */}
      {playing && (
        <View style={styles.verseOverlay} pointerEvents="none">
          <View style={styles.ayahBadge}>
            {loadingAudio
              ? <ActivityIndicator size="small" color="#FFD700" />
              : <Text style={styles.ayahBadgeText}>﴾ {currentAyahIdx + 1} ﴿</Text>
            }
          </View>
        </View>
      )}

      {/* Header overlay (top) */}
      <View style={styles.header} pointerEvents="box-none">
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
          <MaterialCommunityIcons name="microphone-outline" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Audio controls overlay (bottom) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.reciterChip} onPress={() => setShowReciterPicker(true)}>
          <MaterialCommunityIcons name="microphone" size={14} color="#FFF" />
          <Text style={styles.reciterText} numberOfLines={1}>
            {isAr ? reciter.nameAr : reciter.name}
          </Text>
        </TouchableOpacity>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.ctrlBtn} onPress={prevAyah}>
            <MaterialCommunityIcons name="skip-previous" size={28} color="#FFF" />
          </TouchableOpacity>

          {loadingAudio ? (
            <View style={styles.playBtn}><ActivityIndicator color={COLORS.primary} size="small" /></View>
          ) : !playing ? (
            <TouchableOpacity style={styles.playBtn} onPress={startPlay}>
              <MaterialCommunityIcons name="play" size={32} color={COLORS.primary} />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.playBtn} onPress={pauseResume}>
                <MaterialCommunityIcons name={paused ? 'play' : 'pause'} size={32} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.stopBtn} onPress={stopAudio}>
                <MaterialCommunityIcons name="stop" size={22} color="#FF5252" />
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.ctrlBtn} onPress={nextAyah}>
            <MaterialCommunityIcons name="skip-next" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sourate picker */}
      <Modal visible={showSurahPicker} animationType="slide" onRequestClose={() => setShowSurahPicker(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{isAr ? 'اختر السورة' : 'Choisir une sourate'}</Text>
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
                    {m && <Text style={styles.surahSub}>{m.englishNameTranslation} • {m.numberOfAyahs} v.</Text>}
                  </View>
                  <Text style={styles.surahNameAr}>{m?.name || ''}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Reciter picker */}
      <Modal visible={showReciterPicker} animationType="slide" transparent onRequestClose={() => setShowReciterPicker(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.reciterSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{isAr ? 'اختر القارئ' : 'Choisir un récitateur'}</Text>
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
  container: { flex: 1, backgroundColor: '#000' },

  header: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(27,94,32,0.88)',
    paddingHorizontal: 12, paddingVertical: 10, gap: 8, height: 56,
  },
  iconBtn: { padding: 6 },
  surahTitleBtn: { flex: 1, alignItems: 'center' },
  surahTitle: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  pageInfo: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 1 },

  verseOverlay: {
    position: 'absolute', bottom: 82, right: 16, zIndex: 10,
  },
  ayahBadgeRow: { flexDirection: 'row', alignItems: 'center' },
  ayahBadge: {
    backgroundColor: COLORS.primary, borderRadius: 24,
    paddingHorizontal: 18, paddingVertical: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4, shadowRadius: 6, elevation: 8,
  },
  ayahBadgeText: { fontSize: 18, fontWeight: '900', color: '#FFD700' },
  overlayAr: {
    fontSize: 20, color: '#FFFFFF', textAlign: 'right',
    writingDirection: 'rtl', lineHeight: 34, fontWeight: '500',
  },
  overlayFr: {
    fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 18,
    marginTop: 5, fontStyle: 'italic',
  },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, gap: 10,
    backgroundColor: 'rgba(27,94,32,0.88)',
    height: 72,
  },
  reciterChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6,
  },
  reciterText: { flex: 1, fontSize: 11, fontWeight: '600', color: '#FFF' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ctrlBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
  },
  playBtn: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: '#FFD700',
    justifyContent: 'center', alignItems: 'center',
  },
  stopBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,82,82,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },

  modal: { flex: 1, backgroundColor: '#FAF5E8' },
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
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  surahNumText: { fontWeight: '700', color: COLORS.primary, fontSize: 14 },
  surahName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  surahSub: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
  surahNameAr: { fontSize: 20, color: COLORS.arabicText, fontWeight: '600' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  reciterSheet: {
    backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%',
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
