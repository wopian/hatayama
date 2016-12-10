                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #       Initialise       # //
                                                                    // #                        # //
                                                                    // ########################## //

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
      imagemin     = require('gulp-imagemin'),
      del          = require('del'),
      runSequence  = require('run-sequence'),
      gutil        = require('gulp-util'),
      retabber     = require('retabber'),
      zeroFill     = require('zero-fill'),
      browserSync  = require('browser-sync').create(),              // Watch
      Server       = require('karma').Server,                       // Unit Tests
      eslint       = require('gulp-eslint'),
      hbs          = [],                                            // Routes Storage
      options      = {                                              // Handlebars Partials
        ignorePartials: true,
        batch:          ['./app/templates/components'],
        helpers:        {
          if_eq(a, b, opts) {                                       // Check if values equal
            if (a === b) {                                          // Or === depending on need
              return opts.fn(this);
            }
            return opts.inverse(this);
          }
        }
      },
      _log = (type, page, total = 0, counter = 0) => {
        const t = `${zeroFill(2, counter + 1)}/${zeroFill(2, total)}`;// Calculate current progress
        let a,
            b,
            c,
            r,
            e;
        switch (type) {
        case 1: {                                                   // If Populate task then:
          a = 'Populate ';                                           // Set type string
          b = gutil.colors.cyan(page);
          c = `\t|${gutil.colors.magenta(t)}|`;
          e = '';                              // Set to yellow text
          r = 32;                                                   // Tab width
          break;
        }
        case 2: {                                                   // If Generate task then:
          a = 'Generate ';
          b = gutil.colors.cyan(page);
          c = `\t|${gutil.colors.black(t)}|`;
          e = ' └-> ';
          r = 16;
          break;
        }
        default: { break; }
        }
        return gutil.log(retabber.smart(`${a}${e}\'${b}\'${c}`, r));  // Output
      };

                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #          SASS          # //
                                                                    // #                        # //
                                                                    // ########################## //

gulp.task('sass:build', () => {
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
      cascade:  false
    }))
    .pipe(gulp.dest('dist'));
});

                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #       Handlebars       # //
                                                                    // #                        # //
                                                                    // ########################## //

hbs[0] = require('./app/components/index.json');                    // Prepare data for Handlebars
hbs[1] = require('./app/components/prefecture.json');

gulp.task('handlebars', () => {
  const total = hbs.length;                                         // Get total no of components

  for (let i = 0; i < hbs.length; i++) {                            // Loop declared JSON
    for (let j = 0; j < hbs[i].length; j++) {                       // Loop root of JSON
      const template = hbs[i][j],                                   // Store standard template data
            page     = template.page;                                 // Store page type

      _log(1, page, total, i);                                      // # DEBUG: Populate

      if (hbs[i][j].page === 'prefecture') {                        // If page for prefectures, loop
        // Debug: Get total amount of components                    // through prefecture.json file
        const totalFlags = hbs[i][j].prefecture.length;
        for (let k = 0; k < hbs[i][j].prefecture.length; k++) {
          const slug  = `${hbs[i][j].prefecture[k].slug}`,
                flags = hbs[i][j].prefecture[k],                    // Store prefecture flag data
                flag = flags.slug.replace(/ +/gm, '-').toLowerCase();// Store & escape flag slug

          _log(2, slug, totalFlags, k);                             // # DEBUG: Generate

          gulp.src('app/templates/prefecture.hbs')
            .pipe(handlebars(flags, options))
            .pipe(rename(`${flag}.html`))
            .pipe(gulp.dest('dist/prefecture'))
            .pipe(browserSync.reload({
              stream: true
            }));
        }
      } else {
        _log(2, page, 1, 0);                                        // # DEBUG: Generate

        gulp.src('app/templates/index.hbs')
          .pipe(handlebars(template, options))
          .pipe(rename(`${page}.html`))
          .pipe(gulp.dest('dist'))
          .pipe(browserSync.reload({
            stream: true
          }));
      }
    }
  }
});

                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #       JavaScript       # //
                                                                    // #                        # //
                                                                    // ########################## //

gulp.task('useref:htm', () => {
  gulp.src('dist/**/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('javascript', () => {
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

                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #          Misc          # //
                                                                    // #                        # //
                                                                    // ########################## //

gulp.task('images', () => {
  gulp.src('app/images/**.*.+(png|jpeg|jpg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean:dist', () => {
  del.sync('dist/**/*', '!dist/images', '!dist/images/**/*');
});

gulp.task('clean', () => {
  del.sync('dist').then((cb) => {
    cache.clearAll(cb);
  });
});

                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #         Build          # //
                                                                    // #                        # //
                                                                    // ########################## //

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
});

gulp.task('watch', (callback) => {
  runSequence(
    'build:clean',
    'browserSync',
    ['handlebars', 'sass:build', 'javascript'],
    'useref:htm',
    callback
  );
  gulp.watch('app/**/*.scss', ['sass:build'], ['autoprefixer']);
  gulp.watch('app/**/*.hbs', ['handlebars'], browserSync.reload);
  gulp.watch('app/**/*.json', ['handlebars'], browserSync.reload);
  gulp.watch('app/**/*.js', ['useref:htm', 'javascript'], browserSync.reload);
});

gulp.task('build', (callback) => {
  runSequence(
    ['handlebars', 'sass:build', 'javascript'],
    'useref:htm',
    callback
  );
});

gulp.task('build:tidy', (callback) => {
  runSequence(
    'clean:dist',
    ['handlebars', 'sass:build', 'javascript'],
    'useref:htm',
    callback
  );
});

                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #        Linters         # //
                                                                    // #                        # //
                                                                    // ########################## //

gulp.task('lint', () => {
  gulp.src([
    '**/*.js',
    '!node_modules/**',                                             // Ignore npm packages
    '!dist/**',                                                     // Ignore built JavaScript
    '!app/vendor/**',                                               // Ignore vendor JavaScript
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #      Unit Testing      # //
                                                                    // #                        # //
                                                                    // ########################## //

gulp.task('test', (done) => {
  new Server({
    configFile: `${__dirname}/karma.conf.js`,
    singleRun:  true
  }, done).start();
});

gulp.task('watch:test', (done) => {
  new Server({
    configFile: `${__dirname}/karma.conf.js`,
  }, done).start();
});
