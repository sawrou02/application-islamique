/**
 * Custom Metro transformer that patches ES2022 private class fields (#field)
 * after Babel transformation. The hermes-stable Babel profile skips this transform
 * assuming Hermes supports it natively, but Expo Go SDK 54's Hermes does not.
 * Running the fix on the Babel output catches everything Babel misses.
 */
const upstreamTransformer = require('@expo/metro-config/build/babel-transformer');

module.exports.transform = async function transform(params) {
  const result = await upstreamTransformer.transform(params);
  if (result.code && /#[a-zA-Z_]/.test(result.code)) {
    result.code = result.code.replace(
      /#([a-zA-Z_][a-zA-Z0-9_]*)\b/g,
      (match, name) => `_${name}`
    );
  }
  return result;
};
