const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

// Patch expo-server's ImmutableRequest.js every time Metro starts.
// Hermes in Expo Go SDK 54 cannot parse ES2022 private class fields (#field).
// This runs before Metro builds the bundle, so no npm install needed.
(function patchExpoServer() {
  const targets = [
    'node_modules/expo-server/build/cjs/ImmutableRequest.js',
    'node_modules/expo-server/build/mjs/ImmutableRequest.js',
  ];
  for (const rel of targets) {
    const file = path.join(__dirname, rel);
    if (!fs.existsSync(file)) continue;
    let src = fs.readFileSync(file, 'utf8');
    if (!src.includes('#throwImmutableError') && !src.includes('#headers;') && !src.includes('#request;')) {
      console.log('[metro] expo-server already patched:', rel);
      continue;
    }
    src = src
      .replace(/#throwImmutableError\b/g, '_throwImmutableError')
      .replace(/#throwImmutableBodyError\b/g, '_throwImmutableBodyError')
      .replace(/#headers\b/g, '_headers')
      .replace(/#request\b/g, '_request');
    fs.writeFileSync(file, src, 'utf8');
    console.log('[metro] Patched expo-server private fields in:', rel);
  }
})();

const config = getDefaultConfig(__dirname);

module.exports = config;
