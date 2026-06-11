const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

/**
 * Use a custom transformer that patches ES2022 private class fields (#field)
 * after Babel runs. The hermes-stable profile skips this transform, but
 * Expo Go SDK 54's Hermes does not support private fields natively.
 */
config.transformer = {
  ...config.transformer,
  transformerPath: require.resolve('./metro-transformer.js'),
};

module.exports = config;
