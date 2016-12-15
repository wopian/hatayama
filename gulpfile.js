                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #       Initialise       # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
const gulp         = require('gulp'),                               // Gulp                       //
      sass         = require('gulp-sass'),                          // SCSS   -> CSS              //
      autoprefixer = require('gulp-autoprefixer'),                  // CSS    -> Vendor Prefixes  //
      cssnano      = require('gulp-cssnano'),                       // CSS    -> Minify           //
   // uglify       = require('gulp-uglify'),                        // JS     -> Minify           //
      rename       = require('gulp-rename'),                        // Files  -> Rename           //
      del          = require('del'),                                // Files  -> Delete           //
      cache        = require('gulp-cache'),                         // Cache  -> Images           //
      imagemin     = require('gulp-imagemin'),                      // Image  -> Minify           //
      gutil        = require('gulp-util'),                          // CLI    -> Write & Colours  //
      zeroFill     = require('zero-fill'),                          // CLI    -> Number Padding   //
      stringWidth  = require('string-width'),                       // CLI    -> String Width     //
      browserSync  = require('browser-sync').create(),              // Watch  -> Build Server     //
      Server       = require('karma').Server,                       // Tests  -> Test Server      //
      eslint       = require('gulp-eslint'),                        // Tests  -> JS Quality       //
      scsslint     = require('gulp-scss-lint'),
      scsslintstylish = require('gulp-scss-lint-stylish'),
      connect      = require('gulp-connect'),                       // Heroku -> Deploy Server    //
      runSequence  = require('run-sequence'),                       // Tasks  -> Queue            //
      jsonConcat   = require('gulp-json-concat'),
      jsonFormat   = require('gulp-json-format'),
      handlebars   = require('gulp-compile-handlebars'),            // HBS    -> HTML             //
      hbs          = [],                                            // HBS    -> Data             //
      options      = {                                              // HBS    -> Options          //
        ignorePartials: true,                                       //                            //
        batch:          ['./app/templates/components'],             // HBS    -> Partials         //
        helpers:        {                                           // HBS    -> Helpers:         //
          if_eq(a, b, opts) {                                       // ╓╌> {{#if_eq a 'b'}}       //
            if (a === b) {                                          // ║                          //
              return opts.fn(this);                                 // ║   Check if both values   //
            }                                                       // ║    are equal             //
            return opts.inverse(this);                              // ║                          //
          },
          formatNumber(a) {
            return String(a).replace(/(.)(?=(\d{3})+$)/g, '$1,');
          }                                                         // ╨                          //
        }                                                          //                            //
      },                                                            //                            //
      _log = (type, page, total = 1, counter = 0) => {              // CLI Formatter for HBS      //
        const a = zeroFill(2, counter + 1),                         // Zero fill progress i.e, 01 //
              b = zeroFill(2, total),                               // Zerp fill total     '   '  //
              c = `${a}/${b}`,                                      // Format total i.e, |01/02|  //
              k = 40;                                               //                            //
        let d,                                                      //                            //
            e,                                                      //                            //
            f,                                                      //                            //
            g,                                                      //                            //
            h,                                                      //                            //
            i,                                                      //                            //
            j = '';                                                 //                            //
        switch (type) {                                             //                            //
        case 1: {                                                   // Populate:                  //
          d = 'Populate ';                                          // Set type                   //
          e = '';                                                   // Set child delimiter   NULL //
          f = gutil.colors.cyan(page);                              // Set page + cyan text       //
          g = `${gutil.colors.magenta(c)}`;                         // Set progress + magenta txt //
          h = k - stringWidth(d + e + f + g);                       // Set smart tab width        //
          for (i = 0; i < h; i++) {                                 //                            //
            j = `${j}\u200A`;                                       //                            //
          }                                                         //                            //
          j = `${j}`;                                               //                            //
          break;                                                    //                            //
        }                                                           //                            //
        case 2: {                                                   // Generate:                  //
          d = 'Generate ';                                          // Set type                   //
          e = ' ↪ ';                                                // Set child delimiter        //
          f = gutil.colors.cyan(page);                              // Set page + cyan text       //
          g = `${gutil.colors.black(c)}`;                           // Set progress + black text  //
          h = k - stringWidth(d + e + f + g);                       // Set smart tab width        //
          for (i = 0; i < h; i++) {                                 //                            //
            j = `${j}\u200A`;                                       //                            //
          }                                                         //                            //
          break;                                                    //                            //
        }                                                           //                            //
        default: { break; }                                         //                            //
        }                                                           //                            //
        return gutil.log(`${d}${e}\'${f}\'${j}${g}`);               // Output formatted string    //
      };                                                            //                            //
                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #       Handlebars       # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
