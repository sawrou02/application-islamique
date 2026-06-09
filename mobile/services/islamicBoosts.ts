/**
 * Boosts XP saisonniers — version mobile (logique dupliquée du backend).
 * Permet d'afficher le boost actif sans appel réseau.
 */

export interface XpBoost {
  multiplier: number;
  label: string;
}

const HIJRI_EPOCH_JD = 1948440;
const DAYS_PER_HIJRI_YEAR = 354.367;
const DAYS_PER_HIJRI_MONTH = 29.530589;

function gregorianToJD(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy
    + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

export function gregorianToHijri(date: Date): { year: number; month: number; day: number } {
  const jd = gregorianToJD(date);
  const daysSinceEpoch = jd - HIJRI_EPOCH_JD;
  const year = Math.floor(daysSinceEpoch / DAYS_PER_HIJRI_YEAR) + 1;
  const daysIntoYear = daysSinceEpoch - Math.floor((year - 1) * DAYS_PER_HIJRI_YEAR);
  const month = Math.min(12, Math.floor(daysIntoYear / DAYS_PER_HIJRI_MONTH) + 1);
  const day = Math.floor(daysIntoYear - (month - 1) * DAYS_PER_HIJRI_MONTH) + 1;
  return { year, month, day: Math.min(30, Math.max(1, day)) };
}

export function getCurrentXpBoost(date: Date = new Date()): XpBoost {
  const { month, day } = gregorianToHijri(date);
  const candidates: XpBoost[] = [];

  if (month === 1) {
    if (day === 10) candidates.push({ multiplier: 2, label: "Jour de 'Ashura" });
    if (day <= 10) candidates.push({ multiplier: 1.5, label: '10 premiers jours de Mouharram' });
  }
  if (month === 9) {
    if (day >= 20) candidates.push({ multiplier: 3, label: '10 dernières nuits de Ramadan' });
    candidates.push({ multiplier: 2, label: 'Ramadan' });
  }
  if (month === 10 && day === 1) {
    candidates.push({ multiplier: 2, label: 'Aïd al-Fitr' });
  }
  if (month === 12) {
    if (day === 9) candidates.push({ multiplier: 3, label: 'Jour de Arafat' });
    if (day === 10) candidates.push({ multiplier: 2, label: 'Aïd al-Adha' });
    if (day <= 10) candidates.push({ multiplier: 2, label: '10 premiers jours de Dhul Hijja' });
  }
  if (date.getDay() === 5) {
    candidates.push({ multiplier: 1.5, label: "Jumu'ah" });
  }

  if (candidates.length === 0) return { multiplier: 1, label: '' };
  return candidates.reduce((best, c) => (c.multiplier > best.multiplier ? c : best));
}
