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
// 1. Default
// 2. Build
// 3. Serve
// 4. App: Compiles the app
// 5. Release: Drafts a release of the app to Github
gulp.task('default', gulp.parallel('serve', 'watch'));

// Starts a BrowerSync instance
gulp.task('build', gulp.series('clean', 'sass', 'javascript', 'handlebars'));

// BrowserSync Server
gulp.task('serve', gulp.series('build', 'create-package-json:dev', function () {
  browserSync.init({
    server: CONFIG.DIST,
    port: CONFIG.SERVER.PORT,
    notify: false
  });
}));

// Compile the app
gulp.task('app', gulp.series('build', 'create-package-json:main', 'build-app'));

// Draft a release to Github
gulp.task('release', gulp.series('build', 'create-package-json:main', 'build-app', 'deploy-app'));

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