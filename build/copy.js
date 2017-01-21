const gulp            = require('gulp');                            // Gulp

// Copy fonts folder
gulp.task('fonts', () =>
  gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
);

// Copy all files in public/
gulp.task('favicon', () =>
  gulp.src('app/public/**/*')
    .pipe(gulp.dest('dist/'))
);
