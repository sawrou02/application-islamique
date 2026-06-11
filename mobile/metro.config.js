const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/**
 * Aggressively patch private class fields (#field) → regular properties (_field)
 * in node_modules at Metro startup, AND via post-Babel transformer. Expo Go SDK 54
 * Hermes cannot parse #field, and the hermes-stable Babel profile skips the
 * transform assuming Hermes supports it.
 */
function replacePrivateFields(src) {
  return src.replace(/#([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (_m, n) => `_${n}`);
}

function patchFile(file) {
  if (!fs.existsSync(file)) return;
  let src;
  try { src = fs.readFileSync(file, 'utf8'); } catch { return; }
  if (!/(^|\s|[;{(,])#[a-zA-Z_]/.test(src)) return;
  const out = replacePrivateFields(src);
  if (out !== src) {
    try { fs.writeFileSync(file, out, 'utf8'); } catch { return; }
    console.log('[metro] patched', path.relative(__dirname, file));
  }
}

function patchDir(dir) {
  if (!fs.existsSync(dir)) return;
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules') continue;
      patchDir(full);
    } else if (e.name.endsWith('.js')) {
      patchFile(full);
    }
  }
}

const rnRoot = path.join(__dirname, 'node_modules/react-native');
patchDir(path.join(rnRoot, 'src'));
patchDir(path.join(rnRoot, 'Libraries'));
patchDir(path.join(__dirname, 'node_modules/@expo'));
patchDir(path.join(__dirname, 'node_modules/expo-router'));
patchDir(path.join(__dirname, 'node_modules/expo-modules-core'));

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('./metro-transformer.js'),
};

module.exports = config;
