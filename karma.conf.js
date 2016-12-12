module.exports = function(config) {
  config.set({
    basePath:         './',
    frameworks:       ['browserify', 'jasmine-jquery', 'jasmine'],
    colors:           true,
    logLevel:         config.LOG_WARN,
    reportSlowerThan: 500,
    // reporters:     ['spec', 'coverage'],
    reporters:        ['mocha', 'coverage'],
    browsers:         ['PhantomJS'],
    preprocessors:    {
      'app/models/**/*.js': ['browserify', 'coverage'],
      'tests/**/*.js':      ['browserify', 'coverage'],
      'tests/fixtures/js':  ['babel', 'coverage']
    },
    browserify: {
      debug:     true,
      // transform: ['brfs']
      transform: ['babelify']
    },
    coverageReporter: {
      // type:                ['lcovonly', 'cobertura'],
      // specify a common output directory
      dir:       'coverage/',
      reporters: [
        { type: 'lcovonly' },
        { type: 'cobertura' }
      ],
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
      'app/vendor/jquery-2.2.0.min.js',
      'https://maps.googleapis.com/maps/api/js?sensor=false',
      //'app/models/**/*.js',
      'tests/**/*.js',
      {
        pattern:  'tests/fixtures/*.html',
        watched:  true,
        served:   true,
        included: false
      }
    ]
  });
};
