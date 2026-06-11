const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/**
 * Patch private class fields (#field) to regular properties (_field) in files
 * that Metro/Babel doesn't correctly transform for Hermes in Expo Go SDK 54.
 * Affected: expo-server and react-native's src/private + Libraries/Animated files.
 */
function replacePrivateFields(src) {
  // Replace declarations: #name; or #name = ... (field declarations)
  // Replace accesses: this.#name, other.#name
  // Replace method defs: #name() { and #name = function
  return src
    .replace(/#([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (match, name) => `_${name}`);
}

function patchFile(file) {
  if (!fs.existsSync(file)) return;
  const src = fs.readFileSync(file, 'utf8');
  // Quick check: does the file have actual private field syntax?
  // We look for #word that is NOT inside a comment URL (like /*#__PURE__*/ or http://...#...)
  // A real private field looks like: /#[a-zA-Z_]/ not preceded by http or // comment
  if (!/#[a-zA-Z_]/.test(src)) return;
  // Check if it's already patched (no real #field patterns, only URL fragments)
  if (!/(^|\s|[;{(,])#[a-zA-Z_]/.test(src)) return;

  const patched = replacePrivateFields(src);
  if (patched !== src) {
    fs.writeFileSync(file, patched, 'utf8');
    console.log('[metro] Patched private fields:', path.relative(__dirname, file));
  }
}

function patchDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      patchDir(full);
    } else if (entry.name.endsWith('.js') && !entry.name.endsWith('.map.js')) {
      patchFile(full);
    }
  }
}

// Patch expo-server (not Babel-transformed, has private class fields)
patchDir(path.join(__dirname, 'node_modules/expo-server/build'));

// Patch react-native src/private (not correctly transformed by Babel for hermes-stable)
patchDir(path.join(__dirname, 'node_modules/react-native/src/private'));

// Patch react-native Libraries that also use private fields
const rnLibraries = [
  'node_modules/react-native/Libraries/Animated/nodes',
  'node_modules/react-native/Libraries/Animated/animations',
  'node_modules/react-native/Libraries/vendor/emitter',
  'node_modules/react-native/Libraries/Debugging',
];
for (const lib of rnLibraries) {
  patchDir(path.join(__dirname, lib));
}

const config = getDefaultConfig(__dirname);

module.exports = config;
