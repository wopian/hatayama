const gulp            = require('gulp'),                            // Gulp                       //
      requireDir      = require('require-dir'),
      runSequence     = require('run-sequence');                    // Tasks  -> Queue            //

requireDir('./build');

gulp.task('default', callback =>                                    // ╓╌> Build                  //
  runSequence(                                                      // ║                          //
    'clean:dist',                                                   // ║   Main task that builds  //
    'json',
    ['hbs', 'scss', 'javascript'],                            // ║    the app               //
    'images',                                     // ║                          //
    callback                                                        // ║                          //
  )                                                                 // ║                          //
);
