const gulp = require('gulp')
const HubRegistry = require('gulp-hub')

// Configure tasks
const hub = new HubRegistry([
  './gulp-tasks/tasks/**/*.js'
])

// Load tasks
gulp.registry(hub)

// Compile the app
gulp.task('app', gulp.series(
  'build-app'
))

// Draft a release to Github
gulp.task('release', gulp.series(
  'app',
  // 'code-sign-mac',
  'deploy-app'
))
