module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Force Babel to transform ES2022 private class fields — the hermes-stable
      // profile skips this assuming Hermes supports them, but Expo Go SDK 54 does not.
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
    ],
  };
};
