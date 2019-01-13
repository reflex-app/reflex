const gulp = require('gulp');
const CONFIG = require('../config.js');

// Copies static assets
gulp.task('copy', gulp.series('copy:indexjs', 'copy:node-modules'));

gulp.task('copy:indexjs', function () {
  return gulp.src(CONFIG.SRC + 'index.js')
    .pipe(gulp.dest(CONFIG.DIST));
});

// Copies Node_Modules folder
gulp.task('copy:node-modules', function() {
  return gulp.src(CONFIG.SRC + 'node_modules/**/*')
    .pipe(gulp.dest(CONFIG.DIST + 'node_modules/'));
});

