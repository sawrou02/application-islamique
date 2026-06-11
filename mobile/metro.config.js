const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// expo-server's ImmutableRequest.js uses ES2022 private class fields (#field)
// which Hermes in Expo Go SDK 54 cannot parse at runtime.
// We redirect any resolution of that file to a pre-patched local copy.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolve = originalResolveRequest
    ? (ctx, mod, plat) => originalResolveRequest(ctx, mod, plat)
    : (ctx, mod, plat) => ctx.resolveRequest(ctx, mod, plat);

  const result = resolve(context, moduleName, platform);

  if (
    result &&
    result.filePath &&
    result.filePath.includes('expo-server') &&
    result.filePath.includes('ImmutableRequest.js')
  ) {
    return {
      ...result,
      filePath: path.join(__dirname, 'patches/expo-server-ImmutableRequest.js'),
    };
  }

  return result;
};

module.exports = config;
