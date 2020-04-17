const gulp = require('gulp')
const HubRegistry = require('gulp-hub')

// Configure tasks
const hub = new HubRegistry(['./gulp-tasks/tasks/**/*.js'])

// Load tasks
gulp.registry(hub)
