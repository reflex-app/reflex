const gulp = require('gulp')
const exec = require('child_process').exec

require('dotenv').config()
const GH_TOKEN = process.env.GH_TOKEN || null

if (GH_TOKEN == null) {
  throw new Error('No Github Token found in environment')
}

gulp.task('github', function (cb) {
  console.log('Starting Github release...')

  const process = exec(`cross-env GH_TOKEN="${GH_TOKEN}" electron-builder -p 'always'`, function (err, stdout, stderr) {
    cb(err)
  })

  process.stdout.on('data', function (data) {
    console.log(data)
  })
})
