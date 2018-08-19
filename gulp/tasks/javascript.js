var gulp = require('gulp');
var concat = require('gulp-concat');
// var webpackStream = require('webpack-stream');
// var webpack = require('webpack');
// var named = require('vinyl-named');
var sourcemaps = require('gulp-sourcemaps');

var utils = require('../utils.js');
var CONFIG = require('../config.js');

gulp.task('javascript', gulp.series('javascript:main'))

gulp.task('javascript:main', function() {
  return gulp.src([
    CONFIG.SRC + 'js/required/jquery-3.2.1.min.js', // jQuery MUST be loaded first
    CONFIG.SRC + 'js/required/**/!(jquery-3.2.1)*.js', // all the other required scripts
    CONFIG.SRC + 'js/plugins/**/*.js', // Any 3rd-party plugins
    CONFIG.SRC + 'js/app-variables.js', // Setup any variables, namespaces, etc.
    CONFIG.SRC + 'js/app-variables.js', // Setup any variables, namespaces, etc.

    // GUI
    CONFIG.SRC + 'js/features/gui/gui.js',

    // Toolbar
    CONFIG.SRC + 'js/features/toolbar/toolbar.js',
    CONFIG.SRC + 'js/features/toolbar/**/*.js',

    // Artboard
    CONFIG.SRC + 'js/features/artboard/artboard.js',
    CONFIG.SRC + 'js/features/artboard/**/*.js',

    // Canvas
    CONFIG.SRC + 'js/features/canvas/canvas-pan-zoom.js',
    CONFIG.SRC + 'js/features/canvas/canvas-view-mode.js',

    CONFIG.SRC + 'js/components/**/*.js', // Anything that builds on the features

    CONFIG.SRC + 'js/app.js' // Triggers functions!
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('app.min.js'))
  .pipe(sourcemaps.write('.'))
  .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
  .pipe(gulp.dest(CONFIG.DIST + 'js'));
});