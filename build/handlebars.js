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
      },
      // Log missing information
      omissions = (flag, type) => {
        // Name
        if (typeof flag.name === 'undefined') {
          hbsOmitted.push([flag.slug, 'name', 1]);
        } else if (typeof flag.name.en === 'undefined') {
          hbsOmitted.push([flag.slug, 'name.en', 1]);
        }
        // Location
        if (typeof flag.location === 'undefined') {
          hbsOmitted.push([flag.slug, 'location', 1]);
        } else {
          if (typeof flag.location.latitude === 'undefined') {
            hbsOmitted.push([flag.slug, 'location.latitude', 0]);
          }
          if (typeof flag.location.longitude === 'undefined') {
            hbsOmitted.push([flag.slug, 'location.longitude', 0]);
          }
          if (typeof flag.location.zoom === 'undefined') {
            hbsOmitted.push([flag.slug, 'location.zoom', 0]);
          }
          if (typeof flag.location.position === 'undefined' &&
        type === 'prefecture') {
            hbsOmitted.push([flag.slug, 'location.position', 0]);
          }
          if (typeof flag.location.nation === 'undefined' &&
        type === 'prefecture') {
            hbsOmitted.push([flag.slug, 'location.nation', 1]);
          }
          if (typeof flag.location.continent === 'undefined' &&
        type === 'nation') {
            hbsOmitted.push([flag.slug, 'location.continent', 1]);
          }
        }
        // Detail
        if (typeof flag.detail === 'undefined') {
          hbsOmitted.push([flag.slug, 'detail', 0]);
        } else {
          if (typeof flag.detail.flag === 'undefined') {
            hbsOmitted.push([flag.slug, 'detail.flag', 0]);
          } else {
            if (typeof flag.detail.flag.adopted === 'undefined') {
              hbsOmitted.push([flag.slug, 'detail.flag.adopted', 0]);
            }
            if (typeof flag.detail.flag.ratio === 'undefined') {
              hbsOmitted.push([flag.slug, 'detail.flag.ratio', 0]);
            }
            if (typeof flag.detail.flag.designer === 'undefined') {
              hbsOmitted.push([flag.slug, 'detail.flag.designer', 0]);
            }
          }
          if (typeof flag.detail.other === 'undefined') {
            hbsOmitted.push([flag.slug, 'detail.other', 0]);
          } else {
            if (typeof flag.detail.other.area === 'undefined') {
              hbsOmitted.push([flag.slug, 'detail.other.area', 0]);
            }
            if (typeof flag.detail.other.population === 'undefined') {
              hbsOmitted.push([flag.slug, 'detail.other.population', 0]);
            }
            if (typeof flag.detail.other.density === 'undefined') {
              hbsOmitted.push([flag.slug, 'detail.other.density', 0]);
            }
          }
        }
        // Symbolism
        if (typeof flag.symbolism === 'undefined') {
          hbsOmitted.push([flag.slug, 'symbolism', 0]);
        }
        // About
        if (typeof flag.about === 'undefined') {
          hbsOmitted.push([flag.slug, 'about', 0]);
        }
        // Updated
        if (typeof flag.updated === 'undefined') {
          hbsOmitted.push([flag.slug, 'updated', 1]);
        }
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
    } else if (i === 1) {
      _log(1, 'prefecture', hbsTotal, i);
      const itemTotal = Object.keys(item).length;
      Object.values(item).forEach((flag, j) => {
        _log(2, flag.slug, itemTotal, j);

        // Log missing information
        omissions(flag, 'prefecture');

        // Generate HTML
        gulp.src('app/templates/flag.hbs')
            .pipe(handlebars(flag, options))
            .pipe(rename(`${flag.slug}/index.html`))
            .pipe(gulp.dest('dist/prefecture'))
            .pipe(browserSync.reload({
              stream: true
            }));
      });
    } else if (i === 2) {
      _log(1, 'nation', hbsTotal, i);
      const itemTotal = Object.keys(item).length;
      Object.values(item).forEach((flag, j) => {
        _log(2, flag.slug, itemTotal, j);

        // Log missing information
        omissions(flag, 'nation');

        // Generate HTML
        gulp.src('app/templates/flag.hbs')
            .pipe(handlebars(flag, options))
            .pipe(rename(`${flag.slug}/index.html`))
            .pipe(gulp.dest('dist/nation'))
            .pipe(browserSync.reload({
              stream: true
            }));
      });
    }
  });

  // Generate prefecture list
  gulp.src('app/templates/prefecture.hbs')
    .pipe(handlebars(
      JSON.parse(fs.readFileSync('./tmp/data/list/prefecture.json', 'utf8')),
      options))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist/prefecture'))
    .pipe(browserSync.reload({
      stream: true
    }));

  // Generate feedback
  gulp.src('app/templates/feedback.hbs')
    .pipe(handlebars('', options))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist/feedback'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Output missing information
gulp.task('hbs:omitted', () => {
  let critical = false;

  // Loop through each omission
  hbsOmitted.forEach((item) => {
    // Compose message
    const flag = ` '${gutil.colors.cyan(item[0])}'`,
          missing = gutil.colors.black(`${item[1]}`);
    let prefix = gutil.colors.yellow(' Omitted'),
        space = '';
    // Check if omission is critical (1)
    if (item[2] === 1) {
      // Set prefix to Critical
      prefix = gutil.colors.red('Critical');
      // Toggle critical to true
      critical = true;
    }
    // Align missing information column
    const width = 38 - stringWidth(prefix + flag);
    for (let i = 0; i < width; i++) {
      space = `${space}\u200A`;
    }
    // Output message
    gutil.log(`${prefix}${flag}${space}${missing}`);
  });

  // Fail Travis and CircleCI builds if there was a critical error
  if (hbsOmitted.length > 0 && critical === true) {
    console.log(
      'Critical information is missing from data sources\n' +
      'See critical errors in hbs:omitted for details'
    );
    return process.exit(1);
  }
});
