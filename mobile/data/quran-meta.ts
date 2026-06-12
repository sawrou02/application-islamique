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
  /** quran.com recitation_id used by api.quran.com /api/v4/chapter_recitations/{id}/{chapter_id} */
  qcId: number;
}

export const RECITERS: Reciter[] = [
  { id: 'alafasy',     name: 'Mishary Al-Afasy',          nameAr: 'مشاري العفاسي',       qcId: 7 },
  { id: 'husary',      name: 'Mahmoud Al-Husary',         nameAr: 'محمود الحصري',        qcId: 6 },
  { id: 'sudais',      name: 'Abdul Rahman Al-Sudais',    nameAr: 'عبد الرحمن السديس',   qcId: 3 },
  { id: 'shuraim',     name: 'Saud Al-Shuraim',           nameAr: 'سعود الشريم',         qcId: 10 },
  { id: 'shatri',      name: 'Abu Bakr Al-Shatri',        nameAr: 'أبو بكر الشاطري',     qcId: 4 },
  { id: 'minshawi',    name: 'Mohamed Al-Minshawi',       nameAr: 'محمد المنشاوي',       qcId: 9 },
  { id: 'abdulbasit',  name: 'Abdul Basit (Murattal)',    nameAr: 'عبد الباسط (مرتل)',   qcId: 2 },
  { id: 'rifai',       name: 'Hani Ar-Rifai',             nameAr: 'هاني الرفاعي',        qcId: 5 },
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

