const gulp = require('gulp');
const rimraf = require('rimraf');
const CONFIG = require('../config.js');

// Erases the dist folder
gulp.task('clean', function(done) {
  rimraf(CONFIG.DIST, done);
});
