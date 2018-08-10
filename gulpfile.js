// Gulp core
const gulp =          require('gulp');
const concat =        require('gulp-concat');
const rename =        require("gulp-rename");
// BrowserSync
const browserSync =   require('browser-sync').create()
// Utils
const sourcemaps =    require('gulp-sourcemaps');
// SCSS
const sass =          require('gulp-sass');
const autoprefixer =  require('gulp-autoprefixer');
const cssmin =        require('gulp-cssmin');
// JS
const uglify =        require('gulp-uglify');
// Error Logging
const gutil =         require('gulp-util');
// Building the app
var NwBuilder =       require('nw-builder');



// Globals
const SRC_PATH =  'src';
const DIST_PATH = 'src/dist';
// SASS
const SASS_PATH = SRC_PATH +  '/scss/**/*.scss';
const SASS_DEST = DIST_PATH +  '/css/';
// JS
const JS_PATH = SRC_PATH +    '/js/**/*.js';
const JS_DEST = DIST_PATH +    '/js/';

const JS_FILES = {
  components: SRC_PATH + '/components/**/*.js',
  plugins: SRC_PATH + '/plugins/**/*.js'
};





//
// Watch & Build Tasks
//

// Build Task
gulp.task('build',
gulp.series(gulp.parallel(compile_sass, javascript),minify_css)
);

// Browser Sync & Watching
gulp.task('serve', function() {
  browserSync.init({
    server: {baseDir: "./" + SRC_PATH },
    notify: false
  });

  gulp.watch(SASS_PATH).on('all', gulp.series(compile_sass, minify_css));
  gulp.watch("./src/*.html").on('change', browserSync.reload);
  gulp.watch([JS_PATH, '!./src/js/**/*.min.js']).on('all', gulp.series(javascript, browserSync.reload));
  gulp.watch('./src/img/**/*').on('all', gulp.series(browserSync.reload));
});


// Default task
gulp.task(
  'default',
  gulp.series('build', 'serve')
);


// Build task to create the app
gulp.task(
  'build-app',
  gulp.series('build', nwjs, copy_chromium_to_puppeteer)
);


//
// Functions
//


// SASS
function compile_sass() {
  return gulp.src(SASS_PATH)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest(SASS_DEST))
  .pipe(browserSync.stream({match: '**/*.css'}))
}

// SASS Minify
function minify_css(){
  return gulp.src(SASS_DEST)
  .pipe(cssmin())
  .pipe(concat('style.css'))
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest(SASS_DEST))
}

// JS
function javascript() {
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
  .pipe(gulp.dest(JS_DEST));
}





// Build NWJS Apps
function nwjs() {
  var nw = new NwBuilder({
    version: '0.31.4', // the NWJS version to use
    flavor: 'sdk', // ship a smaller flavor without Devtools (sdk or normal)
    files: [
      'src/**/*.*',
      '!src/*.app', // ignore the Beta build
      '!src/*.app/**/*', // ignore the Beta build
      '!src/scss/**/*', // ignore the uncompiled SCSS
      '!src/js/**/*', // ignore the uncompiled JS
      'src/js/templates/**/*' // add Mustache templates
    ],
    buildDir: './app',
    cacheDir: './app/NWJS',
    macCredits: 'src/credits.html',
    macIcns: 'src/icon.icns',
    // macPlist: {mac_bundle_id: 'BoomerangPKG'},
    platforms: ['osx64']
  })

  // Log build progress
  nw.on('log', function (msg) {
    gutil.log('nw-builder', msg);
  })

  // Build returns a promise, return it so the task isn't called in parallel
  return nw.build()
  .catch(function (err) {gutil.log('nw-builder', err);})
}

// Function for NWJS builds that copies .local-chromium to build
function copy_chromium_to_puppeteer() {
  return gulp.src('./src/node_modules/puppeteer/.local-chromium/**/*')
  .pipe(gulp.dest('./app/Boomerang/osx64/Boomerang.app/Contents/Resources/app.nw/node_modules/puppeteer/.local-chromium'))
}
