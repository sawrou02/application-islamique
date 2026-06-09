import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const PING_URL = 'https://application-islamique-production.up.railway.app/api/health';
const PING_TIMEOUT = 4000;

async function checkOnline(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), PING_TIMEOUT);
    const res = await fetch(PING_URL, { method: 'HEAD', signal: controller.signal });
    clearTimeout(id);
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const online = await checkOnline();
      if (!cancelled) setIsOnline(online);
    }

    refresh();

    const interval = setInterval(refresh, 15000); // vérif toutes les 15s

    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && next === 'active') {
        refresh();
      }
      appState.current = next;
    });

    return () => {
      cancelled = true;
      clearInterval(interval);
      sub.remove();
    };
  }, []);

  return isOnline;
}

export { checkOnline };
