const gulp            = require('gulp'),                            // Gulp
      del             = require('del'),                             // Files  -> Delete
      cache           = require('gulp-cache');                      // Cache  -> Images

// Delete dist/ for fresh build
gulp.task('clean:dist', () => del('dist/**/*'));

// Delete dist/ and clean cache
gulp.task('clean', () => {
  del.sync('dist').then((cb) => {
    cache.clearAll(cb);
  });
});
