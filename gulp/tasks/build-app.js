const gulp = require('gulp');
const gutil = require('gulp-util');
const NwBuilder = require('nw-builder');

const CONFIG = require('../config.js');

// The overall task
gulp.task('build-app', gulp.series('build-app:main'));

gulp.task('build-app:main', function () {
    var nw = new NwBuilder({
        version: '0.32.2', // the NWJS version to use
        flavor: 'sdk', // ship a smaller flavor without Devtools (sdk or normal)
        files: [
            CONFIG.DIST + '**/*',
        ],
        buildDir: shipDir,
        cacheDir: shipDir,
        macCredits: CONFIG.SRC + 'credits.html',
        macIcns: CONFIG.SRC + 'icon.icns',
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

});