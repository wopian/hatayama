const gulp            = require('gulp'),                            // Gulp
      browserSync     = require('browser-sync').create(),           // Watch  -> Build Server
      runSequence     = require('run-sequence');                    // Tasks  -> Queue

// Start a local webserver on localhost:3000
gulp.task('browserSync', () =>
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    ghostMode: {
      clicks:   true,
      location: false,
      forms:    true,
      scroll:   true
    },
    logFileChanges: true,
    logLevel:       'info',
    logPrefix:      'hatayama',
    logConnections: true,
    notify:         true,
    open:           false
  })
);

// Re-build JSON and Handlebars files, for watch task
gulp.task('watch:rebuild', callback =>
  runSequence(
    'json',
    'hbs',
    callback
  )
);

gulp.task('w', ['watch']);

// Build, launch local webserver and watch for changes
gulp.task('watch', callback =>
  runSequence(
    'default',
    'browserSync',
    'watch:files',
    callback
  )
);

// Watch for changes and run required tasks
gulp.task('watch:files', () => {
  gulp.watch('app/**/*.scss', ['scss', 'autoprefixer']);
  gulp.watch('app/**/*.yml', ['watch:rebuild']);
  gulp.watch('app/**/*.hbs', ['hbs']);
  gulp.watch('app/**/*.js', ['javascript'], browserSync.reload);
  gulp.watch('app/images/*.png', ['images']);
});
