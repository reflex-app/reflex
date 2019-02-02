const gulp = require('gulp')
const HubRegistry = require('gulp-hub')

// Configure tasks
const hub = new HubRegistry([
  './gulp-tasks/tasks/**/*.js'
])

// Load tasks
gulp.registry(hub)

// Compile the app
gulp.task('BUILD', gulp.series(
  'build-app'
))

// Draft a release to Github
gulp.task('RELEASE', gulp.series(
  'build-app',
  'version-app',
  'deploy-app'
))
