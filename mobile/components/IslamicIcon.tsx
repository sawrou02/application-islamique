import { Text, TextStyle, StyleProp } from 'react-native';

/**
 * IslamicIcon — Remplace les icônes Ionicons par des symboles Unicode
 * (islamiques, géométriques, typographiques) pour donner un caractère
 * calligraphique à l'interface.
 *
 * Tailles et couleurs équivalentes à Ionicons (size en px, color hex).
 */

export type IslamicIconName =
  // Sémantique
  | 'close' | 'check' | 'check-circle' | 'close-circle'
  | 'back' | 'next' | 'forward' | 'down' | 'up'
  // Navigation
  | 'home' | 'quiz' | 'multi' | 'profile' | 'leaderboard'
  // Actions
  | 'play' | 'add' | 'enter' | 'share' | 'refresh' | 'logout'
  // Contenu
  | 'book' | 'layers' | 'help' | 'language' | 'mail'
  // Statut
  | 'star' | 'flame' | 'trending' | 'time' | 'award'
  | 'flag' | 'lock' | 'settings' | 'notification' | 'info'
  | 'trophy' | 'people' | 'person' | 'crescent';

// Mapping nom -> symbole Unicode
const SYMBOLS: Record<IslamicIconName, string> = {
  // Sémantique
  close: '✕',          // ✕
  check: '✓',          // ✓
  'check-circle': '✔', // ✔
  'close-circle': '✖', // ✖
  back: '‹',           // ‹
  next: '›',           // ›
  forward: '›',
  down: '⌄',
  up: '⌃',
  // Navigation
  home: '۞',           // ۞
  quiz: '❋',           // ❋
  multi: '✦',          // ✦
  profile: '◈',        // ◈
  leaderboard: '★',    // ★
  // Actions
  play: '▶',           // ▶
  add: '➕',            // ➕
  enter: '↵',          // ↵
  share: '⧉',          // ⧉
  refresh: '⟳',        // ⟳
  logout: '⇥',         // ⇥
  // Contenu
  book: '✬',           // ✬ (étoile-livre)
  layers: '⧉',         // ⧉
  help: '⍰',           // ⍰
  language: ' أب',
  mail: '✉',           // ✉
  // Statut
  star: '★',           // ★
  flame: '✷',          // ✷
  trending: '↗',       // ↗
  time: '⧗',           // ⧗
  award: '✧',          // ✧
  flag: '⚑',           // ⚑
  lock: '⊕',           // ⊕
  settings: '⚙',       // ⚙
  notification: '◉',   // ◉
  info: 'ⓘ',           // ⓘ
  trophy: '♕',         // ♕ (couronne)
  people: '⛂',         // ⛂
  person: '◈',         // ◈
  crescent: '☪',       // ☪
};

interface Props {
  name: IslamicIconName | string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function IslamicIcon({ name, size = 18, color = '#1B5E20', style }: Props) {
  const symbol = SYMBOLS[name as IslamicIconName] ?? '❖'; // ❖ fallback
  // Compense le rendu vertical des glyphes Unicode (ligne de base flottante)
  const lineHeight = size * 1.05;
  return (
    <Text
      allowFontScaling={false}
      style={[
        {
          fontSize: size,
          lineHeight,
          color,
          textAlign: 'center',
          includeFontPadding: false,
        },
        style,
      ]}
    >
      {symbol}
    </Text>
  );
}

export default IslamicIcon;
