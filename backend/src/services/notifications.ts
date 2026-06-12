const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

const DAILY_HADITHS = [
  { fr: "Les actions ne valent que par leurs intentions.", ar: "إنما الأعمال بالنيات", en: "Actions are judged by intentions." },
  { fr: "Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.", ar: "خيركم من تعلم القرآن وعلمه", en: "The best of you are those who learn and teach the Quran." },
  { fr: "Facilitez, ne compliquez pas ; rassurez, ne faites pas fuir.", ar: "يسروا ولا تعسروا وبشروا ولا تنفروا", en: "Make things easy, not difficult; give glad tidings." },
  { fr: "Nul ne croit vraiment tant qu'il n'aime pour son frère ce qu'il aime pour lui-même.", ar: "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه", en: "None truly believes until he loves for his brother what he loves for himself." },
  { fr: "Sois dans ce monde comme si tu étais un étranger ou un voyageur.", ar: "كن في الدنيا كأنك غريب أو عابر سبيل", en: "Be in this world as if you were a stranger or a traveler." },
  { fr: "La parole bonne est une aumône.", ar: "الكلمة الطيبة صدقة", en: "A good word is charity." },
  { fr: "Celui qui suit un chemin pour acquérir le savoir, Allah lui facilite le chemin vers le Paradis.", ar: "من سلك طريقاً يلتمس فيه علماً سهل الله له طريقاً إلى الجنة", en: "Whoever takes a path to seek knowledge, Allah makes the path to Paradise easy for him." },
];

function getDailyHadith(): typeof DAILY_HADITHS[0] {
  const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return DAILY_HADITHS[dayOfYear % DAILY_HADITHS.length];
}

export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data?: object
): Promise<void> {
  if (!expoPushToken || !expoPushToken.startsWith('ExponentPushToken')) return;

  try {
    await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: expoPushToken,
        title,
        body,
        sound: 'default',
        data: data || {},
      }),
    });
  } catch {
    // Silencieux
  }
}

export async function sendDailyReminder(token: string, langue = 'fr'): Promise<void> {
  const hadith = getDailyHadith();
  const content = {
    fr: { title: '🌙 Quiz du jour', body: `"${hadith.fr}" — Testez vos connaissances islamiques !` },
    ar: { title: '🌙 اختبار اليوم', body: `"${hadith.ar}" — اختبر معلوماتك الإسلامية !` },
    en: { title: '🌙 Daily Quiz', body: `"${hadith.en}" — Test your Islamic knowledge!` },
  };
  const c = content[langue as keyof typeof content] || content.fr;
  await sendPushNotification(token, c.title, c.body, { type: 'daily' });
}

export async function sendStreakReminder(token: string, streak: number, langue = 'fr'): Promise<void> {
  const content = {
    fr: { title: '🔥 Ne perdez pas votre série !', body: `${streak} jour${streak > 1 ? 's' : ''} de suite — jouez maintenant pour maintenir votre streak !` },
    ar: { title: '🔥 حافظ على سلسلتك!', body: `${streak} يوم متواصل — العب الآن لا تخسر سلسلتك!` },
    en: { title: '🔥 Keep your streak!', body: `${streak} day${streak > 1 ? 's' : ''} in a row — play now to keep it going!` },
  };
  const c = content[langue as keyof typeof content] || content.fr;
  await sendPushNotification(token, c.title, c.body, { type: 'streak', streak });
}

export async function sendDuelInvite(token: string, challengerPseudo: string, duelCode: string, langue = 'fr'): Promise<void> {
  const content = {
    fr: { title: '⚔️ Défi reçu !', body: `${challengerPseudo} vous défie en duel islamique. Code : ${duelCode}` },
    ar: { title: '⚔️ تحدٍّ وصلك!', body: `${challengerPseudo} يتحداك. الرمز: ${duelCode}` },
    en: { title: '⚔️ Challenge received!', body: `${challengerPseudo} challenges you to a duel. Code: ${duelCode}` },
  };
  const c = content[langue as keyof typeof content] || content.fr;
  await sendPushNotification(token, c.title, c.body, { type: 'duel', code: duelCode });
}

export async function sendTournoiStart(token: string, tournoiNom: string, langue = 'fr'): Promise<void> {
  const content = {
    fr: { title: '🏆 Tournoi en cours !', body: `Le tournoi "${tournoiNom}" a commencé !` },
    ar: { title: '🏆 البطولة بدأت!', body: `بطولة "${tournoiNom}" قد انطلقت!` },
    en: { title: '🏆 Tournament started!', body: `Tournament "${tournoiNom}" has begun!` },
  };
  const c = content[langue as keyof typeof content] || content.fr;
  await sendPushNotification(token, c.title, c.body, { type: 'tournoi' });
}

export async function sendBadgeUnlocked(token: string, badgeName: string, langue = 'fr'): Promise<void> {
  const content = {
    fr: { title: '🥇 Badge débloqué !', body: `Félicitations ! Vous avez obtenu le badge "${badgeName}".` },
    ar: { title: '🥇 شارة جديدة!', body: `مبروك! حصلت على شارة "${badgeName}".` },
    en: { title: '🥇 Badge unlocked!', body: `Congratulations! You earned the "${badgeName}" badge.` },
  };
  const c = content[langue as keyof typeof content] || content.fr;
  await sendPushNotification(token, c.title, c.body, { type: 'badge', badge: badgeName });
}
