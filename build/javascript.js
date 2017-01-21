const gulp            = require('gulp'),                            // Gulp
      runSequence     = require('run-sequence'),                    // Tasks  -> Queue
      browserSync     = require('browser-sync').create();           // Watch  -> Build Server

gulp.task('javascript', callback =>
  runSequence(
    'js:app',
    'js:vendor',
    callback
  )
);

// Copy JavaScript
// TODO: Minify JavaScript
gulp.task('js:app', () => gulp.src('app/models/**/*')
  .pipe(gulp.dest('dist/assets/js'))
  .pipe(browserSync.reload({ stream: true }))
);

// Copy vendor JavaScript
gulp.task('js:vendor', () => gulp.src('app/vendor/**/*.js')
  .pipe(gulp.dest('dist/assets/js/vendor/'))
  .pipe(browserSync.reload({ stream: true }))
);
