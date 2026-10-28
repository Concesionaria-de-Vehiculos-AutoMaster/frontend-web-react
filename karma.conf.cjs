module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [{ pattern: 'tests/karma.bundle.js', watched: false }],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    reporters: ['progress'],
    client: { jasmine: { random: false } },
    browserNoActivityTimeout: 30000,
    captureTimeout: 30000
  });
};
