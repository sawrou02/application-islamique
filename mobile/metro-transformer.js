/**
 * Custom Metro Babel transformer that post-processes Babel output to replace
 * ES2022 private class fields (#field) with regular properties (_field).
 *
 * Expo Go SDK 54 Hermes cannot parse #field syntax, but the hermes-stable
 * Babel profile skips the transform assuming Hermes supports them. This wrapper
 * runs AFTER Babel and cleans up anything Babel left untouched.
 */

const upstreamTransformer = require('@expo/metro-config/build/babel-transformer');

module.exports.transform = async function transform(params) {
  const result = await upstreamTransformer.transform(params);

  if (result.code) {
    result.code = result.code.replace(
      /#([a-zA-Z_][a-zA-Z0-9_]*)\b/g,
      (_match, name) => `_${name}`
    );
  }

  return result;
};
