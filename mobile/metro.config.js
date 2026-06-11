const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

/**
 * Wire in our custom Babel transformer that post-processes all JS output
 * to replace ES2022 private class fields (#field → _field).
 *
 * Expo Go SDK 54 Hermes cannot parse #field syntax, and the hermes-stable
 * Babel profile skips the transform. This ensures every file in every package
 * gets cleaned up after Babel runs.
 */
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('./metro-transformer.js'),
};

module.exports = config;
