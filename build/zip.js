const gulp            = require('gulp'),                            // Gulp
      archiver        = require('gulp-archiver');                   // Travis -> ZIP

// Archive dist/ for release tag
gulp.task('zip', () =>
  gulp.src('dist/**')
    .pipe(archiver('hatayama.zip'))
    .pipe(gulp.dest('./'))
);
