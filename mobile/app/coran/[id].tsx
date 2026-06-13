import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Modal, ScrollView, AppState, AppStateStatus,
} from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';
import { fetchSurahList, fetchSurah, SurahMeta, Ayah } from '../../services/quran';
import {
  RECITERS, ayahGlobalNumber, ayahAudioUrl, Reciter,
  SURAH_AYAH_COUNT,
} from '../../data/quran-meta';

const RECITER_KEY = 'coran_reciter_id';

export default function QuranTextScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const initialSurah = Math.max(1, Math.min(114, parseInt(params.id || '1', 10) || 1));

  const [currentSurah, setCurrentSurah] = useState(initialSurah);
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [showSurahPicker, setShowSurahPicker] = useState(false);
  const [showReciterPicker, setShowReciterPicker] = useState(false);
  const [reciter, setReciter] = useState<Reciter>(RECITERS[0]);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [currentAyahIdx, setCurrentAyahIdx] = useState(0);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [ayahsFr, setAyahsFr] = useState<Ayah[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [showTrad, setShowTrad] = useState(false);

  const verseListRef = useRef<FlatList>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const playingRef = useRef(false);
  const pausedRef = useRef(false);
  const currentAyahRef = useRef(0);
  const currentSurahRef = useRef(initialSurah);
  const reciterRef = useRef(reciter);

  const lang = getCurrentLang();
  const isAr = lang === 'ar';

  useEffect(() => { reciterRef.current = reciter; }, [reciter]);
  useEffect(() => { currentSurahRef.current = currentSurah; }, [currentSurah]);

  // Load ayahs when surah changes
  useEffect(() => {
    setLoadingAyahs(true);
    setCurrentAyahIdx(0);
    currentAyahRef.current = 0;
    fetchSurah(currentSurah)
      .then(s => { setAyahs(s.ayahs_ar); setAyahsFr(s.ayahs_fr); })
      .catch(() => { setAyahs([]); setAyahsFr([]); })
      .finally(() => setLoadingAyahs(false));
  }, [currentSurah]);

  // Auto-scroll to current ayah when it changes
  useEffect(() => {
    if (ayahs.length > currentAyahIdx) {
      try {
        verseListRef.current?.scrollToIndex({ index: currentAyahIdx, animated: true, viewPosition: 0.35 });
      } catch {}
    }
  }, [currentAyahIdx]);

  // Stop audio on blur
  useFocusEffect(
    useCallback(() => {
      return () => { stopAudio(); };
    }, [])
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'background' || state === 'inactive') stopAudio();
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    fetchSurahList().then(setSurahs).catch(() => {});
    AsyncStorage.getItem(RECITER_KEY).then(id => {
      if (id) {
        const r = RECITERS.find(x => x.id === id);
        if (r) { setReciter(r); reciterRef.current = r; }
      }
    });
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false }).catch(() => {});
    return () => { stopAudio(); };
  }, []);

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
      setCurrentSurah(nextSurah);
      playAyah(nextSurah, 0);
      return;
    }

    currentAyahRef.current = ayahIdx;
    setCurrentAyahIdx(ayahIdx);

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

  const tapVerse = async (idx: number) => {
    currentAyahRef.current = idx;
    setCurrentAyahIdx(idx);
    await stopAudio();
    playingRef.current = true;
    pausedRef.current = false;
    setPlaying(true);
    setPaused(false);
    setLoadingAudio(true);
    await playAyah(currentSurahRef.current, idx);
    setLoadingAudio(false);
  };

  const startPlay = async () => {
    await stopAudio();
    playingRef.current = true;
    setPlaying(true);
    setLoadingAudio(true);
    await playAyah(currentSurahRef.current, currentAyahRef.current);
    setLoadingAudio(false);
  };

  const pauseResume = async () => {
    if (!playingRef.current) return;
    if (pausedRef.current) {
      pausedRef.current = false;
      setPaused(false);
      try { await soundRef.current?.playAsync(); } catch {
        playAyah(currentSurahRef.current, currentAyahRef.current);
      }
    } else {
      pausedRef.current = true;
      setPaused(true);
      try { await soundRef.current?.pauseAsync(); } catch {}
    }
  };

  const prevAyah = async () => {
    const idx = Math.max(0, currentAyahRef.current - 1);
    currentAyahRef.current = idx;
    setCurrentAyahIdx(idx);
    if (playing) {
      await soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
      pausedRef.current = false;
      playAyah(currentSurahRef.current, idx);
    }
  };

  const nextAyah = async () => {
    const total = SURAH_AYAH_COUNT[currentSurahRef.current] || 1;
    const idx = Math.min(total - 1, currentAyahRef.current + 1);
    currentAyahRef.current = idx;
    setCurrentAyahIdx(idx);
    if (playing) {
      await soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
      pausedRef.current = false;
      playAyah(currentSurahRef.current, idx);
    }
  };

  const chooseReciter = async (r: Reciter) => {
    setReciter(r);
    reciterRef.current = r;
    setShowReciterPicker(false);
    await AsyncStorage.setItem(RECITER_KEY, r.id);
    if (playingRef.current) {
      await soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
      playAyah(currentSurahRef.current, currentAyahRef.current);
    }
  };

  const jumpToSurah = (n: number) => {
    setShowSurahPicker(false);
    stopAudio();
    setCurrentSurah(n);
  };

  const surahMeta = surahs.find(s => s.number === currentSurah);
  const totalAyahs = SURAH_AYAH_COUNT[currentSurah] || 0;

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
          <Text style={styles.surahSub}>
            {surahMeta?.numberOfAyahs || totalAyahs} {isAr ? 'آية' : 'versets'} • {isAr ? surahMeta?.revelationType === 'Meccan' ? 'مكية' : 'مدنية' : surahMeta?.revelationType}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowTrad(t => !t)} style={styles.iconBtn}>
          <MaterialCommunityIcons name={showTrad ? 'translate-off' : 'translate'} size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Verse list */}
      {loadingAyahs ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          ref={verseListRef}
          data={ayahs}
          keyExtractor={(_, i) => String(i)}
          onScrollToIndexFailed={() => {}}
          ListHeaderComponent={
            <View style={styles.bismillah}>
              <Text style={styles.bismillahText}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const isActive = index === currentAyahIdx;
            const isPlaying = isActive && playing && !paused;
            return (
              <TouchableOpacity
                style={[styles.verseRow, isActive && styles.verseRowActive]}
                onPress={() => tapVerse(index)}
                activeOpacity={0.7}
              >
                {/* Verse number badge */}
                <View style={[styles.verseNumBadge, isActive && { backgroundColor: COLORS.primary }]}>
                  {isPlaying ? (
                    <MaterialCommunityIcons name="volume-high" size={14} color="#FFF" />
                  ) : (
                    <Text style={[styles.verseNum, isActive && { color: '#FFF' }]}>{index + 1}</Text>
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  {/* Arabic text */}
                  <Text style={[styles.verseAr, isActive && styles.verseArActive]}>
                    {item.text}
                  </Text>

                  {/* French translation */}
                  {showTrad && ayahsFr[index] && (
                    <Text style={[styles.verseFr, isActive && { color: COLORS.primaryLight }]}>
                      {ayahsFr[index].text}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      {/* Audio controls bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.reciterChip} onPress={() => setShowReciterPicker(true)}>
          <MaterialCommunityIcons name="microphone" size={16} color={COLORS.primary} />
          <Text style={styles.reciterText} numberOfLines={1}>
            {isAr ? reciter.nameAr : reciter.name}
          </Text>
        </TouchableOpacity>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.ctrlBtn} onPress={prevAyah}>
            <MaterialCommunityIcons name="skip-previous" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {loadingAudio ? (
            <View style={styles.playBtn}>
              <ActivityIndicator color="#FFF" size="small" />
            </View>
          ) : !playing ? (
            <TouchableOpacity style={styles.playBtn} onPress={startPlay}>
              <MaterialCommunityIcons name="play" size={28} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.playBtn} onPress={pauseResume}>
                <MaterialCommunityIcons name={paused ? 'play' : 'pause'} size={28} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.stopBtn} onPress={stopAudio}>
                <MaterialCommunityIcons name="stop" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.ctrlBtn} onPress={nextAyah}>
            <MaterialCommunityIcons name="skip-next" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Verse counter */}
        <Text style={styles.counter}>{currentAyahIdx + 1}/{totalAyahs}</Text>
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
                <TouchableOpacity key={n} style={[styles.surahRow, n === currentSurah && styles.surahRowActive]} onPress={() => jumpToSurah(n)}>
                  <View style={[styles.surahNum, n === currentSurah && { backgroundColor: COLORS.primary }]}>
                    <Text style={[styles.surahNumText, n === currentSurah && { color: '#FFF' }]}>{n}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.surahName}>{m?.englishName || `Surah ${n}`}</Text>
                    {m && <Text style={styles.surahSub2}>{m.englishNameTranslation} • {m.numberOfAyahs} v.</Text>}
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
  container: { flex: 1, backgroundColor: '#FAF8F0' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12, paddingVertical: 12, gap: 8,
  },
  iconBtn: { padding: 6 },
  surahTitleBtn: { flex: 1, alignItems: 'center' },
  surahTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  surahSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  bismillah: {
    alignItems: 'center', paddingVertical: 20,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    marginBottom: 4,
  },
  bismillahText: {
    fontSize: 22, color: COLORS.arabicText, fontWeight: '600',
    writingDirection: 'rtl',
  },

  verseRow: {
    flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 10,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#EEE',
    backgroundColor: '#FAF8F0',
  },
  verseRowActive: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 3, borderLeftColor: COLORS.primary,
  },
  verseNumBadge: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.primary + '18',
    justifyContent: 'center', alignItems: 'center',
    marginTop: 6, flexShrink: 0,
  },
  verseNum: { fontSize: 11, fontWeight: '800', color: COLORS.primary },

  verseAr: {
    fontSize: 22, color: '#1A237E',
    textAlign: 'right', writingDirection: 'rtl',
    lineHeight: 40, fontWeight: '400',
  },
  verseArActive: { color: COLORS.primary, fontWeight: '600' },

  verseFr: {
    fontSize: 13, color: '#555', lineHeight: 20,
    marginTop: 8, textAlign: 'left',
    fontStyle: 'italic',
  },

  bottomBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10, gap: 8,
    backgroundColor: '#FFF',
    borderTopWidth: 1, borderTopColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 8,
  },
  reciterChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6,
    borderWidth: 1, borderColor: COLORS.primary + '25',
  },
  reciterText: { flex: 1, fontSize: 11, fontWeight: '600', color: COLORS.primary },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ctrlBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primary + '12',
    justifyContent: 'center', alignItems: 'center',
  },
  playBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  stopBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: COLORS.error + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  counter: { fontSize: 12, fontWeight: '700', color: COLORS.primary, minWidth: 40, textAlign: 'center' },

  modal: { flex: 1, backgroundColor: '#FAF8F0' },
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
  surahRowActive: { backgroundColor: COLORS.primary + '08' },
  surahNum: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  surahNumText: { fontWeight: '700', color: COLORS.primary, fontSize: 14 },
  surahName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  surahSub2: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
  surahNameAr: { fontSize: 20, color: COLORS.arabicText, fontWeight: '600' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  reciterSheet: {
    backgroundColor: '#FFF',
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
