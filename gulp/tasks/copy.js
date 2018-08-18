const gulp = require('gulp');
const CONFIG = require('../config.js');

const src = "src/";
const dist = "dist/";
const shipDir = "ship/";

// Copies static assets
gulp.task('copy', function() {
  return gulp.src(CONFIG.ASSETS_FILES)
    .pipe(gulp.dest(dist + 'assets'));
});
