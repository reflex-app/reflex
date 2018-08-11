const gulp = require('gulp');
const gutil = require('gulp-util');
const NwBuilder = require('nw-builder');

// The overall task
gulp.task('build-app', gulp.series(nwjs, copy_chromium_to_puppeteer));

// Build NWJS Apps
function nwjs() {
    var nw = new NwBuilder({
        version: '0.32.2', // the NWJS version to use
        flavor: 'sdk', // ship a smaller flavor without Devtools (sdk or normal)
        files: [
            'src/**/*.*',
            '!src/*.app', // ignore the Beta build
            '!src/*.app/**/*', // ignore the Beta build
            '!src/scss/**/*', // ignore the uncompiled SCSS
            '!src/js/**/*', // ignore the uncompiled JS
            'src/js/templates/**/*' // add Mustache templates
        ],
        buildDir: './app',
        cacheDir: './app/NWJS',
        macCredits: 'src/credits.html',
        macIcns: 'src/icon.icns',
        // macPlist: {mac_bundle_id: 'BoomerangPKG'},
        platforms: ['osx64']
    })

    // Log build progress
    nw.on('log', function (msg) {
        gutil.log('nw-builder', msg);
    })

    // Build returns a promise, return it so the task isn't called in parallel
    return nw.build()
        .catch(function (err) {
            gutil.log('nw-builder', err);
        })
}

// Function for NWJS builds that copies .local-chromium to build
function copy_chromium_to_puppeteer() {
    return gulp.src('./src/node_modules/puppeteer/.local-chromium/**/*')
        .pipe(gulp.dest('./app/Boomerang/osx64/Boomerang.app/Contents/Resources/app.nw/node_modules/puppeteer/.local-chromium'))
}