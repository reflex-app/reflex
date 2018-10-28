const gulp = require('gulp');
const CONFIG = require('../config.js');

// Copies static assets
gulp.task('copy', gulp.series('copy:assets'));

gulp.task('copy:assets', function () {
  return gulp.src(CONFIG.ASSETS_FILES)
    .pipe(gulp.dest(CONFIG.DIST + 'assets'));
});
