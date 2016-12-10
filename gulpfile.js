                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #       Initialise       # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
const gulp         = require('gulp'),                               // Gulp                       //
      sass         = require('gulp-sass'),                          // SCSS  -> CSS               //
      autoprefixer = require('gulp-autoprefixer'),                  // CSS   -> Vendor Prefixes   //
      cssnano      = require('gulp-cssnano'),                       // CSS   -> Minify            //
      useref       = require('gulp-useref'),                        // JS    -> Concat            //
      uglify       = require('gulp-uglify'),                        // JS    -> Minify            //
      gulpIf       = require('gulp-if'),                            //                            //
      rename       = require('gulp-rename'),                        // Files -> Rename            //
      del          = require('del'),                                // Files -> Delete            //
      cache        = require('gulp-cache'),                         // Cache -> Images            //
      imagemin     = require('gulp-imagemin'),                      // Image -> Minify            //
      gutil        = require('gulp-util'),                          // CLI   -> Write & Colours   //
      retabber     = require('retabber'),                           // CLI   -> Smart Tabs        //
      zeroFill     = require('zero-fill'),                          // CLI   -> Number Padding    //
      browserSync  = require('browser-sync').create(),              // Watch -> Build Server      //
      Server       = require('karma').Server,                       // Tests -> Test Server       //
      eslint       = require('gulp-eslint'),                        // Tests -> JS Quality        //
      runSequence  = require('run-sequence'),                       // Tasks -> Queue             //
      handlebars   = require('gulp-compile-handlebars'),            // HBS   -> HTML              //
      hbs          = [],                                            // HBS   -> Routes            //
      options      = {                                              // HBS   -> Options           //
        ignorePartials: true,                                       //                            //
        batch:          ['./app/templates/components'],             // HBS   -> Partials          //
        helpers:        {                                           // HBS   -> Helpers:          //
          if_eq(a, b, opts) {                                       // ╓╌> {{#if_eq a 'b'}}       //
            if (a === b) {                                          // ║                          //
              return opts.fn(this);                                 // ║   Check if both values   //
            }                                                       // ║    are equal             //
            return opts.inverse(this);                              // ║                          //
          }                                                         // ╨                          //
        }                                                           //                            //
      },                                                            //                            //
      _log = (type, page, total = 0, counter = 0) => {              // CLI Formatter for HBS      //
        const a = zeroFill(2, counter + 1),                         // Zero fill progress i.e, 01 //
              b = zeroFill(2, total),                               // Zerp fill total     '   '  //
              c = `|${a}/${b}|`;                                    // Format total i.e, |01/02|  //
        let d,                                                      //                            //
            e,                                                      //                            //
            f,                                                      //                            //
            g,                                                      //                            //
            h;                                                      //                            //
        switch (type) {                                             //                            //
        case 1: {                                                   // Populate:                  //
          d = 'Populate ';                                          // Set type                   //
          e = '';                                                   // Set child delimiter   NULL //
          f = gutil.colors.cyan(page);                              // Set page + cyan text       //
          g = `\t${gutil.colors.magenta(c)}`;                       // Set progress + magenta txt //
          h = 32;                                                   // Set smart tab width        //
          break;                                                    //                            //
        }                                                           //                            //
        case 2: {                                                   // Generate:                  //
          d = 'Generate ';                                          // Set type                   //
          e = ' └-> ';                                              // Set child delimiter   NULL //
          f = gutil.colors.cyan(page);                              // Set page + cyan text       //
          g = `\t|${gutil.colors.black(c)}|`;                       // Set progress + black text  //
          h = 16;                                                   // Set smart tab width        //
          break;                                                    //                            //
        }                                                           //                            //
        default: { break; }                                         //                            //
        }                                                           //                            //
        return gutil.log(retabber.smart(`${d}${e}\'${f}\'${c}`, h));// Output formatted string    //
      };                                                            //                            //
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
                                                                    // #          SCSS          # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
gulp.task('sass:build', () => {                                     // ╓╌> SASS                   //
  gulp.src('app/styles/**/*.scss')                                  // ║                          //
    .pipe(sass())                                                   // ║   Compiles .scss files   //
    .pipe(cssnano())                                                // ║    to .css files         //
    .pipe(gulp.dest('dist/assets/css'))                             // ║   Reloads page if run    //
    .pipe(browserSync.reload({                                      // ║    from watch task       //
      stream: true                                                  // ║                          //
    }));                                                            // ║                          //
});                                                                 // ╨                          //
                                                                    //                            //
