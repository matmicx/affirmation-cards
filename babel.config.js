module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // Remove this line:
    // plugins: ["nativewind/babel"],
  };
};
