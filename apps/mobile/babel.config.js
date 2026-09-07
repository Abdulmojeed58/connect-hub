module.exports = function (api) {
  api.cache(true);
  const isTest = process.env.NODE_ENV === 'test';

  if (isTest) {
    // Skip nativewind JSX transform in Jest — className becomes a plain string prop
    return {
      presets: ['babel-preset-expo'],
    };
  }

  // For Metro (dev / prod build): jsxImportSource is all NativeWind v4 needs
  // from Babel. The metro config (withNativeWind) handles the CSS processing.
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
  };
};
