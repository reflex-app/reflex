const gulp = require('gulp');
const gutil = require('gulp-util');
const NwBuilder = require('nw-builder');

// Import configuration settings
const CONFIG = require('../config.js');

// The overall task
gulp.task('build-app', gulp.series('build-app:main'));

gulp.task('build-app:main', function () {
    var nw = new NwBuilder({
        version: '0.32.2', // the NWJS version to use
        flavor: 'sdk', // sdk or normal
        files: CONFIG.DIST + '**/*', // copy everything inside of /dist to the final app
        buildDir: CONFIG.SHIP, // output directory
        cacheDir: CONFIG.SHIP, // cached NWJS versions (/dist/cache)
        macCredits: CONFIG.SRC + 'credits.html',
        macIcns: CONFIG.SRC + 'icon.icns',
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