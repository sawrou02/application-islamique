// Horaires de prière via API gratuite aladhan.com
const API = 'https://api.aladhan.com/v1';

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak?: string;
}

export interface PrayerResponse {
  timings: PrayerTimes;
  date: { readable: string; hijri: { date: string; month: { en: string; ar: string }; year: string } };
  meta: { latitude: number; longitude: number; timezone: string; method: { name: string } };
}

export async function fetchPrayerTimesByCoords(lat: number, lng: number, method = 2): Promise<PrayerResponse> {
  const date = new Date();
  const d = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  const url = `${API}/timings/${d}?latitude=${lat}&longitude=${lng}&method=${method}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.data;
}

export async function fetchPrayerTimesByCity(city: string, country: string, method = 2): Promise<PrayerResponse> {
  const date = new Date();
  const d = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  const url = `${API}/timingsByCity/${d}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.data;
}

export function nextPrayer(times: PrayerTimes): { name: string; time: string; remainingMs: number } | null {
  const order = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
  const now = new Date();
  for (const name of order) {
    const [h, m] = times[name].split(':').map(Number);
    const t = new Date();
    t.setHours(h, m, 0, 0);
    if (t.getTime() > now.getTime()) {
      return { name, time: times[name], remainingMs: t.getTime() - now.getTime() };
    }
  }
  // Toutes passées → Fajr du lendemain
  const [h, m] = times.Fajr.split(':').map(Number);
  const t = new Date();
  t.setDate(t.getDate() + 1);
  t.setHours(h, m, 0, 0);
  return { name: 'Fajr', time: times.Fajr, remainingMs: t.getTime() - now.getTime() };
}

export function formatRemaining(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
}
