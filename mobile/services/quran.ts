import AsyncStorage from '@react-native-async-storage/async-storage';

// API libre, gratuite, sans clé : https://alquran.cloud/api
const API = 'https://api.alquran.cloud/v1';
const CACHE_PREFIX = 'quran_cache_';
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours

export interface SurahMeta {
  number: number;
  name: string;          // اسم السورة
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  juz?: number;
  page?: number;
}

export interface SurahFull {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs_ar: Ayah[];
  ayahs_fr: Ayah[];
  ayahs_en: Ayah[];
}

async function fromCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: T; savedAt: number };
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch { return null; }
}

async function toCache<T>(key: string, data: T): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, savedAt: Date.now() }));
  } catch { /* silencieux */ }
}

export async function fetchSurahList(): Promise<SurahMeta[]> {
  const cached = await fromCache<SurahMeta[]>('surahs');
  if (cached) return cached;
  const res = await fetch(`${API}/surah`);
  const json = await res.json();
  const data: SurahMeta[] = json.data;
  await toCache('surahs', data);
  return data;
}

export async function fetchSurah(num: number): Promise<SurahFull> {
  const cached = await fromCache<SurahFull>(`surah_${num}`);
  if (cached) return cached;
  // Récupère arabe + traduction française + anglaise en une requête batch
  const res = await fetch(`${API}/surah/${num}/editions/quran-uthmani,fr.hamidullah,en.sahih`);
  const json = await res.json();
  const [ar, fr, en] = json.data;
  const full: SurahFull = {
    number: ar.number,
    name: ar.name,
    englishName: ar.englishName,
    englishNameTranslation: ar.englishNameTranslation,
    revelationType: ar.revelationType,
    numberOfAyahs: ar.numberOfAyahs,
    ayahs_ar: ar.ayahs,
    ayahs_fr: fr.ayahs,
    ayahs_en: en.ayahs,
  };
  await toCache(`surah_${num}`, full);
  return full;
}
