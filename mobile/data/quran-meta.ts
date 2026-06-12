/**
 * Madinah Mushaf metadata: starting page (1-604) for each surah,
 * and list of available reciters for full-surah audio playback.
 */

// Index 0 unused; SURAH_PAGE[1] = page where surah 1 starts.
export const SURAH_PAGE: number[] = [
  0,
  1, 2, 50, 77, 106, 128, 151, 177, 187, 208,
  221, 235, 249, 255, 262, 267, 282, 293, 305, 312,
  322, 332, 342, 350, 359, 367, 377, 385, 396, 404,
  411, 415, 418, 428, 434, 440, 446, 453, 458, 467,
  477, 483, 489, 496, 499, 502, 507, 511, 515, 518,
  520, 523, 526, 528, 531, 534, 537, 542, 545, 549,
  551, 553, 554, 556, 558, 560, 562, 564, 566, 568,
  570, 572, 574, 575, 577, 578, 580, 582, 583, 585,
  586, 587, 587, 589, 590, 591, 591, 592, 593, 594,
  595, 595, 596, 596, 597, 597, 598, 598, 599, 599,
  600, 600, 601, 601, 601, 602, 602, 602, 603, 603,
  603, 604, 604, 604,
];

// Number of ayahs per surah (index 0 unused)
export const SURAH_AYAH_COUNT: number[] = [
  0,
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
  123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
  60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
  28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
  15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
  5, 4, 5, 6,
];

// Cumulative ayah offsets — SURAH_AYAH_OFFSET[n] = global number of ayah 1 of surah n
export const SURAH_AYAH_OFFSET: number[] = (() => {
  const offsets = [0, 1];
  for (let i = 1; i < SURAH_AYAH_COUNT.length; i++) {
    offsets[i + 1] = (offsets[i] || 0) + (SURAH_AYAH_COUNT[i] || 0);
  }
  return offsets;
})();

export const TOTAL_PAGES = 604;

export function surahFromPage(page: number): number {
  let surah = 1;
  for (let i = 1; i < SURAH_PAGE.length; i++) {
    if (SURAH_PAGE[i] <= page) surah = i;
    else break;
  }
  return surah;
}

export function pageImageUrl(page: number): string {
  return `https://quran.ksu.edu.sa/ayat/safahat1/${page}.png`;
}

/** Global ayah number (1-6236) for surah S, ayah A (1-based) */
export function ayahGlobalNumber(surah: number, ayah: number): number {
  return (SURAH_AYAH_OFFSET[surah] || 1) + ayah - 1;
}

/** Per-ayah MP3 URL from cdn.islamic.network */
export function ayahAudioUrl(cdnId: string, globalAyahNum: number): string {
  return `https://cdn.islamic.network/quran/audio/128/${cdnId}/${globalAyahNum}.mp3`;
}

export interface Reciter {
  id: string;
  name: string;
  nameAr: string;
  /** quran.com recitation_id used by api.quran.com /api/v4/chapter_recitations/{id}/{chapter_id} */
  qcId: number;
  /** cdn.islamic.network edition ID for per-ayah audio */
  cdnId: string;
}

export const RECITERS: Reciter[] = [
  { id: 'alafasy',    name: 'Mishary Al-Afasy',       nameAr: 'مشاري العفاسي',     qcId: 7,  cdnId: 'ar.alafasy' },
  { id: 'husary',     name: 'Mahmoud Al-Husary',      nameAr: 'محمود الحصري',      qcId: 6,  cdnId: 'ar.husary' },
  { id: 'sudais',     name: 'Abdul Rahman Al-Sudais', nameAr: 'عبد الرحمن السديس', qcId: 3,  cdnId: 'ar.abdurrahmaansudais' },
  { id: 'shuraim',    name: 'Saud Al-Shuraim',        nameAr: 'سعود الشريم',       qcId: 10, cdnId: 'ar.saudshuraym' },
  { id: 'shatri',     name: 'Abu Bakr Al-Shatri',     nameAr: 'أبو بكر الشاطري',   qcId: 4,  cdnId: 'ar.shaatree' },
  { id: 'minshawi',   name: 'Mohamed Al-Minshawi',    nameAr: 'محمد المنشاوي',     qcId: 9,  cdnId: 'ar.minshawi' },
  { id: 'abdulbasit', name: 'Abdul Basit (Murattal)', nameAr: 'عبد الباسط (مرتل)', qcId: 2,  cdnId: 'ar.abdulbasitabdulsamad' },
  { id: 'rifai',      name: 'Hani Ar-Rifai',          nameAr: 'هاني الرفاعي',      qcId: 5,  cdnId: 'ar.hanirifai' },
];

/**
 * Fetch the actual MP3 URL from api.quran.com for the chosen reciter + surah.
 * Returns the absolute audio_url (CDN).
 */
export async function fetchRecitationUrl(qcId: number, surah: number): Promise<string> {
  const res = await fetch(`https://api.quran.com/api/v4/chapter_recitations/${qcId}/${surah}`);
  const json = await res.json();
  return json?.audio_file?.audio_url as string;
}
