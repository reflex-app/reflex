const gulp = require('gulp');
const CONFIG = require('../config.js');

// Copies static assets
gulp.task('copy', gulp.series('copy:html', 'copy:assets'));

gulp.task('copy:html', function () {
  return gulp.src(CONFIG.SRC + '**/*.html')
    .pipe(gulp.dest(CONFIG.DIST));
});

gulp.task('copy:assets', function () {
  return gulp.src(CONFIG.ASSETS_FILES)
    .pipe(gulp.dest(CONFIG.DIST + 'assets'));
});
