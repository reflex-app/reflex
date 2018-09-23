const gulp = require('gulp');
const gutil = require('gulp-util');
const NwBuilder = require('nw-builder');
const replace = require('gulp-replace');
const inquirer = require('inquirer');
const merge = require('merge-stream');
const exec = require('child_process').exec;
const chalk = require('chalk');
const release = require('gulp-github-release');

// Update process.env based on .env file (in root directory)
require('dotenv').config();

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
    'build-app:main',
    'build-app:draft-release'
));

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
        // console.log( chalk.yellow(stdout) );
        // console.log( chalk.yellow(stderr) );

        changelog = stdout;
        console.log(chalk.yellow(changelog));
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
// 1. Open the file: `.env` (root directory of this project)
// 2. Add: `GITHUB_TOKEN=replace_with_your_token`
// 3. Save
// 4. You can create a Github token here: https://github.com/settings/tokens
gulp.task('build-app:draft-release', function () {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

    return gulp.src('./ship/Shift/osx64/Shift.app')
        .pipe(release({
            owner: 'nwittwer',
            token: GITHUB_TOKEN, // Did you set already add your Github token?
            tag: 'v' + NEXT_APP_VERSION, // i.e. v0.3.0 (format: v + 0.0.0) from `src/package.json`
            draft: true,
            prerelease: false, // if missing it's false
            manifest: require('../../package.json'), // package.json from which default values will be extracted if they're missing
            notes: changelog
        }))
});