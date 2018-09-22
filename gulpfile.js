const gulp = require('gulp');
const browserSync = require('browser-sync');
const requireDir = require('require-dir');
const forwardReference = require('undertaker-forward-reference');
// Load in the config settings
const CONFIG = require('./gulp/config.js');

// Let Gulp accept undefined tasks
gulp.registry(forwardReference());

// Load all tasks
requireDir('./gulp/tasks');

// Tasks
// Runs all of the above tasks and then waits for files to change
// build --> serve --> watch
gulp.task('default', gulp.parallel('serve', 'watch'));

// Build the app
gulp.task('app', gulp.series('build', 'create-package-json:main', 'build-app'));

// BrowserSync Server
gulp.task('serve', gulp.series('build', 'create-package-json:dev', function () {
  browserSync.init({
    server: CONFIG.DIST,
    port: CONFIG.SERVER.PORT,
    notify: false
  });
}));

// Starts a BrowerSync instance
gulp.task('build', gulp.series('clean', 'copy', 'sass', 'javascript', 'handlebars'));

// Watch files for changes
gulp.task('watch', function () {
  gulp.watch(CONFIG.SRC + 'scss/**/*.scss', gulp.series('sass'));
  gulp.watch(CONFIG.SRC + 'js/**/*.js', gulp.series('javascript', reload));
  gulp.watch([CONFIG.SRC + 'pages/**/*.hbs', CONFIG.SRC + 'partials/**/*.hbs'], gulp.series('handlebars', reload));
});

// Reloads BrowserSync
function reload(done) {
  browserSync.reload();
  done();
}