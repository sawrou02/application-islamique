/**
 * Custom Metro Babel transformer that replaces ES2022 private class fields
 * (#field) with regular properties (_field) after Babel runs.
 * Expo Go SDK 54 Hermes cannot parse #field syntax.
 */

let upstreamTransformer;
try {
  upstreamTransformer = require('@expo/metro-config/babel-transformer');
} catch (e) {
  upstreamTransformer = require('@expo/metro-config/build/babel-transformer');
}

let logged = false;

module.exports.transform = async function transform(params) {
  if (!logged) {
    console.log('[metro-transformer] ACTIVE — patching #field -> _field');
    logged = true;
  }

  const result = await upstreamTransformer.transform(params);

  if (result && result.code && result.code.indexOf('#') !== -1) {
    result.code = result.code.replace(
      /#([a-zA-Z_][a-zA-Z0-9_]*)\b/g,
      (_match, name) => `_${name}`
    );
  }

  return result;
};
