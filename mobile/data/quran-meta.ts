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

export interface Reciter {
  id: string;
  name: string;
  nameAr: string;
  edition: string; // islamic.network audio-surah edition id
}

export const RECITERS: Reciter[] = [
  { id: 'alafasy',    name: 'Mishary Al-Afasy',          nameAr: 'مشاري العفاسي',       edition: 'ar.alafasy' },
  { id: 'husary',     name: 'Mahmoud Al-Husary',         nameAr: 'محمود الحصري',        edition: 'ar.husary' },
  { id: 'sudais',     name: 'Abdul Rahman Al-Sudais',    nameAr: 'عبد الرحمن السديس',   edition: 'ar.abdurrahmaansudais' },
  { id: 'shuraim',    name: 'Saud Al-Shuraim',           nameAr: 'سعود الشريم',         edition: 'ar.saoodashureem' },
  { id: 'muaiqly',   name: 'Maher Al-Muaiqly',          nameAr: 'ماهر المعيقلي',       edition: 'ar.mahermuaiqly' },
  { id: 'minshawi',   name: 'Mohamed Al-Minshawi',       nameAr: 'محمد المنشاوي',       edition: 'ar.minshawi' },
  { id: 'abdulbasit', name: 'Abdul Basit',               nameAr: 'عبد الباسط',          edition: 'ar.abdulbasit' },
  { id: 'ayyoub',     name: 'Muhammad Ayyoub',           nameAr: 'محمد أيوب',           edition: 'ar.muhammadayyoub' },
];

export function recitationUrl(reciterEdition: string, surah: number): string {
  return `https://cdn.islamic.network/quran/audio-surah/128/${reciterEdition}/${surah}.mp3`;
}
