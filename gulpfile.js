var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano      = require('gulp-cssnano');
var useref       = require('gulp-useref');
var uglify       = require('gulp-uglify');
var gulpIf       = require('gulp-if');
var imagemin     = require('gulp-imagemin');
var htmlmin      = require('gulp-htmlmin');
var handlebars   = require('gulp-compile-handlebars');
var rename       = require('gulp-rename');
var cache        = require('gulp-cache');
var del          = require('del');
var runSequence  = require('run-sequence');
var gutil        = require('gulp-util');
var browserSync  = require('browser-sync').create();

var selenium     = require('selenium-standalone');
var mocha        = require('gulp-mocha');


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

gulp.task('handlebars', function() {

  for (var i = 0; i < hbs.length; i++) {

    // Debug
    gutil.log(hbs.length);

    for (var j = 0; j < hbs[i].length; j++) {

      // Debug
      gutil.log(hbs[i].length + ": " + hbs[i]);
      
      // Store standard template data
      var template = hbs[i][j],

      // Get page type
      page = template.page.replace(/ +/gm, '-').toLowerCase();

      // If page is for prefectures, loop through the prefecture JSON file
      if (hbs[i][j].page == 'prefecture') {
        for (var k = 0; k < hbs[i][j].prefecture.length; k++) {
          var flags = hbs[i][j].prefecture[k],
          flag = flags.slug.replace(/ +/gm, '-').toLowerCase();

          gulp.src('app/templates/prefecture.hbs')
            .pipe(handlebars(flags))
            .pipe(rename(flag + ".html"))
            .pipe(gulp.dest('dist/prefecture'))
            .pipe(browserSync.reload({
              stream: true
            }));
        }
      } else {

      gulp.src('app/templates/index.hbs')
      .pipe(handlebars(template))
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

gulp.task('serve:test', function(done) {
  browserSync.init({
    logLevel: 'silent',
    notify: false,
    open: false,
    port: 9000,
    server: {
      baseDir: ['test']
    },
    ui: false
  }, done);
});

gulp.task('selenium', function(done) {
  selenium.install({
    logger: function(message) { }
  }, function(err) {
    if (err) return done(err);
    /*if (process.env.TRAVIS) {
      child.stderr.on('data', function(data) {
        console.log(data.toString());
      });
    }*/
    selenium.start(function(err, child) {
      if (err) return done(err);
      selenium.child = child;
      done();
    });
  });
});

gulp.task('integration', ['serve:test', 'selenium'], function () {
  gulp.src('test/spec/**/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('test', ['integration'], function() {
  selenium.child.kill();
  browserSync.exit();
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