module.exports = function(config) {
  config.set({
    basePath:      './',
    frameworks:    ['browserify', 'jasmine-jquery', 'jasmine'],
    colors:        true,
    logLevel:      config.LOG_INFO,
    reporters:     ['spec', 'coverage'],
    browsers:      ['PhantomJS'],
    preprocessors: {
      'tests/**/*.js':     ['browserify'],
      'tests/fixtures/js': ['babel'],
      'app/**.*.js':       ['coverage']
    },
    browserify: {
      debug:     true,
      // transform: ['brfs']
      transform: ['babelify']
    },
    coverageReporter: {
      type:                'lcovonly',
      // specify a common output directory
      dir:                 'coverage',
      instrumenterOptions: {
        istanbul: { noCompact: true }
      }
    },
    plugins: [
      'karma-jasmine',
      'karma-jasmine-jquery',
      'karma-phantomjs-launcher',
      'karma-spec-reporter',
      'karma-babel-preprocessor',
      'karma-browserify',
      'karma-coverage'
      // 'brfs',
    ],
    files: [
      'tests/**/*.js',
      'app/vendor/jquery-2.2.0.min.js',
      {
        pattern:  'tests/fixtures/*.html',
        watched:  true,
        served:   true,
        included: false
      }
    ]
  });
};
