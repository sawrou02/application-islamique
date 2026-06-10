const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Transpile packages that use private class fields (#field) incompatible with Hermes
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

const defaultBlockList = config.resolver.blockList || [];
config.resolver.blockList = defaultBlockList;

// Force transpilation of socket.io packages that use modern JS syntax
config.resolver.sourceExts = [...(config.resolver.sourceExts || [])];

const originalTransformIgnorePatterns = config.transformer.transformIgnorePatterns || [
  'node_modules/(?!(react-native|@react-native|expo|@expo|@unimodules|unimodules|sentry-expo|native-base|react-native-svg)/)',
];

config.transformer.transformIgnorePatterns = [
  'node_modules/(?!(react-native|@react-native|expo|@expo|@unimodules|unimodules|sentry-expo|native-base|react-native-svg|socket\\.io-client|engine\\.io-client|@socket\\.io|socket\\.io-parser)/)',
];

module.exports = config;
