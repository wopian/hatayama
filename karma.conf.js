module.exports = function(config) {
  config.set({
    basePath:         './',
    frameworks:       ['browserify', 'jasmine-jquery', 'jasmine'],
    colors:           true,
    logLevel:         config.LOG_DEBUG,
    reportSlowerThan: 500,
    // reporters:     ['spec', 'coverage'],
    reporters:        ['mocha', 'coverage'],
    browsers:         ['PhantomJS'],
    preprocessors:    {
      'tests/**/*.js':     ['browserify', 'coverage'],
      'tests/fixtures/js': ['babel', 'coverage']
    },
    browserify: {
      debug:     true,
      // transform: ['brfs']
      transform: ['babelify']
    },
    coverageReporter: {
      type:                'lcov',
      // specify a common output directory
      dir:                 'coverage/',
      instrumenterOptions: {
        istanbul: { noCompact: true }
      }
    },
    plugins: [
      'karma-jasmine',
      'karma-jasmine-jquery',
      'karma-phantomjs-launcher',
      'karma-spec-reporter',
      'karma-mocha-reporter',
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
