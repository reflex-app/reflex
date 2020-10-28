// Update process.env based on .env file (in root directory)
require('dotenv').config()

const exec = require('child_process').exec
const gulp = require('gulp')

const APP_NAME = 'Shift' // TODO: un-hardcode this value
const MAC_CERTIFICATE = process.env.MAC_CERT_ID // Mac certificate ID (xxxxxxxxxx)

function sign(callback) {
  const command = `
        # Go into the ship folder
        cd ship/${APP_NAME}/osx64/
        
        # Code sign your app using the variables above
        codesign --force --deep --verbose --sign  "${MAC_CERTIFICATE}" ${APP_NAME}.app
    `

  exec(command, (err, stdout, stderr) => {
    callback(err)
  })
}

function validate(callback) {
  const command = `
        cd ship/${APP_NAME}/osx64/
        codesign --verify -vvvv ${APP_NAME}.app & spctl -a -vvvv ${APP_NAME}.app
    `

  exec(command, (err, stdout, stderr) => {
    callback(err)
  })
}

gulp.task('code-sign-mac', gulp.series(sign, validate))
