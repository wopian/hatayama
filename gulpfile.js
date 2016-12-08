var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano      = require('gulp-cssnano'),
    useref       = require('gulp-useref'),
    uglify       = require('gulp-uglify'),
    gulpIf       = require('gulp-if'),
    imagemin     = require('gulp-imagemin'),
    htmlmin      = require('gulp-htmlmin'),
    handlebars   = require('gulp-compile-handlebars'),
    rename       = require('gulp-rename'),
    cache        = require('gulp-cache'),
    del          = require('del'),
    runSequence  = require('run-sequence'),
    gutil        = require('gulp-util'),
    browserSync  = require('browser-sync').create();

// Unit Tests
var Server       = require('karma').Server,
    browserify   = require('browserify');

gulp.task('test', function(done) {
  return new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('watch:test', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
  }, done).start();
});

// Paths to build from
var paths = {
  sass: "app/styles/**/*.scss",
};

gulp.task('sass', function() {
  gulp.src(paths.sass)
    .pipe(sass())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('autoprefixer', function() {
  gulp.src('dist/assets/css/app.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('useref', function() {
  gulp.src('app/*.hbs')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

var hbs = [];
hbs[0] = require('./app/components/index.json');
hbs[1] = require('./app/components/prefecture.json');

options = {
  ignorePartials: true,
  //partials: {
  //  footer: '</body></html>'
  //},
  batch: ['./app/templates/components'],
  helpers: {
    if_eq: function(a, b, opts) {
      if(a == b) // Or === depending on your needs
        return opts.fn(this);
      else
        return opts.inverse(this);
    }
  }
};

gulp.task('handlebars', function() {

  // Debug
  gutil.log('Indexing \'' + gutil.colors.yellow(hbs.length) + '\' components');
  total = hbs.length;

  for (var i = 0; i < hbs.length; i++) {

    // Debug
    gutil.log('Building \'' + gutil.colors.yellow((i + 1) + ' of ' + total) + '\' components');

    for (var j = 0; j < hbs[i].length; j++) {

      // Debug
      //gutil.log('Indexing \'' + gutil.colors.yellow(hbs[i][j].page) + '\'');
      
      // Store standard template data
      var template = hbs[i][j],

      // Get page type
      page = template.page.replace(/ +/gm, '-').toLowerCase();

      // If page is for prefectures, loop through the prefecture JSON file
      if (hbs[i][j].page == 'prefecture') {
        for (var k = 0; k < hbs[i][j].prefecture.length; k++) {

          // Debug
          gutil.log('Building \'' + gutil.colors.yellow('prefecture/' + hbs[i][j].prefecture[k].slug) + '\'');

          var flags = hbs[i][j].prefecture[k],
          flag = flags.slug.replace(/ +/gm, '-').toLowerCase();

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
})

gulp.task('htmlmin', function() {
  gulp.src('app/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('images', function() {
  gulp.src('app/images/**.*.+(png|jpeg|jpg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('js', function() {
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

gulp.task('clean:dist', function() {
  del.sync('dist/**/*', '!dist/images', '!dist/images/**/*');
});

gulp.task('clean', function() {
  del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
});

gulp.task('watch', function(callback) {
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

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    ['handlebars', 'sass', 'js'],
    'useref',
    callback
  );
});