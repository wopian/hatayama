const gulp            = require('gulp'),                            // Gulp
      requireDir      = require('require-dir'),                     // Tasks  -> Require
      runSequence     = require('run-sequence');                    // Tasks  -> Queue

// Import tasks
requireDir('./build');

gulp.task('default', callback =>
  runSequence(
    'clean:dist',
    ['json', 'scss', 'javascript', 'images', 'favicon', 'fonts'],
    'hbs',
    callback
  )
);
