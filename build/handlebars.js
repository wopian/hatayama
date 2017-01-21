const gulp            = require('gulp'),                            // Gulp                       //
      runSequence     = require('run-sequence'),                    // Tasks  -> Queue            //
      browserSync     = require('browser-sync').create(),           // Watch  -> Build Server     //
      rename          = require('gulp-rename'),                     // Files  -> Rename           //
      fs              = require('fs'),                              // Files  -> File System      //
      gutil           = require('gulp-util'),                       // CLI    -> Write & Colours  //
      zeroFill        = require('zero-fill'),                       // CLI    -> Number Padding   //
      stringWidth     = require('string-width'),                    // CLI    -> String Width     //
      handlebars      = require('gulp-compile-handlebars'),         // HBS    -> HTML             //
      hbs             = [],                                         // HBS    -> Data             //
      hbsOmitted      = [],                                         // HBS   -> Omitted info      //
      options         = {                                           // HBS    -> Options          //
        ignorePartials: true,                                       //                            //
        batch:          ['./app/templates/components'],             // HBS    -> Partials         //
        helpers:        {                                           // HBS    -> Helpers:         //
          if_eq(a, b, opts) {                                       // ╓╌> {{#if_eq a 'b'}}       //
            if (a === b) {                                          // ║   Check if both values   //
              return opts.fn(this);                                 // ║    are equal             //
            }                                                       // ║                          //
            return opts.inverse(this);                              // ║                          //
          },                                                        // ╨                          //
          if_not_eq(a, b, opts) {
            if (a !== b) {
              return opts.fn(this);
            }
            return opts.inverse(this);
          },
          formatNumber(a) {                                         // ╓╌> {{#formatNumber a}}    //
            return String(a).replace(/(.)(?=(\d{3})+$)/g, '$1,');   // ║   Convert 5000 to 5,000  //
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
      };

gulp.task('hbs', callback =>
  runSequence(
    'hbs:read',
    'hbs:generate',
    'hbs:omitted',
    callback
  )
);

gulp.task('hbs:read', () => {
  hbs[0] = JSON.parse(fs.readFileSync('./tmp/data/index.json', 'utf8'));
  hbs[1] = JSON.parse(fs.readFileSync('./tmp/data/prefecture.json', 'utf8'));
  hbs[2] = JSON.parse(fs.readFileSync('./tmp/data/nation.json', 'utf8'));
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
        gulp.src('app/templates/flag.hbs')
            .pipe(handlebars(flag, options))
            .pipe(rename(`${flag.slug}/index.html`))
            .pipe(gulp.dest('dist/prefecture'))
            .pipe(browserSync.reload({
              stream: true
            }));
      });
    }
  });
  gulp.src('app/templates/prefecture.hbs')
    .pipe(handlebars(JSON.parse(fs.readFileSync('./tmp/data/list/prefecture.json', 'utf8')), options))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist/prefecture'))
    .pipe(browserSync.reload({
      stream: true
    }));
  gulp.src('app/templates/feedback.hbs')
    .pipe(handlebars('', options))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist/feedback'))
    .pipe(browserSync.reload({
      stream: true
    }));
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
