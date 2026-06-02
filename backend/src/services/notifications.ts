import * as admin from 'firebase-admin';

let initialized = false;

export function initFirebase(): void {
  if (initialized) return;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    console.warn('FIREBASE_SERVICE_ACCOUNT_JSON not set — push notifications disabled');
    return;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    initialized = true;
    console.log('Firebase Admin initialized');
  } catch (err) {
    console.error('Failed to initialize Firebase Admin:', err);
  }
}

export async function sendNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> {
  if (!initialized) return;

  try {
    await admin.messaging().send({
      token,
      notification: { title, body },
      data,
    });
  } catch (err) {
    console.error('FCM send error:', err);
  }
}

export async function sendDailyReminder(token: string): Promise<void> {
  await sendNotification(
    token,
    '🌙 Quiz Islamique',
    "C'est l'heure de votre défi quotidien ! Testez vos connaissances islamiques.",
    { type: 'daily_reminder' }
  );
}

export async function sendDuelInvite(
  token: string,
  challengerPseudo: string,
  duelCode: string
): Promise<void> {
  await sendNotification(
    token,
    '⚔️ Défi reçu !',
    `${challengerPseudo} vous défie ! Rejoignez le duel maintenant.`,
    { type: 'duel_invite', duel_code: duelCode, challenger: challengerPseudo }
  );
}

export async function sendStreakReminder(token: string, streak: number): Promise<void> {
  await sendNotification(
    token,
    '🔥 Votre série est en danger !',
    `Ne brisez pas votre série de ${streak} jours. Jouez maintenant !`,
    { type: 'streak_reminder', streak: String(streak) }
  );
}

export async function sendTournoiStart(token: string, tournoiNom: string): Promise<void> {
  await sendNotification(
    token,
    '🏆 Tournoi commencé !',
    `Le tournoi "${tournoiNom}" vient de démarrer. Bonne chance !`,
    { type: 'tournoi_start', tournoi_nom: tournoiNom }
  );
}

// Initialize on module load
initFirebase();
