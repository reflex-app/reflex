const gulp = require('gulp');
const CONFIG = require('../config.js');

gulp.task('copy', gulp.series('copy:assets', 'copy:node-modules'));

// Copies static assets
gulp.task('copy:assets', function() {
  return gulp.src(CONFIG.ASSETS_FILES)
    .pipe(gulp.dest(CONFIG.DIST + 'assets'));
});

// Copies Node_Modules folder
gulp.task('copy:node-modules', function() {
  return gulp.src(CONFIG.SRC + 'node_modules/**/*')
    .pipe(gulp.dest(CONFIG.DIST + 'node_modules/'));
});

