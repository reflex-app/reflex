const gulp = require('gulp')
const exec = require('child_process').exec
const inquirer = require('inquirer')
const chalk = require('chalk')
const replace = require('gulp-replace')

// .env configuration
require('dotenv').config()

const GH_TOKEN = process.env.GH_TOKEN || null

if (GH_TOKEN == null) {
  throw new Error('No Github Token found in environment')
}

// Get current app version
const CURRENT_APP_VERSION = require('../../package.json').version
let NEXT_APP_VERSION

// Confirm version number
gulp.task('release:prompt-version', function (done) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'version',
        message:
          'What release version is this? (Currently ' +
          CURRENT_APP_VERSION +
          '):',
      },
    ])
    .then(function (res) {
      if (res.version) {
        NEXT_APP_VERSION = res.version
        console.log(chalk.yellow(`Version updated to ${NEXT_APP_VERSION} 👍`))
      } else {
        NEXT_APP_VERSION = CURRENT_APP_VERSION
        console.log(chalk.yellow(`Version not bumped: ${NEXT_APP_VERSION}`))
      }
      done()
    })
})

// Bumps the version number
// `src/package.json` and `dist/package.json`
gulp.task('release:bump-version', function (done) {
  // Only run this if the version has changed
  if (NEXT_APP_VERSION === CURRENT_APP_VERSION) done()

  return gulp
    .src('./package.json', {
      base: './',
    })
    .pipe(replace(CURRENT_APP_VERSION, NEXT_APP_VERSION))
    .pipe(gulp.dest('./'))
})

gulp.task('release:build-and-publish', function (cb) {
  const process = exec(
    `cross-env GH_TOKEN="${GH_TOKEN}" electron-builder -p 'always'`,
    function (err, stdout, stderr) {
      cb(err)
    }
  )

  process.stdout.on('data', function (data) {
    console.log(data)
  })
})

// Build taskÎ
gulp.task(
  'release',
  gulp.series(
    'release:prompt-version',
    'release:bump-version',
    'release:build-and-publish'
  )
)
