const gulp            = require('gulp'),                            // Gulp
      runSequence     = require('run-sequence'),                    // Tasks  -> Queue
      eslint          = require('gulp-eslint'),                     // Tests  -> JS Quality
      scsslint        = require('gulp-scss-lint'),                  // Tests  -> SCSS Quality
      scsslintstylish = require('gulp-scss-lint-stylish'),          // Tests  -> SCSSLint Output
      Server          = require('karma').Server;                    // Tests  -> Test Server

gulp.task('test', callback =>
  runSequence(
    'scsslint',
    'eslint',
    'test:unit',
    callback
  )
);

// Check JavaScript files for rule violations
gulp.task('eslint', () =>
  gulp.src([
    '**/*.js',
    '!node_modules/**',
    '!dist/**',
    '!app/vendor/**',
  ])
    .pipe(eslint())
    .pipe(eslint.format())
);

// Check SCSS files for rule violations
gulp.task('scsslint', () =>
  gulp.src([
    'app/styles/**/*.scss',
    '!app/styles/vendor/**'
  ])
    .pipe(scsslint({
      customReport: scsslintstylish,
      config:       '.scss-lint.yml'
    }))
);

// Run unit tests with Karma & Jasmine
gulp.task('test:unit', (done) => {
  const karma = new Server({
    configFile: `${__dirname}/karma.conf.js`,
    singleRun:  true
  }, (errorCode) => {
    console.log(`Karma finished with error code ${errorCode}`);
    done();
    return process.exit(errorCode);
  });
  karma.start();
});
