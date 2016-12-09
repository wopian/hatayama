module.exports = function(config) {
  config.set({
    basePath:      './',
    frameworks:    ['browserify', 'jasmine-jquery', 'jasmine', 'es6-shim'],
    colors:        true,
    logLevel:      config.LOG_INFO,
    reporters:     ['spec'],
    browsers:      ['PhantomJS'],
    preprocessors: {
      'tests/**/*.js': ['browserify']
    },
    browserify: {
      debug:     true,
      transform: ['brfs']
    },
    plugins: [
      'karma-jasmine',
      'karma-jasmine-jquery',
      'karma-phantomjs-launcher',
      'karma-spec-reporter',
      'karma-es6-shim',
      'karma-browserify',
      'brfs'
    ],
    files: [
      'tests/**/*.js', 'app/vendor/jquery-2.2.0.min.js',
      {
        pattern:  'tests/fixtures/*.html',
        watched:  true,
        served:   true,
        included: false
      }
    ]
  });
};
