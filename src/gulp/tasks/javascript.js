var gulp = require('gulp');
var concat = require('gulp-concat');
var webpackStream = require('webpack-stream');
var webpack = require('webpack');
var named = require('vinyl-named');
var sourcemaps = require('gulp-sourcemaps');

var utils = require('../utils.js');
var CONFIG = require('../config.js');

gulp.task('javascript', gulp.series('javascript:main'))

gulp.task('javascript:main', function() {
  return gulp.src([
    './src/js/required/jquery-3.2.1.min.js', // jQuery MUST be loaded first

    './src/js/required/**/!(jquery-3.2.1)*.js', // all the other required scripts

    './src/js/plugins/**/*.js', // Any 3rd-party plugins

    './src/js/app-variables.js', // Setup any variables, namespaces, etc.

    './src/js/features/**/*.js', // Load all the logic and app functions

    './src/js/components/**/*.js', // Anything that builds on the features

    './src/js/app.js' // Triggers functions!
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('app.min.js'))
  .pipe(sourcemaps.write('.'))
  .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
  .pipe(gulp.dest('dist/assets/js'));
});