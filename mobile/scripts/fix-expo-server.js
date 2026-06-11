/**
 * Postinstall patch: replaces private class fields (#field) in expo-server's
 * ImmutableRequest.js with regular properties so Hermes in Expo Go SDK 54
 * can parse the JS bundle at runtime.
 */
const fs = require('fs');
const path = require('path');

const targets = [
  'node_modules/expo-server/build/cjs/ImmutableRequest.js',
  'node_modules/expo-server/build/mjs/ImmutableRequest.js',
];

for (const rel of targets) {
  const file = path.join(__dirname, '..', rel);
  if (!fs.existsSync(file)) {
    console.log('[fix-expo-server] Not found (skip):', rel);
    continue;
  }
  let src = fs.readFileSync(file, 'utf8');
  if (!src.includes('#')) {
    console.log('[fix-expo-server] Already patched:', rel);
    continue;
  }
  src = src
    .replace(/#throwImmutableError\b/g, '_throwImmutableError')
    .replace(/#throwImmutableBodyError\b/g, '_throwImmutableBodyError')
    .replace(/#headers\b/g, '_headers')
    .replace(/#request\b/g, '_request');
  fs.writeFileSync(file, src, 'utf8');
  console.log('[fix-expo-server] Patched:', rel);
}
