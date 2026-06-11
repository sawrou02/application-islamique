const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/**
 * Patch private class fields (#field) to regular properties (_field) in files
 * that Metro/Babel doesn't correctly transform for Hermes in Expo Go SDK 54.
 * The hermes-stable Babel profile skips the private-class-elements transform,
 * causing Hermes to crash at bundle parse time with "private properties are not supported".
 */
function replacePrivateFields(src) {
  return src
    .replace(/#([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (match, name) => `_${name}`);
}

function patchFile(file) {
  if (!fs.existsSync(file)) return;
  let src;
  try {
    src = fs.readFileSync(file, 'utf8');
  } catch (e) {
    return;
  }
  if (!/#[a-zA-Z_]/.test(src)) return;
  if (!/(^|\s|[;{(,])#[a-zA-Z_]/.test(src)) return;

  const patched = replacePrivateFields(src);
  if (patched !== src) {
    fs.writeFileSync(file, patched, 'utf8');
    console.log('[metro] Patched private fields:', path.relative(__dirname, file));
  }
}

function patchDir(dir) {
  if (!fs.existsSync(dir)) return;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return;
  }
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

// Patch ALL of react-native src and Libraries to catch every private class field
// (hermes-stable Babel profile does not transform them, causing Hermes parse errors)
patchDir(path.join(__dirname, 'node_modules/react-native/src'));
patchDir(path.join(__dirname, 'node_modules/react-native/Libraries'));

const config = getDefaultConfig(__dirname);

module.exports = config;
