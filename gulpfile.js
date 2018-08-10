const gulp = require('gulp');
const browserSync = require('browser-sync');
const requireDir = require('require-dir');
const forwardReference = require('undertaker-forward-reference');

// Set server port
var port = process.env.SERVER_PORT || 3000;

// Let Gulp accept undefined tasks
gulp.registry(forwardReference());

// Load tasks
requireDir('./src/gulp/tasks');

// Tasks
gulp.task('build', gulp.series('clean', 'copy', 'sass', 'javascript'));

// Starts a BrowerSync instance
gulp.task('serve', gulp.series('build', function () {
  browserSync.init({
    server: './src',
    port: port,
    notify: false
  });
}));

// Watch files for changes
gulp.task('watch', function () {
  gulp.watch('src/scss/**/*.scss', gulp.series('sass', reload));
  gulp.watch('src/js/**/*.js', gulp.series('javascript', reload));
});

// Runs all of the above tasks and then waits for files to change
gulp.task('default', gulp.parallel('serve', 'watch'));

// Build the app
gulp.task('app', gulp.series('build-app'));

// Reloads BrowserSync
function reload(done) {
  browserSync.reload();
  done();
}



// // Globals
// const SRC_PATH =  'src';
// const DIST_PATH = 'dist';
// // SASS
// const SASS_PATH = SRC_PATH +  '/scss/**/*.scss';
// const SASS_DEST = DIST_PATH +  '/css/';
// // JS
// const JS_PATH = SRC_PATH +    '/js/**/*.js';
// const JS_DEST = DIST_PATH +    '/js/';

// const JS_FILES = {
//   components: SRC_PATH + '/components/**/*.js',
//   plugins: SRC_PATH + '/plugins/**/*.js'
// };



//
// Watch & Build Tasks
//

// // Build Task
// gulp.task('build',
//   gulp.series(gulp.parallel(compile_sass, javascript),minify_css)
// );

// // Browser Sync & Watching
// gulp.task('serve', function() {
//   browserSync.init({
//     server: {baseDir: "./" + SRC_PATH },
//     notify: false
//   });

//   gulp.watch(SASS_PATH).on('all', gulp.series(compile_sass, minify_css));
//   gulp.watch("./src/*.html").on('change', browserSync.reload);
//   gulp.watch([JS_PATH, '!./src/js/**/*.min.js']).on('all', gulp.series(javascript, browserSync.reload));
//   gulp.watch('./src/img/**/*').on('all', gulp.series(browserSync.reload));
// });


// // Default task
// gulp.task(
//   'default',
//   gulp.series('build', 'serve')
// );


// // Build task to create the app
// gulp.task(
//   'build-app',
//   gulp.series('build', nwjs, copy_chromium_to_puppeteer)
// );


// //
// // Functions
// //


// // SASS
// function compile_sass() {
//   return gulp.src(SASS_PATH)
//   .pipe(sourcemaps.init())
//   .pipe(sass().on('error', sass.logError))
//   .pipe(autoprefixer())
//   .pipe(sourcemaps.write('./maps'))
//   .pipe(gulp.dest(SASS_DEST))
//   .pipe(browserSync.stream({match: '**/*.css'}))
// }

// // SASS Minify
// function minify_css(){
//   return gulp.src(SASS_DEST)
//   .pipe(cssmin())
//   .pipe(concat('style.css'))
//   .pipe(rename('style.min.css'))
//   .pipe(gulp.dest(SASS_DEST))
// }

// // JS
// function javascript() {
//   return gulp.src([
//     './src/js/required/jquery-3.2.1.min.js', // jQuery MUST be loaded first

//     './src/js/required/**/!(jquery-3.2.1)*.js', // all the other required scripts

//     './src/js/plugins/**/*.js', // Any 3rd-party plugins

//     './src/js/app-variables.js', // Setup any variables, namespaces, etc.

//     './src/js/features/**/*.js', // Load all the logic and app functions

//     './src/js/components/**/*.js', // Anything that builds on the features

//     './src/js/app.js' // Triggers functions!
//   ])
//   .pipe(sourcemaps.init())
//   .pipe(concat('app.min.js'))
//   .pipe(sourcemaps.write('.'))
//   .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
//   .pipe(gulp.dest(JS_DEST));
// }