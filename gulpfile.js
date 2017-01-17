                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #       Initialise       # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
const gulp            = require('gulp'),                            // Gulp                       //
      sass            = require('gulp-sass'),                       // SCSS   -> CSS              //
      autoprefixer    = require('gulp-autoprefixer'),               // CSS    -> Vendor Prefixes  //
      cssnano         = require('gulp-cssnano'),                    // CSS    -> Minify           //
      rename          = require('gulp-rename'),                     // Files  -> Rename           //
      del             = require('del'),                             // Files  -> Delete           //
      cache           = require('gulp-cache'),                      // Cache  -> Images           //
      mkdirp          = require('mkdirp'),
      fs              = require('fs'),
      jimp            = require('jimp'),
      imagemin        = require('gulp-imagemin'),                   // Image  -> Minify           //
      gutil           = require('gulp-util'),                       // CLI    -> Write & Colours  //
      zeroFill        = require('zero-fill'),                       // CLI    -> Number Padding   //
      stringWidth     = require('string-width'),                    // CLI    -> String Width     //
      browserSync     = require('browser-sync').create(),           // Watch  -> Build Server     //
      Server          = require('karma').Server,                    // Tests  -> Test Server      //
      eslint          = require('gulp-eslint'),                     // Tests  -> JS Quality       //
      scsslint        = require('gulp-scss-lint'),
      scsslintstylish = require('gulp-scss-lint-stylish'),
      connect         = require('gulp-connect'),                    // Heroku -> Deploy Server    //
      runSequence     = require('run-sequence'),                    // Tasks  -> Queue            //
      yaml            = require('gulp-yaml'),
      jsonConcat      = require('gulp-json-concat'),
      jsonFormat      = require('gulp-json-format'),
      archiver        = require('gulp-archiver'),                   // Travis -> ZIP Dist         //
      handlebars      = require('gulp-compile-handlebars'),         // HBS    -> HTML             //
      hbs             = [],                                         // HBS    -> Data             //
      hbsOmitted      = [],                                         // HBBS   -> Omitted info
      options         = {                                           // HBS    -> Options          //
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
        }                                                           //                            //
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
gulp.task('hbs', callback =>
  runSequence(
    'hbs:read',
    'hbs:generate',
    'hbs:omitted',
    callback
  )
);

gulp.task('hbs:read', () => {
  hbs[0] = require('./tmp/data/index.json');
  hbs[1] = require('./tmp/data/prefecture.json');
  return true;
});

gulp.task('hbs:generate', () => {
  const hbsTotal = hbs.length;
  hbs.forEach((item, i) => {
    // Index Page
    // TODO: Properly implement Index page
    if (item.index) {
      // Build log
      _log(1, 'index');

      // Generate HTML
      gulp.src('app/templates/index.hbs')
          .pipe(handlebars(item, options))
          .pipe(rename(`${item.index.page}.html`))
          .pipe(gulp.dest('dist'))
          .pipe(browserSync.reload({
            stream: true
          }));
    // Prefecture Page
    // TODO: Support nation, city etc.
    //       ^ May require changing design of YAML sources
    } else {
      _log(1, 'prefecture', hbsTotal, i);
      const itemTotal = Object.keys(item).length;
      Object.values(item).forEach((flag, j) => {
        _log(2, flag.slug, itemTotal, j);

        // Log missing information
        /*
        if (typeof flag.location === 'undefined') {
          hbsOmitted.push([flag.slug, 'no location']);
        } else if (typeof flag.location.position === 'undefined') {
          hbsOmitted.push([flag.slug, 'no location->position']);
        } else if (typeof flag.location.nation === 'undefined') {
          hbsOmitted.push([flag.slug, 'no location->nation']);
        }
        */

        // Generate HTML
        gulp.src('app/templates/prefecture.hbs')
            .pipe(handlebars(flag, options))
            .pipe(rename(`${flag.slug}/index.html`))
            .pipe(gulp.dest('dist/prefecture'))
            .pipe(browserSync.reload({
              stream: true
            }));
      });
    }
  });
  return true;
});

gulp.task('hbs:omitted', () => {
  hbsOmitted.forEach((item) => {
    gutil.log(` Omitted '${item[0]}' ${item[1]}`);
  });

  // Fail the travis build if there were any omissions
  if (hbsOmitted.length > 0) {
    console.log('Generation finished with error code 1');
    return process.exit(1);
  }
  return true;
});

