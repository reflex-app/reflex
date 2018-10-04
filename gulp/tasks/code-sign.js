const gulp = require('gulp');
const exec = require('child_process').exec;

const APP_NAME = "Shift"; // @TODO: un-hardcode this value

function sign(callback) {
    const IDENTITY = process.ENV.MAC_CERT_ID; // Mac certificate ID (xxxxxxxxxx)

    const command = `
        cd ship/${APP_NAME}/osx64/
        codesign --deep --force --verbose --sign "${IDENTITY}" ${APP_NAME}.app
    `;

    exec(command, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
}

function validate(callback) {
    const command = `
        cd ship/${APP_NAME}/osx64/
        codesign --verify -vvvv ${APP_NAME}.app
    `;

    exec(command, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
}

gulp.task('code-sign-mac', gulp.series(sign, validate));