import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleProp, TextStyle } from 'react-native';

export type IslamicIconName =
  | 'close' | 'check' | 'check-circle' | 'close-circle'
  | 'back' | 'next' | 'forward' | 'down' | 'up'
  | 'home' | 'quiz' | 'multi' | 'profile' | 'leaderboard'
  | 'play' | 'add' | 'enter' | 'share' | 'refresh' | 'logout'
  | 'book' | 'layers' | 'help' | 'language' | 'mail'
  | 'star' | 'flame' | 'trending' | 'time' | 'award'
  | 'flag' | 'lock' | 'settings' | 'notification' | 'info'
  | 'trophy' | 'people' | 'person' | 'crescent';

const ICONS: Record<IslamicIconName, keyof typeof MaterialCommunityIcons.glyphMap> = {
  close:         'close',
  check:         'check',
  'check-circle':'check-circle',
  'close-circle':'close-circle',
  back:          'arrow-left',
  next:          'arrow-right',
  forward:       'arrow-right',
  down:          'chevron-down',
  up:            'chevron-up',
  home:          'home-variant',
  quiz:          'head-question-outline',
  multi:         'account-group',
  profile:       'account-circle',
  leaderboard:   'trophy',
  play:          'play',
  add:           'plus',
  enter:         'login',
  share:         'share-variant',
  refresh:       'refresh',
  logout:        'logout',
  book:          'book-open-variant',
  layers:        'layers-triple',
  help:          'help-circle',
  language:      'translate',
  mail:          'email',
  star:          'star',
  flame:         'fire',
  trending:      'trending-up',
  time:          'clock-outline',
  award:         'medal',
  flag:          'flag',
  lock:          'lock',
  settings:      'cog',
  notification:  'bell',
  info:          'information',
  trophy:        'trophy',
  people:        'account-group',
  person:        'account',
  crescent:      'moon-waxing-crescent',
};

interface Props {
  name: IslamicIconName | string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function IslamicIcon({ name, size = 18, color = '#1B5E20' }: Props) {
  const iconName = (ICONS[name as IslamicIconName] ?? 'circle') as keyof typeof MaterialCommunityIcons.glyphMap;
  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
}

export default IslamicIcon;