hbs[0] = require('./app/data/index.json');                          // Prepare data for           //
hbs[1] = require('./app/data/prefecture.json');                     //  Handlebars                //
                                                                    //                            //
gulp.task('handlebars', () => {                                     //                            //
  const total = hbs.length;                                         //                            //
                                                                    //                            //
  for (let i = 0; i < hbs.length; i++) {                            // Loop hbs array             //
    for (let j = 0; j < hbs[i].length; j++) {                       // Loop hbs[i] array          //
      const hbsData = hbs[i][j];                                    //                            //
                                                                    //                            //
      _log(1, hbsData.page, total, i);                              // Output state to CLI        //
                                                                    //                            //
      if (hbsData.page === 'prefecture') {                          // If page for prefectures, loop
        // Debug: Get total amount of components                    // through prefecture.json file
        const totalFlags = hbsData.prefecture.length;
        for (let k = 0; k < hbsData.prefecture.length; k++) {
          const slug  = `${hbs[i][j].prefecture[k].slug}`,
                flags = hbs[i][j].prefecture[k],                    // Store prefecture flag data
                flag = flags.flag.replace(/ +/gm, '-').toLowerCase();// Store & escape flag slug

          _log(2, slug, totalFlags, k);

          gulp.src('app/templates/prefecture.hbs')
            .pipe(handlebars(flags, options))
            .pipe(rename(`${flag}/index.html`))
            .pipe(gulp.dest('dist/prefecture'))
            .pipe(browserSync.reload({
              stream: true
            }));
        }
      } else {
        _log(2, hbsData.page, undefined, undefined);

        gulp.src('app/templates/index.hbs')
          .pipe(handlebars(hbsData, options))
          .pipe(rename(`${hbsData.page}.html`))
          .pipe(gulp.dest('dist'))
          .pipe(browserSync.reload({
            stream: true
          }));
      }
    }
  }
});

gulp.task('json', (callback) => {
  runSequence(
    'json:index',
    callback
  );
});

gulp.task('json:index', () =>
  gulp.src(['app/data/index.json', 'app/data/prefecture.json'])
    .pipe(jsonConcat('indexOutput.json', data => new Buffer(JSON.stringify(data))))
    .pipe(jsonFormat(2))
    .pipe(gulp.dest('app/data'))
);
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
    // .pipe(uglify())                                              // ║   Move and minify        //
    .pipe(gulp.dest('dist/assets/js'))                              // ║    JavaScript            //
    .pipe(browserSync.reload({                                      // ║   Reloads page if run    //
      stream: true                                                  // ║    from watch task       //
    }));                                                            // ╨                          //
  gulp.src('app/vendor/**/*.js')                                    // ╓╌> JavaScript Vendor      //
    // .pipe(uglify())                                              // ║                          //
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
gulp.task('favicon', () => {                                        // ╓╌> Favicon                //
  gulp.src('app/public/**/*')                                       // ║                          //
    .pipe(gulp.dest('dist/'));                                      // ║   Move favicons to root  //
});                                                                 // ╨                          //
                                                                    //                            //
gulp.task('clean:dist', () => {                                     // ╓╌> Clean                  //
  del.sync('dist/**/*');                                            // ║                          //
});                                                                 // ║   Deletes uncached files //
                                                                    // ╨                          //
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
gulp.task('eslint', () => {                                         // ╓╌> EsLint                 //
  gulp.src([                                                        // ║                          //
    '**/*.js',                                                      // ║   Check JavaScript       //
    '!node_modules/**',                                             // ║    against ruleset       //
    '!dist/**',                                                     // ║    and validate syntax   //
    '!app/vendor/**',                                               // ║                          //
  ])                                                                // ║                          //
    .pipe(eslint())                                                 // ║                          //
    .pipe(eslint.format());                                         // ║                          //
});                                                                 // ╨                          //
                                                                    //                            //
