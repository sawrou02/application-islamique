const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// expo-server (dep of expo-router) uses private class fields (#field)
// which Hermes in Expo Go SDK 54 cannot parse natively.
// Force Babel to transpile it along with the standard RN/Expo packages.
config.transformer.transformIgnorePatterns = [
  'node_modules/(?!(react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|expo-server|react-native-gesture-handler|react-native-safe-area-context|react-native-screens|@react-native-async-storage)/)',
];

module.exports = config;
