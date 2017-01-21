const gulp            = require('gulp'),                            // Gulp
      runSequence     = require('run-sequence'),                    // Tasks  -> Queue
      mkdirp          = require('mkdirp'),                          // Files  -> Create Directory
      fs              = require('fs'),                              // Files  -> File System
      jimp            = require('jimp'),                            // Image  -> Resize
      imagemin        = require('gulp-imagemin');                   // Image  -> Minify

gulp.task('images', callback =>
  runSequence(
    'image:dir',
    'image:resize',
    'image:min',
    callback
  )
);

// Create image directory
gulp.task('image:dir', () =>
  mkdirp('dist/assets/img', (err) => {
    if (err) console.error(err);
  })
);

// Resize original images to save bandwidth & loading times
gulp.task('image:resize', () =>

  // Find images in directory
  fs.readdir('app/images/', (err, files) =>
    // Loop through each image
    files.forEach(file =>
      jimp.read(`app/images/${file}`).then(img =>
        // Resize original image
        img.resize(400, jimp.AUTO)
          .write(`dist/assets/img/${file.replace(/\.[^/.]+$/, '')}-large.png`)
          .resize(300, jimp.AUTO)
          .write(`dist/assets/img/${file.replace(/\.[^/.]+$/, '')}-medium.png`)
          .resize(100, jimp.AUTO)
          .write(`dist/assets/img/${file.replace(/\.[^/.]+$/, '')}-small.png`)
      ).catch(e =>
        console.error(e)
      )
    )
  )
);

// Minify resized images
gulp.task('image:min', () =>
  gulp.src('dist/assets/img/*.png')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/img'))
);