gulp.task('json', callback =>
  runSequence(
    'json:yaml',
    'json:prefecture',
    'json:index',
    callback));

gulp.task('json:yaml', () =>
  gulp.src('app/data/**/*.yml')
    .pipe(yaml({ space: 2 }))
    .pipe(gulp.dest('tmp/data')));

gulp.task('json:prefecture', () =>
  gulp.src('tmp/data/prefecture/*.json')
    .pipe(jsonConcat('prefecture.json', data => new Buffer(JSON.stringify(data))))
    .pipe(jsonFormat(2))
    .pipe(gulp.dest('tmp/data')));

// TODO: Remove
gulp.task('json:index', () =>
  gulp.src(['tmp/data/index/index.json', 'tmp/data/prefecture.json'])
    .pipe(jsonConcat('index.json', data => new Buffer(JSON.stringify(data))))
    .pipe(jsonFormat(2))
    .pipe(gulp.dest('tmp/data')));
                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #          SCSS          # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
gulp.task('sass:build', () =>                                       // ╓╌> SASS                   //
  gulp.src('app/styles/**/*.scss')                                  // ║                          //
    .pipe(sass())                                                   // ║   Compiles .scss files   //
    .pipe(cssnano())                                                // ║    to .css files         //
    .pipe(gulp.dest('dist/assets/css'))                             // ║   Reloads page if run    //
    .pipe(browserSync.reload({                                      // ║    from watch task       //
      stream: true                                                  // ║                          //
    })));                                                           // ╨                          //
                                                                    //                            //
gulp.task('autoprefixer', () =>                                     // ╓╌> Autoprefixer           //
  gulp.src('dist/assets/css/app.css')                               // ║                          //
    .pipe(autoprefixer({                                            // ║   Add vendor prefixes    //
      browsers: ['last 2 versions'],                                // ║    to fully support      //
      cascade:  false                                               // ║    last 2 versions of    //
    }))                                                             // ║    major browsers        //
    .pipe(gulp.dest('dist')));                                      // ╨                          //
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
gulp.task('images', callback =>
  runSequence(
    'image:resize',
    'image:min',
    callback
  ));

gulp.task('image:resize', () => {
  // Create img folder on build
  mkdirp('dist/assets/img', (err) => {
    if (err) console.error(err);
  });
  // Generate images
  fs.readdir('app/images/', (err, files) => {
    files.forEach((file) => {
      // console.log(file);
      jimp.read(`app/images/${file}`).then((img) => {
        const fileName = file.replace(/\.[^/.]+$/, '');
        img.resize(300, jimp.AUTO)
          .write(`dist/assets/img/${fileName}-large.png`)
          .resize(200, jimp.AUTO)
          .write(`dist/assets/img/${fileName}-medium.png`)
          .resize(100, jimp.AUTO)
          .write(`dist/assets/img/${fileName}-small.png`);
      }).catch((err2) => {
        console.error(err2);
      });
    });
  });
  // gulp.src('app/images/*.+(jpg,png)')
    // .pipe(parallel(
    //   imageResize({ width: 100, imageMagick: true }),
    //   rename((path) => { path.basename += '-small'; }),
    //   os.cpus().length
    // ))
    // .pipe(gulp.dest('dist/assets/img'));
});
                                                                    //                            //
gulp.task('image:min', () =>                                        // ╓╌> Images                 //
  gulp.src('dist/assets/img/*.+(png|jpeg|jpg|gif|svg)')             // ║                          //
    .pipe(cache(imagemin()))                                        // ║   Move and cache images  //
    .pipe(gulp.dest('dist/assets/img')));                           // ╨                          //
                                                                    //                            //
gulp.task('fonts', () =>                                            // ╓╌> Fonts                  //
  gulp.src('app/fonts/**/*')                                        // ║                          //
    .pipe(gulp.dest('dist/fonts'))
);                                                                  // ╨                          //
                                                                    //                            //
gulp.task('favicon', () =>                                          // ╓╌> Favicon                //
  gulp.src('app/public/**/*')                                       // ║                          //
    .pipe(gulp.dest('dist/'))
);                                                                  // ╨                          //
                                                                    //                            //
