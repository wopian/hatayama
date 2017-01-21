const gulp            = require('gulp'),                            // Gulp
      connect         = require('gulp-connect');                    // Heroku -> Deploy Server

// Task run by Heroku deploy
gulp.task('heroku:production', ['default']);

// Start server once built on Heroku
gulp.task('heroku:serve', () =>
  connect.server({
    name:       'Heroku App',
    root:       `${__dirname}/../dist`,
    livereload: false,
    port:       process.env.PORT || 8000
  })
);

