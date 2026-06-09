import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRAYER_PREFS_KEY = 'prayer_notification_prefs';

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
