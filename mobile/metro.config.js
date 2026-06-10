const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// socket.io-client uses private class fields (#field) unsupported by Hermes.
// Force Metro to transpile these packages through Babel.
config.transformer.transformIgnorePatterns = [
  'node_modules/(?!' +
  [
    'react-native',
    '@react-native',
    'expo',
    '@expo',
    'react-native-reanimated',
    'react-native-gesture-handler',
    'react-native-screens',
    'react-native-safe-area-context',
    '@react-native-async-storage',
    'socket\\.io-client',
    'engine\\.io-client',
    'socket\\.io-parser',
    '@socket\\.io',
  ].join('|') +
  ')',
];

module.exports = config;
