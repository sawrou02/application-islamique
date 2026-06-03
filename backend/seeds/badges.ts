import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const BADGES = [
  {
    nom: 'Al-Mujahid',
    nom_ar: 'المجاهد',
    description: 'Maintenir un streak de 7 jours consécutifs dans le défi quotidien',
    icone: '⚔️',
    condition_json: { type: 'streak', days: 7 },
  },
  {
    nom: 'Al-Hafiz',
    nom_ar: 'الحافظ',
    description: 'Répondre correctement à 100 questions sur le Coran et le Tafsir',
    icone: '📖',
    condition_json: { type: 'count', domain: 'tafsir', count: 100 },
  },
  {
    nom: 'Al-Faqih',
    nom_ar: 'الفقيه',
    description: 'Maîtriser le Fiqh des Ibadaat (niveau 4+ dans le domaine Fiqh)',
    icone: '📚',
    condition_json: { type: 'domain', domain: 'fiqh', min_niveau: 4 },
  },
  {
    nom: 'As-Siddiq',
    nom_ar: 'الصديق',
    description: 'Obtenir 100% de bonnes réponses en Aqida de niveau 5',
    icone: '🌟',
    condition_json: { type: 'score', domain: 'aqida', min_niveau: 5, min_score: 100 },
  },
  {
    nom: 'Al-Muhadith',
    nom_ar: 'المحدث',
    description: 'Répondre correctement à 50 questions de Hadith de niveau 4 ou plus',
    icone: '📜',
    condition_json: { type: 'count', domain: 'hadith', min_niveau: 4, count: 50 },
  },
  {
    nom: 'Sahib As-Sabr',
    nom_ar: 'صاحب الصبر',
    description: 'Compléter le défi quotidien pendant 30 jours',
    icone: '🌙',
    condition_json: { type: 'streak', days: 30 },
  },
  {
    nom: 'Al-Mufti',
    nom_ar: 'المفتي',
    description: 'Atteindre le niveau maximum (Mufti) dans tous les domaines',
    icone: '🏆',
    condition_json: { type: 'level', min_niveau: 6 },
  },
];

export async function seedBadges(client: Client): Promise<void> {
  for (const badge of BADGES) {
    await client.query(
      `INSERT INTO badges (nom, nom_ar, description, icone, condition_json)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING`,
      [badge.nom, badge.nom_ar, badge.description, badge.icone, JSON.stringify(badge.condition_json)]
    );
  }
  console.log(`Seeded ${BADGES.length} badges.`);
}
