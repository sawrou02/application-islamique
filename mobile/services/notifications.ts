import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRAYER_PREFS_KEY = 'prayer_notification_prefs';
const ADHKAR_PREFS_KEY = 'adhkar_notification_prefs';

export interface AdhkarPrefs {
  matin: { enabled: boolean; hour: number; minute: number };
  soir:  { enabled: boolean; hour: number; minute: number };
}

export const DEFAULT_ADHKAR_PREFS: AdhkarPrefs = {
  matin: { enabled: false, hour: 6,  minute: 30 },
  soir:  { enabled: false, hour: 18, minute: 0  },
};

export async function loadAdhkarPrefs(): Promise<AdhkarPrefs> {
  try {
    const raw = await AsyncStorage.getItem(ADHKAR_PREFS_KEY);
    if (!raw) return DEFAULT_ADHKAR_PREFS;
    return { ...DEFAULT_ADHKAR_PREFS, ...JSON.parse(raw) };
  } catch { return DEFAULT_ADHKAR_PREFS; }
}

export async function saveAdhkarPrefs(prefs: AdhkarPrefs): Promise<void> {
  await AsyncStorage.setItem(ADHKAR_PREFS_KEY, JSON.stringify(prefs));
}

export async function scheduleAdhkarNotifications(prefs: AdhkarPrefs, lang = 'fr'): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if ((n.content.data as any)?.type === 'adhkar') {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
  const content = {
    matin: {
      fr: { title: '🌅 Adhkar du matin', body: 'Commence ta journée par le rappel d’Allah.' },
      ar: { title: '🌅 أذكار الصباح', body: 'ابدأ يومك بذكر الله.' },
      en: { title: '🌅 Morning adhkar', body: 'Begin your day with the remembrance of Allah.' },
    },
    soir: {
      fr: { title: '🌙 Adhkar du soir', body: 'Récite les adhkar du soir pour ta protection.' },
      ar: { title: '🌙 أذكار المساء', body: 'اذكر الله مساءً ليحفظك.' },
      en: { title: '🌙 Evening adhkar', body: 'Recite the evening remembrance for your protection.' },
    },
  };
  for (const key of ['matin', 'soir'] as const) {
    if (!prefs[key].enabled) continue;
    const c = content[key][lang as 'fr' | 'ar' | 'en'] || content[key].fr;
    await Notifications.scheduleNotificationAsync({
      content: { title: c.title, body: c.body, sound: true, data: { type: 'adhkar', period: key } },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: prefs[key].hour, minute: prefs[key].minute,
      },
    });
  }
}


export interface PrayerPrefs {
  fajr:    { enabled: boolean; hour: number; minute: number };
  dhuhr:   { enabled: boolean; hour: number; minute: number };
  asr:     { enabled: boolean; hour: number; minute: number };
  maghrib: { enabled: boolean; hour: number; minute: number };
  isha:    { enabled: boolean; hour: number; minute: number };
}

export const DEFAULT_PRAYER_PREFS: PrayerPrefs = {
  fajr:    { enabled: false, hour: 5,  minute: 0  },
  dhuhr:   { enabled: false, hour: 13, minute: 0  },
  asr:     { enabled: false, hour: 16, minute: 30 },
  maghrib: { enabled: false, hour: 19, minute: 0  },
  isha:    { enabled: false, hour: 21, minute: 0  },
};

const PRAYER_NAMES: Record<keyof PrayerPrefs, { fr: string; ar: string; en: string }> = {
  fajr:    { fr: 'Fajr',    ar: 'الفجر',  en: 'Fajr'    },
  dhuhr:   { fr: 'Dhuhr',   ar: 'الظهر',  en: 'Dhuhr'   },
  asr:     { fr: 'Asr',     ar: 'العصر',  en: 'Asr'     },
  maghrib: { fr: 'Maghrib', ar: 'المغرب', en: 'Maghrib' },
  isha:    { fr: 'Isha',    ar: 'العشاء', en: 'Isha'    },
};

export async function loadPrayerPrefs(): Promise<PrayerPrefs> {
  try {
    const raw = await AsyncStorage.getItem(PRAYER_PREFS_KEY);
    if (!raw) return DEFAULT_PRAYER_PREFS;
    return { ...DEFAULT_PRAYER_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PRAYER_PREFS;
  }
}

export async function savePrayerPrefs(prefs: PrayerPrefs): Promise<void> {
  await AsyncStorage.setItem(PRAYER_PREFS_KEY, JSON.stringify(prefs));
}

export async function schedulePrayerNotifications(prefs: PrayerPrefs, lang = 'fr'): Promise<void> {
  // Annule tous les rappels de prière existants
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if ((n.content.data as any)?.type === 'prayer') {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }

  for (const [key, pref] of Object.entries(prefs) as [keyof PrayerPrefs, PrayerPrefs[keyof PrayerPrefs]][]) {
    if (!pref.enabled) continue;

    const name = PRAYER_NAMES[key][lang as 'fr' | 'ar' | 'en'] || PRAYER_NAMES[key].fr;
    const content = {
      fr: { title: `🕌 ${name}`, body: `L'heure de ${name} est arrivée. بسم الله` },
      ar: { title: `🕌 ${name}`, body: `حان وقت صلاة ${name}. بسم الله` },
      en: { title: `🕌 ${name}`, body: `It's time for ${name} prayer. بسم الله` },
    };
    const c = content[lang as keyof typeof content] || content.fr;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: c.title,
        body: c.body,
        sound: true,
        data: { type: 'prayer', prayer: key },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: pref.hour,
        minute: pref.minute,
      },
    });
  }
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
    await Notifications.setNotificationChannelAsync('prayer', {
      name: 'Rappels de prière',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export function setupNotificationHandlers() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}
