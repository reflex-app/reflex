const gulp = require('gulp');
const rimraf = require('rimraf');

const src = "src/";
const dist = "dist/";
const shipDir = "ship/";

// Erases the dist folder
gulp.task('clean', function(done) {
  rimraf(shipDir, done);
});
