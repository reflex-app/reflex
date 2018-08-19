const gulp = require('gulp');
const CONFIG = require('../config.js');

// Copies static assets
gulp.task('copy', function() {
  return gulp.src(CONFIG.ASSETS_FILES)
    .pipe(gulp.dest(CONFIG.DIST + 'assets'));
});
