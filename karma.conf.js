module.exports = function(config) {
  config.set({
    basePath:         './',
    frameworks:       ['browserify', 'jasmine-jquery', 'jasmine'],
    colors:           true,
    logLevel:         config.LOG_WARN,
    reportSlowerThan: 100,
    reporters:        ['mocha', 'coverage'],
    browsers:         ['PhantomJS'],
    preprocessors:    {
      'app/models/**/*.js': ['babel', 'coverage'],
      'tests/**/*.js':      ['babel', 'browserify', 'coverage']
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
      'karma-mocha-reporter',
      'karma-babel-preprocessor',
      'karma-browserify',
      'karma-coverage'
      // 'brfs',
    ],
    files: [
      // Serve html fixtures
      { pattern: 'tests/fixtures/*.html', watched: true, included: false, served: true },
      // Dependencies
      'app/vendor/jquery-2.2.0.min.js',
      'https://maps.googleapis.com/maps/api/js?sensor=false',
      'app/vendor/tether.min.js',
      'app/vendor/bootstrap.min.js',
      'app/vendor/flickity.pkgd.min.js',
      'app/vendor/instantclick.min.js',
      // Set Jasmine Fixtures Path
      'tests/helpers/fixtures.js',
      // Code to test
      'app/models/**/*.js',
      // Test Code
      'tests/spec/*_spec.*'
    ]
  });
};
