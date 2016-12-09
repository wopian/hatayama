module.exports = function(config) {
  config.set({
    basePath:      './',
    frameworks:    ['browserify', 'jasmine-jquery', 'jasmine'],
    colors:        true,
    logLevel:      config.LOG_INFO,
    reporters:     ['spec', 'coverage'],
    browsers:      ['PhantomJS'],
    preprocessors: {
      'tests/**/*.js':     ['browserify', 'coverage'],
      'tests/fixtures/js': ['babel']
    },
    browserify: {
      debug:     true,
      // transform: ['brfs']
      transform: ['babelify']
    },
    coverageReporter: {
      // specify a common output directory
      dir:       'build/reports/coverage',
      reporters: [
        // reporters not supporting the `file` property
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
        { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
        { type: 'teamcity', subdir: '.', file: 'teamcity.txt' },
        { type: 'text', subdir: '.', file: 'text.txt' },
        { type: 'text-summary', subdir: '.', file: 'text-summary.txt' },
      ]
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
