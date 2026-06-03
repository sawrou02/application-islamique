const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

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
    // Silencieux — ne pas bloquer le flow principal
  }
}

export async function sendDailyReminder(token: string): Promise<void> {
  await sendPushNotification(token, '🌙 Quiz du jour', 'Votre défi quotidien vous attend ! Testez vos connaissances islamiques.', { type: 'daily' });
}

export async function sendStreakReminder(token: string, streak: number): Promise<void> {
  await sendPushNotification(token, '🔥 Ne perdez pas votre série !', `Vous avez une série de ${streak} jours. Jouez aujourd'hui pour la maintenir !`, { type: 'streak', streak });
}

export async function sendDuelInvite(token: string, challengerPseudo: string, duelCode: string): Promise<void> {
  await sendPushNotification(token, '⚔️ Défi reçu !', `${challengerPseudo} vous défie en duel islamique. Code : ${duelCode}`, { type: 'duel', code: duelCode });
}

export async function sendTournoiStart(token: string, tournoiNom: string): Promise<void> {
  await sendPushNotification(token, '🏆 Tournoi en cours !', `Le tournoi "${tournoiNom}" a commencé. Participez pour grimper dans le classement !`, { type: 'tournoi' });
}