gulp.task('scsslint', () => {                                       // ╓╌> SCSS Lint              //
  gulp.src([                                                        // ║                          //
    'app/styles/**/*.scss',                                         // ║                          //
    '!app/styles/vendor/**'                                         // ║                          //
  ])                                                                // ║                          //
    .pipe(scsslint({                                                // ║                          //
      customReport: scsslintstylish,                                // ║                          //
      config:       '.scss-lint.yml'                                // ║                          //
    }));                                                            // ║                          //
});                                                                 // ╨                          //
                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #          Dev           # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
gulp.task('browserSync', () => {                                    // ╓╌> BrowserSync            //
  browserSync.init({                                                // ║                          //
    server: {                                                       // ║   Starts server          //
      baseDir: './dist',                                            // ║                          //
    },                                                              // ║                          //
  });                                                               // ║                          //
});                                                                 // ╨                          //
                                                                    //                            //
gulp.task('watch', (callback) => {                                  // ╓╌> Watch                  //
  runSequence(                                                      // ║                          //
    'default',                                                   // ║   Builds app and         //
    'browserSync',                                                  // ║    watches files for     //
    ['handlebars', 'sass:build', 'javascript'],                     // ║    changes & rebuilds    //
    'autoprefixer',                                                 // ║    them                  //
    callback                                                        // ║                          //
  );                                                                // ║                          //
  gulp.watch('app/**/*.scss', ['sass:build', 'autoprefixer']);      // ║                          //
  gulp.watch('app/**/*.hbs', ['handlebars'], browserSync.reload);   // ║                          //
  gulp.watch('app/**/*.json', ['handlebars'], browserSync.reload);  // ║                          //
  gulp.watch('app/**/*.js', ['javascript'], browserSync.reload);    // ║                          //
});                                                                 // ╨                          //
                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #         Build          # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
gulp.task('default', (callback) => {                             // ╓╌> Build                  //
  runSequence(                                                      // ║                          //
    'clean:dist',                                                   // ║   Main task that builds  //
    'json',
    ['handlebars', 'sass:build', 'javascript'],                     // ║    the app               //
    'autoprefixer',                                                 // ║                          //
    callback                                                        // ║                          //
  );                                                                // ║                          //
});                                                                 // ╨                          //
                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #      Unit Testing      # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
gulp.task('test', (callback) => {                                   // ╓╌> Test                   //
  runSequence(                                                      // ║                          //
    'scsslint',                                                     // ║   Runs lint task then    //
    'eslint',                                                       // ║    starts unit tests     //
    'test:unit',                                                    // ║                          //
    callback                                                        // ║                          //
  );                                                                // ║                          //
});                                                                 // ╨                          //
                                                                    //                            //
gulp.task('test:unit', (done) => {                                  // ╓╌> Unit Tests             //
  const karma = new Server({                                        // ║                          //
    configFile: `${__dirname}/karma.conf.js`,                       // ║   Performs unit tests    //
    singleRun:  true                                                // ║    using Karma & Jasmine //
  }, (errorCode) => {                                               // ║                          //
    console.log(`Karma finished with error code ${errorCode}`);     // ║                          //
    done();                                                         // ║                          //
    return process.exit(errorCode);                                 // ║                          //
  });                                                               // ║                          //
  karma.start();                                                    // ║                          //
});                                                                 // ╨                          //
                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #         Heroku         # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
gulp.task('heroku:serve', () => {                                   // ╓╌> Heroku Serve           //
  connect.server({                                                  // ║                          //
    name:       'Heroku App',                                       // ║   Starts server running  //
    root:       `${__dirname}/dist`,                                // ║    when built in Heroku  //
    livereload: false,                                              // ║                          //
    port:       process.env.PORT || 8000                            // ║                          //
  });                                                               // ║                          //
});                                                                 // ╨                          //
                                                                    //                            //
gulp.task('heroku:production', ['default', 'favicon']);          // ╓╌> Heroku Build           //
                                                                    // ║                          //
                                                                    // ║   Runs main build task   //
                                                                    // ╨                          //
