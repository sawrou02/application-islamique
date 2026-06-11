module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Force transform of ES2022 private class fields — hermes-stable Babel profile
      // skips this transform assuming Hermes supports it, but Expo Go SDK 54 does not.
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
    ],
  };
};
