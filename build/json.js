const gulp            = require('gulp'),                            // Gulp
      fs              = require('fs'),                              // Files  -> File System
      runSequence     = require('run-sequence'),                    // Tasks  -> Queue
      yaml            = require('gulp-yaml'),                       // YAML   -> Convert to JSON
      jsonConcat      = require('gulp-json-concat'),                // JSON   -> Join JSON files
      jsonFormat      = require('gulp-json-format'),                // JSON   -> Format JSON
      _               = require('lodash'),                          // JSON   -> Filter JSON
      stringify       = require('json-stable-stringify');           // JSON   -> Stringify

gulp.task('json', callback =>
  runSequence(
    'json:yaml',
    'json:prefecture',
    'json:nation',
    'json:index',
    ['json:list:prefecture', 'json:list:nation'],
    callback)
);

// Convert YAML to JSON
gulp.task('json:yaml', () =>
  gulp.src('app/data/**/*.yml')
    .pipe(yaml({ space: 2 }))
    .pipe(gulp.dest('tmp/data'))
);

// Generate master prefecture file
gulp.task('json:prefecture', () =>
  gulp.src('tmp/data/prefecture/*.json')
    .pipe(jsonConcat('prefecture.json', data => new Buffer(JSON.stringify(data))))
    .pipe(jsonFormat(2))
    .pipe(gulp.dest('tmp/data'))
);

// Generate master nation file
gulp.task('json:nation', () =>
  gulp.src('tmp/data/nation/*.json')
    .pipe(jsonConcat('nation.json', data => new Buffer(JSON.stringify(data))))
    .pipe(jsonFormat(2))
    .pipe(gulp.dest('tmp/data'))
);

// Generate prefecture list
// NOTE: json:index needs to run before this
gulp.task('json:list:prefecture', () =>
  gulp.src(['tmp/data/prefectureList.json', 'tmp/prefecture.json'])
    .pipe(jsonConcat('prefecture.json', data => new Buffer(stringify(data))))
    .pipe(jsonFormat(2))
    .pipe(gulp.dest('tmp/data/list'))
);

// Generate nation list
// NOTE: json:index needs to run before this
gulp.task('json:list:nation', () =>
  gulp.src(['tmp/data/nation.json', 'tmp/nation.json'])
    .pipe(jsonConcat('nation.json', data => new Buffer(stringify(data))))
    .pipe(jsonFormat(2))
    .pipe(gulp.dest('tmp/data/list'))
);


// Generate index file
// TODO: Implement sorting for Last updated, nation specific etc
//       e.g filter by South West nations only
gulp.task('json:index', () => {
  const prefecture = JSON.parse(fs.readFileSync('./tmp/data/prefecture.json', 'utf8')),
        nation = JSON.parse(fs.readFileSync('./tmp/data/nation.json', 'utf8')),
        all = [],
        lastUpdatedSmall = [],
        britishFlagsSmall = [],
        japaneseFlagsSmall = [],
        prefecturePage = [prefecture],
        prefectureSmall = [],
        nationPage = [nation],
        nationSmall = [];

  // TODO: Implement latest update for all flag types
  // all.push(prefecture);
  // all.push(nation);

  let lastUpdated = _.values(prefecture),
      britishFlags = _.filter(prefecture, { location: { nation: ['United Kingdom'] } }),
      japaneseFlags = _.filter(prefecture, { location: { nation: ['Japan'] } });

  lastUpdated = _.chain(lastUpdated).sortBy('updated').value();
  britishFlags = _.sortBy(britishFlags, 'name.en');
  japaneseFlags = _.sortBy(japaneseFlags, 'name.en');

  // gutil.log(lastUpdated);

  // Strip out data not needed on Index page
  lastUpdated.forEach((item) => {
    lastUpdatedSmall.push(_.omit(item, ['location', 'detail', 'about', 'symbolism']));
  });
  britishFlags.forEach((item) => {
    britishFlagsSmall.push(_.omit(item, ['location', 'detail', 'about', 'symbolism']));
  });
  japaneseFlags.forEach((item) => {
    japaneseFlagsSmall.push(_.omit(item, ['location', 'detail', 'about', 'symbolism']));
  });
  prefecturePage.forEach((item) => {
    prefectureSmall.push(_.omit(item, ['location', 'detail', 'about', 'symbolism']));
  });
  nationPage.forEach((item) => {
    nationSmall.push(_.omit(item, ['location', 'detail', 'about', 'symbolism']));
  });

  fs.writeFileSync('./tmp/data/index/updated.json', stringify(lastUpdatedSmall.reverse()));
  fs.writeFileSync('./tmp/data/index/british.json', stringify(britishFlagsSmall));
  fs.writeFileSync('./tmp/data/index/japanese.json', stringify(japaneseFlagsSmall));
  fs.writeFileSync('./tmp/prefecture.json', JSON.stringify(prefectureSmall));
  fs.writeFileSync('./tmp/nation.json', JSON.stringify(nationSmall));

  // gutil.log(lastUpdatedSmall);
  // gutil.log(britishFlagsSmall);

  gulp.src(['tmp/data/index/index.json', 'tmp/data/index/updated.json', 'tmp/data/index/british.json', 'tmp/data/index/japanese.json'])
    .pipe(jsonConcat('index.json', data => new Buffer(JSON.stringify(data))))
    .pipe(jsonFormat(2))
    .pipe(gulp.dest('tmp/data'));
  return true;
});
