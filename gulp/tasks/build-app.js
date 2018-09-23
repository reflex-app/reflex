const gulp = require('gulp');
const gutil = require('gulp-util');
const NwBuilder = require('nw-builder');
const replace = require('gulp-replace');
const inquirer = require('inquirer');
const merge = require('merge-stream');
const exec = require('child_process').exec;

// Import configuration settings
const CONFIG = require('../config.js');

// Get current app version
const CURRENT_APP_VERSION = require('../../src/package.json').version;
let NEXT_APP_VERSION;

// Changelog variable
var changelog;

// The overall task
gulp.task('build-app', gulp.series(
    'build-app:prompt',
    'build-app:version',
    'build-app:changelog',
    'build-app:main'));

// Confirm version number
gulp.task('build-app:prompt', function (cb) {
    inquirer.prompt([{
            type: 'input',
            name: 'version',
            message: 'What version is this? (Currently ' + CURRENT_APP_VERSION + ' ):'
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

// Creates a changelog from Git log
// Compares the commits from branch A that are not in branch B
// Then stores it to a variable that can later be used for a
// git log origin/branch-a..origin/branch-b --abbrev-commit --pretty=oneline
gulp.task('build-app:changelog', function (cb) {
    exec('git log origin/v' + NEXT_APP_VERSION + '..origin/master --abbrev-commit --pretty=oneline', function (err, stdout, stderr) {
        log('hi');
        log(stdout);
        log(stderr);
        // changelog = stdout;
        cb(err);
    });
});

// Build the app into a Mac/Windows executable format
// The final distributable is put into the `ship` folder
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

// Creates a draft release on Github
gulp.task('build-app:draft-release', function () {
    return gulp.src('./ship/some-file.exe')
        .pipe(release({
            owner: 'nwittwer', // if missing, it will be extracted from manifest (the repository.url field)
            token: 'token', // or you can set an env var called GITHUB_TOKEN instead
            repo: 'release-test', // if missing, it will be extracted from manifest (the repository.url field)
            tag: 'v' + NEXT_APP_VERSION, // i.e. v0.3.0 (format: v + 0.0.0) from `src/package.json`
            draft: true,
            prerelease: false, // if missing it's false
            manifest: require('./package.json'), // package.json from which default values will be extracted if they're missing
            notes: 'very good!', // @TODO: Add changelog here
        }))
});