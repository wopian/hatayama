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
      // Handlebars options
      options         = {
        ignorePartials: true,
        batch:          ['./app/templates/components'],
        helpers:        {
          // {{#ifEq a 'b'}}
          // Check if both values are equal
          ifEq(a, b, opts) {
            if (a === b) {
              return opts.fn(this);
            }
            return opts.inverse(this);
          },
          // {{#ifNotEq a 'b'}}
          // Check if both values are not equal
          ifNotEq(a, b, opts) {
            if (a !== b) {
              return opts.fn(this);
            }
            return opts.inverse(this);
          },
          // {{#formatNumber a}}
          // Formats 1000 into 1,000
          formatNumber(a) {
            return String(a).replace(/(.)(?=(\d{3})+$)/g, '$1,');
          }
        }
      },
      // Prettify CLI output for Handlebars generation
      _log = (type, page, total = 1, current = 0) => {
              // Zero fill values to 2 digits (i.e 3 to 03)
              // Current file (+1 otherwise it'll be 00/01)
        const a = zeroFill(2, current + 1),
              // Total files
              b = zeroFill(2, total),
              // Formats progress (i.e 01/03)
              c = `${a}/${b}`,
              // Distance from left progress should be
              k = 40;

        let d,
            e = '',
            f,
            g,
            h,
            i,
            j = '';

        switch (type) {
        // 'Populate' layout
        case 1: {
          d = 'Populate ';
          // Set page name as cyan
          f = gutil.colors.cyan(page);
          // Set progress as magenta
          g = `${gutil.colors.magenta(c)}`;
          // Find width needed to align progress
          // e.g 40 - 23
          h = k - stringWidth(d + e + f + g);
          // Add hair spaces
          for (i = 0; i <= h; i++) {
            j = `${j}\u200A`;
          }
          break;
        }
        // 'Generate' layout
        case 2: {
          d = 'Generate ';
          // Set child delimiter
          e = ' ↪ ';
          // Set page name as cyan
          f = gutil.colors.cyan(page);
          // Set progress as black
          g = `${gutil.colors.black(c)}`;
          // Find width needed to align progress
          // e.g 40 - 23
          h = k - stringWidth(d + e + f + g);
          // Add hair spaces
          for (i = 0; i < h; i++) {
            j = `${j}\u200A`;
          }
          break;
        }
        default: { break; }
        }
        // Output string
        return gutil.log(`${d}${e}\'${f}\'${j}${g}`);
      };

gulp.task('hbs', callback =>
  runSequence(
    'hbs:read',
    'hbs:generate',
    'hbs:omitted',
    callback
  )
);

// Import data from generated JSON
gulp.task('hbs:read', () => {
  hbs[0] = JSON.parse(fs.readFileSync('./tmp/data/index.json', 'utf8'));
  hbs[1] = JSON.parse(fs.readFileSync('./tmp/data/prefecture.json', 'utf8'));
  hbs[2] = JSON.parse(fs.readFileSync('./tmp/data/nation.json', 'utf8'));
});

// Generate pages
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
});
