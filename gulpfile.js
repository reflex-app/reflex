const gulp = require('gulp');
const browserSync = require('browser-sync');
const requireDir = require('require-dir');
const forwardReference = require('undertaker-forward-reference');
const exec = require('child_process').exec;

// Load in the config settings
const CONFIG = require('./gulp/config.js');

// Let Gulp accept undefined tasks
gulp.registry(forwardReference());

// Load all tasks
requireDir('./gulp/tasks');

// Tasks
// 1. Default: copy a development version of the package.json
// 2. App: Vue + Webpack compile, Compiles the app
// 3. Release: Drafts a release of the app to Github

// Create a development version of the package.json
// This will allow NW.JS to run the http://localhost:8080 port
gulp.task('default', gulp.series('copy', 'create-package-json:dev', 'watch'));

gulp.task('watch', () => {
  gulp.watch(CONFIG.SRC + 'index.js', () => {
    return gulp.src(CONFIG.SRC + 'index.js')
      .pipe(gulp.dest(CONFIG.DIST));
  })
});

// Builds JS + SCSS
gulp.task('vue:build', function (done) {
  const command = `vue-cli-service build`;
  exec(command, (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    done();
  });
});

// Compile the app
gulp.task('app', gulp.series(
  'clean',
  'vue:build',
  'copy',
  'create-package-json:main',
  'build-app'
));

// Draft a release to Github
gulp.task('release', gulp.series(
  'app',
  'code-sign-mac',
  'deploy-app'
));

// Reloads BrowserSync
function reload(done) {
  browserSync.reload();
  done();
}