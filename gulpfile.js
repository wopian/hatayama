const gulp         = require('gulp'),                               // Gulp
      sass         = require('gulp-sass'),                          // CSS
      autoprefixer = require('gulp-autoprefixer'),
      cssnano      = require('gulp-cssnano'),
      useref       = require('gulp-useref'),                        // JavaScript
      uglify       = require('gulp-uglify'),
      gulpIf       = require('gulp-if'),
      handlebars   = require('gulp-compile-handlebars'),            // Handlebars
      rename       = require('gulp-rename'),
      cache        = require('gulp-cache'),                         // Misc
      del          = require('del'),
      runSequence  = require('run-sequence'),
      gutil        = require('gulp-util'),
      retabber     = require('retabber'),
      browserSync  = require('browser-sync').create(),              // Watch
      Server       = require('karma').Server,                       // Unit Tests
      eslint       = require('gulp-eslint'),
      hbs          = [],                                            // Routes Storage
      options      = {                                              // Handlebars Partials
        ignorePartials: true,
        batch         : ['./app/templates/components'],
        helpers       : {
          if_eq(a, b, opts) {                                       // Check if values equal
            if (a === b) {                                          // Or === depending on need
              return opts.fn(this);
            }
            return opts.inverse(this);
          }
        }
      };

gulp.task('sass', () => {
  gulp.src('app/styles/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('autoprefixer', () => {
  gulp.src('dist/assets/css/app.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade : false
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('useref', () => {
  gulp.src('app/*.hbs')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

hbs[0] = require('./app/components/index.json');                    // Prepare data for Handlebars
hbs[1] = require('./app/components/prefecture.json');

let _log = (type, page, total, counter) => {
  let a = (counter + 1) + '/' + total;                              // Calculate current progress
  switch (type) {
    case 1:                                                         // If Populate task then:
      type = 'Populate';
      b = gutil.colors.yellow(page);                                // Set to yellow text
      c = 16;                                                       // Tab width
      break;
    case 2:                                                         // If Generate task then:
      type = 'Generate';
      a = gutil.colors.black(a);                                    // Set progress to black text
      b = gutil.colors.bgYellow(page);                              // Set to yellow background
      c = 8;                                                        // Tab width
      break;
  };
  return gutil.log(retabber.smart(`${type} \'${b}\'\t(${a})`, c));  // Output
};

gulp.task('handlebars', () => {
  let total = hbs.length;                                           // Get total no of components

  for (let i = 0; i < hbs.length; i++) {                            // Loop declared JSON
    for (let j = 0; j < hbs[i].length; j++) {                       // Loop root of JSON
      var template = hbs[i][j],                                     // Store standard template data
          page     = template.page;                                 // Store page type

      _log(1, page, total, i);                                      // # DEBUG: Populate

      if (hbs[i][j].page == 'prefecture') {                         // If page for prefectures, loop
        // Debug: Get total amount of components                    // through prefecture.json file
        var totalFlags = hbs[i][j].prefecture.length;
        for (var k = 0; k < hbs[i][j].prefecture.length; k++) {
          let slug = 'prefecture/' + hbs[i][j].prefecture[k].slug;  // # DEBUG: Generate
          _log(2, slug, total, i);                                  // #

          var flags = hbs[i][j].prefecture[k],                      // Store prefecture flag data
          flag = flags.slug.replace(/ +/gm, '-').toLowerCase();     // Store & escape flag slug

          gulp.src('app/templates/prefecture.hbs')
            .pipe(handlebars(flags, options))
            .pipe(rename(flag + ".html"))
            .pipe(gulp.dest('dist/prefecture'))
            .pipe(browserSync.reload({
              stream: true
            }));
        }
      } else {
        // Debug
        gutil.log('Building \'' + gutil.colors.yellow(hbs[i][j].page) + '\'');

        gulp.src('app/templates/index.hbs')
          .pipe(handlebars(template, options))
          .pipe(rename(page + ".html"))
          .pipe(gulp.dest('dist'))
          .pipe(browserSync.reload({
            stream: true
        }));
      }
    }
  }
});

gulp.task('htmlmin', () => {
  gulp.src('app/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('images', () => {
  gulp.src('app/images/**.*.+(png|jpeg|jpg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', () => {
  gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('js', () => {
  gulp.src('app/models/**/*')
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
  gulp.src('app/vendor/**/*.js')
    .pipe(gulp.dest('dist/assets/js/vendor/'))
    .pipe(browserSync.reload({
      stream: true
    }));

});

gulp.task('clean:dist', () => {
  del.sync('dist/**/*', '!dist/images', '!dist/images/**/*');
});

gulp.task('clean', () => {
  del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
});

gulp.task('watch', (callback) => {
  runSequence(
    'browserSync',
    ['handlebars', 'sass', 'js'],
    'useref',
    callback
  );
  gulp.watch('app/**/*.scss', ['sass'], ['autoprefixer']);
  gulp.watch('app/**/*.hbs', ['handlebars'], browserSync.reload);
  gulp.watch('app/**/*.json', ['handlebars'], browserSync.reload);
  gulp.watch('app/**/*.js', ['useref', 'js'], browserSync.reload);
});

gulp.task('build', (callback) => {
  runSequence(
    'clean:dist',
    ['handlebars', 'sass', 'js'],
    'useref',
    callback
  );
});

gulp.task('lint', () => {
  gulp.src([
    '**/*.js',
    '!node_modules/**',
    '!dist/**',
    '!app/vendor/**',
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', (done) => {
  return new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('watch:test', (done) => {
  new Server({
    configFile: __dirname + '/karma.conf.js',
  }, done).start();
});