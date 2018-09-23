const gulp = require('gulp');
const gutil = require('gulp-util');
const NwBuilder = require('nw-builder');
const replace = require('gulp-replace');
const inquirer = require('inquirer');
const merge = require('merge-stream');

// Import configuration settings
const CONFIG = require('../config.js');

// Get current app version
const CURRENT_APP_VERSION = require('../../src/package.json').version;
let NEXT_APP_VERSION;

// The overall task
gulp.task('build-app', gulp.series('build-app:prompt', 'build-app:version', 'build-app:main'));

// Confirm version number
gulp.task('build-app:prompt', function (cb) {
    inquirer.prompt([{
            type: 'input',
            name: 'version',
            message: 'What version are we moving to? (Current version is ' + CURRENT_APP_VERSION + ')'
        }])
        .then(function (res) {
            if (res.version) {
                NEXT_APP_VERSION = res.version;
            } else {
                NEXT_APP_VERSION = CURRENT_APP_VERSION;
            }

            cb();
        });
});

// Bumps the version number
// `src/package.json` and `dist/package.json`
gulp.task('build-app:version', function () {
    const src = gulp.src(CONFIG.SRC + 'package.json')
        .pipe(replace(CURRENT_APP_VERSION, NEXT_APP_VERSION))
        .pipe(gulp.dest(CONFIG.SRC));

    const dist = gulp.src(CONFIG.DIST + 'package.json')
        .pipe(replace(CURRENT_APP_VERSION, NEXT_APP_VERSION))
        .pipe(gulp.dest(CONFIG.DIST));

    return merge(src, dist);
});

gulp.task('build-app:main', function () {
    var nw = new NwBuilder({
        version: '0.33.1', // the NWJS version to use
        flavor: 'sdk', // sdk or normal
        files: CONFIG.DIST + '**/*', // copy everything inside of /dist to the final app
        buildDir: CONFIG.SHIP, // output directory
        cacheDir: CONFIG.SHIP, // cached NWJS versions (/dist/cache)
        macCredits: CONFIG.SRC + 'credits.html',
        macIcns: CONFIG.SRC + 'icon.icns',
        platforms: ['osx64', 'win32']
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