gulp.task('clean:dist', () => del.sync('dist/**/*'));
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
gulp.task('eslint', () =>                                           // ╓╌> EsLint                 //
  gulp.src([                                                        // ║                          //
    '**/*.js',                                                      // ║   Check JavaScript       //
    '!node_modules/**',                                             // ║    against ruleset       //
    '!dist/**',                                                     // ║    and validate syntax   //
    '!app/vendor/**',                                               // ║                          //
  ])                                                                // ║                          //
    .pipe(eslint())                                                 // ║                          //
    .pipe(eslint.format())                                          // ║                          //
);                                                                  // ╨                          //
                                                                    //                            //
gulp.task('scsslint', () =>                                         // ╓╌> SCSS Lint              //
  gulp.src([                                                        // ║                          //
    'app/styles/**/*.scss',                                         // ║                          //
    '!app/styles/vendor/**'                                         // ║                          //
  ])                                                                // ║                          //
    .pipe(scsslint({                                                // ║                          //
      customReport: scsslintstylish,                                // ║                          //
      config:       '.scss-lint.yml'                                // ║                          //
    }))                                                             // ║                          //
);                                                                  // ╨                          //
                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #          Dev           # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
gulp.task('browserSync', () =>                                      // ╓╌> BrowserSync            //
  browserSync.init({                                                // ║                          //
    server: {                                                       // ║   Starts server          //
      baseDir: './dist',                                            // ║                          //
    },                                                              // ║                          //
    open: false
  })                                                                // ║                          //
);                                                                  // ╨                          //
                                                                    //                            //
gulp.task('watch', (callback) => {                                  // ╓╌> Watch                  //
  runSequence(                                                      // ║                          //
    'default',                                                      // ║   Builds app and         //
    'browserSync',                                                  // ║    watches files for     //
    ['hbs', 'sass:build', 'javascript'],                     // ║    changes & rebuilds    //
    'autoprefixer',                                                 // ║    them                  //
    callback                                                        // ║                          //
  );                                                                // ║                          //
  gulp.watch('app/**/*.scss', ['sass:build', 'autoprefixer']);      // ║                          //
  gulp.watch('app/**/*.hbs', ['hbs'], browserSync.reload);   // ║                          //
  gulp.watch('app/**/*.json', ['hbs'], browserSync.reload);  // ║                          //
  gulp.watch('app/**/*.js', ['javascript'], browserSync.reload);    // ║                          //
});                                                                 // ╨                          //
                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #         Build          # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
gulp.task('default', callback =>                                  // ╓╌> Build                  //
  runSequence(                                                      // ║                          //
    'clean:dist',                                                   // ║   Main task that builds  //
    'json',
    ['hbs', 'sass:build', 'javascript'],                            // ║    the app               //
    'autoprefixer',                                                 // ║                          //
    'images',
    callback                                                        // ║                          //
  )                                                                 // ║                          //
);                                                                  // ╨                          //
                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #      Unit Testing      # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
gulp.task('test', callback =>                                     // ╓╌> Test                   //
  runSequence(                                                      // ║                          //
    'scsslint',                                                     // ║   Runs lint task then    //
    'eslint',                                                       // ║    starts unit tests     //
    'test:unit',                                                    // ║                          //
    callback                                                        // ║                          //
  )                                                                 // ║                          //
);                                                                  // ╨                          //
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
gulp.task('heroku:serve', () =>                                     // ╓╌> Heroku Serve           //
  connect.server({                                                  // ║                          //
    name:       'Heroku App',                                       // ║   Starts server running  //
    root:       `${__dirname}/dist`,                                // ║    when built in Heroku  //
    livereload: false,                                              // ║                          //
    port:       process.env.PORT || 8000                            // ║                          //
  })                                                                // ║                          //
);                                                                  // ╨                          //
                                                                    //                            //
gulp.task('heroku:production', ['default', 'favicon']);             // ╓╌> Heroku Build           //
                                                                    // ║                          //
                                                                    // ║   Runs main build task   //
                                                                    // ╨                          //
                                                                    // ########################## //
                                                                    // #                        # //
                                                                    // #         Release        # //
                                                                    // #                        # //
                                                                    // ########################## //
                                                                    //                            //
gulp.task('zip', () =>
  gulp.src('dist/**')
    .pipe(archiver('hatayama.zip'))
    .pipe(gulp.dest('./'))
);