gulp.task('autoprefixer', () => {                                   // ╓╌> Autoprefixer           //
  gulp.src('dist/assets/css/app.css')                               // ║                          //
    .pipe(autoprefixer({                                            // ║   Add vendor prefixes    //
      browsers: ['last 2 versions'],                                // ║    to fully support      //
      cascade:  false                                               // ║    last 2 versions of    //
    }))                                                             // ║    major browsers        //
    .pipe(gulp.dest('dist'));                                       // ║                          //
});                                                                 // ╨                          //
                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #       JavaScript       # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
gulp.task('javascript', () => {                                     // ╓╌> JavaScript             //
  gulp.src('app/models/**/*')                                       // ║                          //
    .pipe(uglify())                                                 // ║   Move and minify        //
    .pipe(gulp.dest('dist/assets/js'))                              // ║    JavaScript            //
    .pipe(browserSync.reload({                                      // ║   Reloads page if run    //
      stream: true                                                  // ║    from watch task       //
    }));                                                            // ╨                          //
  gulp.src('app/vendor/**/*.js')                                    // ╓╌> JavaScript Vendor      //
    .pipe(uglify())                                                 // ║                          //
    .pipe(gulp.dest('dist/assets/js/vendor/'))                      // ║   Move and minify        //
    .pipe(browserSync.reload({                                      // ║    vendor JavaScript     //
      stream: true                                                  // ║   Reloads page if run    //
    }));                                                            // ║    from watch task       //
});                                                                 // ╨                          //
                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #          Misc          # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
gulp.task('images', () => {                                         // ╓╌> Images                 //
  gulp.src('app/images/**.*.+(png|jpeg|jpg|gif|svg)')               // ║                          //
    .pipe(cache(imagemin()))                                        // ║   Move and cache images  //
    .pipe(gulp.dest('dist/images'));                                // ║                          //
});                                                                 // ╨                          //
                                                                    //                            //
gulp.task('fonts', () => {                                          // ╓╌> Fonts                  //
  gulp.src('app/fonts/**/*')                                        // ║                          //
    .pipe(gulp.dest('dist/fonts'));                                 // ║   Move fonts             //
});                                                                 // ╨                          //
                                                                    //                            //
gulp.task('clean:dist', () => {                                     // ╓╌> Clean                  //
  del.sync('dist/**/*', '!dist/images', '!dist/images/**/*');       // ║                          //
});                                                                 // ╨   Deletes uncached files //
                                                                    //                            //
gulp.task('clean', () => {                                          // ╓╌> Clean Cache            //
  del.sync('dist').then((cb) => {                                   // ║                          //
    cache.clearAll(cb);                                             // ║   Deletes cached files   //
  });                                                               // ║                          //
});                                                                 // ╨                          //
                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #        Linters         # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
gulp.task('lint', () => {                                           // ╓╌> EsLint                 //
  gulp.src([                                                        // ║                          //
    '**/*.js',                                                      // ║   Check JavaScript       //
    '!node_modules/**',                                             // ║    against ruleset       //
    '!dist/**',                                                     // ║    and validate syntax   //
    '!app/vendor/**',                                               // ║                          //
  ])                                                                // ║                          //
    .pipe(eslint())                                                 // ║                          //
    .pipe(eslint.format())                                          // ║                          //
    .pipe(eslint.failAfterError());                                 // ║                          //
});                                                                 // ╨                          //
                                                                    //                            //
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
    'build:tidy',
    'browserSync',
    ['handlebars', 'sass:build', 'javascript'],
    'autoprefixer',
    callback
  );
  gulp.watch('app/**/*.scss', ['sass:build', 'autoprefixer']);
  gulp.watch('app/**/*.hbs', ['handlebars'], browserSync.reload);
  gulp.watch('app/**/*.json', ['handlebars'], browserSync.reload);
  gulp.watch('app/**/*.js', ['javascript'], browserSync.reload);
});

gulp.task('build', (callback) => {
  runSequence(
    ['handlebars', 'sass:build', 'javascript'],
    'autoprefixer',
    callback
  );
});

gulp.task('build:tidy', (callback) => {
  runSequence(
    'clean:dist',
    ['handlebars', 'sass:build', 'javascript'],
    'autoprefixer',
    callback
  );
});
                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #      Unit Testing      # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //
gulp.task('test', (done) => {                                       // ╓╌> Test                   //
  new Server({                                                      // ║
    configFile: `${__dirname}/karma.conf.js`,                       // ║
    singleRun:  true                                                // ║
  }, done).start();                                                 // ║
});                                                                 // ╨
                                                                    //
gulp.task('watch:test', (done) => {                                 // ╓╌> Watch Test             //
  new Server({                                                      // ║
    configFile: `${__dirname}/karma.conf.js`,                       // ║
  }, done).start();                                                 // ║
});                                                                 // ╨
