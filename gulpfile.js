const gulp = require('gulp');
const browserSync = require('browser-sync');
const requireDir = require('require-dir');
const forwardReference = require('undertaker-forward-reference');

const CONFIG = require('./gulp/config.js');

// Let Gulp accept undefined tasks
gulp.registry(forwardReference());

// Load tasks
requireDir('./gulp/tasks');

// Tasks
gulp.task('build', gulp.series('copy', 'sass', 'javascript', 'handlebars'));

// Starts a BrowerSync instance
// gulp.task('serve', gulp.series('build', function () {
//   browserSync.init({
//     server: ['./dist', './'],
//     port: port,
//     notify: false
//   });
// }));

// Watch files for changes
gulp.task('watch', function () {
  gulp.watch(CONFIG.SRC + 'scss/**/*.scss', gulp.series('sass'));
  gulp.watch(CONFIG.SRC + 'js/**/*.js', gulp.series('javascript', reload));
  gulp.watch([CONFIG.SRC + 'pages/**/*.hbs', CONFIG.SRC + 'partials/**/*.hbs'], gulp.series('handlebars', reload));
});

// Runs all of the above tasks and then waits for files to change
// gulp.task('default', gulp.parallel('serve', 'watch'));
gulp.task('default', gulp.parallel('watch'));

// Build the app
gulp.task('app', gulp.series('build-app'));

// Reloads BrowserSync
function reload(done) {
  browserSync.reload();
  done();
}