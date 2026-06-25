import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuranAudioStore } from '../store/quranAudioStore';

export function QuranMiniPlayer() {
  const { isPlaying, isPaused, surahName, surahNumber, ayahIdx, totalAyahs, onPauseResume, onStop } = useQuranAudioStore();

  if (!isPlaying) return null;

  return (
    <TouchableOpacity
      style={styles.bar}
      activeOpacity={0.9}
      onPress={() => router.push(`/coran/${surahNumber}` as any)}
    >
      <MaterialCommunityIcons name="book-open-variant" size={18} color="#FFD700" />
      <View style={styles.info}>
        <Text style={styles.surahName} numberOfLines={1}>{surahName || 'Coran'}</Text>
        <Text style={styles.ayahNum}>
          {isPaused ? '⏸ En pause' : '▶ En cours'} • {ayahIdx + 1} / {totalAyahs}
        </Text>
      </View>
      <TouchableOpacity style={styles.iconBtn} onPress={onPauseResume || undefined}>
        <MaterialCommunityIcons name={isPaused ? 'play' : 'pause'} size={22} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconBtn} onPress={onStop || undefined}>
        <MaterialCommunityIcons name="stop" size={20} color="#FF5252" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: 'rgba(27,94,32,0.97)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  info: { flex: 1 },
  surahName: { fontSize: 14, fontWeight: '700', color: '#FFD700' },
  ayahNum: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 1 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
});
