const gulp            = require('gulp'),                            // Gulp
      sass            = require('gulp-sass'),                       // SCSS   -> CSS
      autoprefixer    = require('gulp-autoprefixer'),               // CSS    -> Vendor Prefixes
      cssnano         = require('gulp-cssnano'),                    // CSS    -> Minify
      browserSync     = require('browser-sync').create();           // Watch  -> Build Server

// Compile SCSS into CSS
// + Minify CSS
// + Add browser prefixes required for latest 2 versions
gulp.task('scss', () =>
  gulp.src('app/styles/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade:  false
    }))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.reload({ stream: true }))
);
