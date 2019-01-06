const fs = require('fs');
const gulp = require('gulp');
const gutil = require('gulp-util');
const NwBuilder = require('nw-builder');
const replace = require('gulp-replace');
const inquirer = require('inquirer');
const merge = require('merge-stream');
const exec = require('child_process').exec;
const chalk = require('chalk');
const release = require('gulp-github-release');
const notify = require("gulp-notify");
const archiver = require('archiver');
const opn = require('opn');

// Update process.env based on .env file (in root directory)
require('dotenv').config();

// Import configuration settings
const CONFIG = require('../config.js');

// Get current app version
const CURRENT_APP_VERSION = require('../../src/package.json').version;
let NEXT_APP_VERSION;

// Changelog variable
let CHANGELOG;
let PATH_TO_MAC_ZIP;

// Build task
gulp.task('build-app', gulp.series(
    'build-app:prompt-version',
    'build-app:prompt-version-diff',
    'build-app:version',
    'build-app:main'
));

// Deploy tasks
// TODO: Split this into another file? How to keep the variable values across files?
gulp.task('deploy-app', gulp.series(
    'deploy-app:changelog',
    'deploy-app:zip-app',
    'deploy-app:draft-release',
    'deploy-app:open-release-in-browser'
));

// Confirm version number
gulp.task('build-app:prompt-version', function (done) {
    inquirer.prompt([{
            type: 'input',
            name: 'version',
            message: 'What release version is this? (Currently ' + CURRENT_APP_VERSION + '):'
        }])
        .then(function (res) {
            if (res.version) {
                NEXT_APP_VERSION = res.version;
                console.log(chalk.yellow(`Version updated to ${NEXT_APP_VERSION} 👍`));
            } else {
                NEXT_APP_VERSION = CURRENT_APP_VERSION;
                console.log(chalk.yellow(`Version: ${NEXT_APP_VERSION}`));
            }

            // Update the final ZIP path with the version
            PATH_TO_MAC_ZIP = 'ship/shift-' + NEXT_APP_VERSION + '-mac.zip';

            done();
        });
});

// Choose what version you'd like to compare to
// This will create a link viewable in Github
// Defaults to master branch
gulp.task('build-app:prompt-version-diff', function (done) {
    inquirer.prompt([{
            type: 'input',
            name: 'version',
            message: `Branch/Git tag to compare to ${NEXT_APP_VERSION}: `
        }])
        .then(function (res) {
            if (res.version) {
                // Successful comparison to x version
                COMPARE_VERSION = res.version;
                console.log(chalk.yellow(`Got it, will compare changes in ${COMPARE_VERSION} to ${NEXT_APP_VERSION} 👍`));
            } else {
                // Nothing chosen, default to master
                COMPARE_VERSION = "master";
                console.log(chalk.yellow(`Comparing changes in ${COMPARE_VERSION} to master`));
            }
            done();
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

// Build the app into a Mac/Windows executable format
// The final distributable is put into the `ship` folder
gulp.task('build-app:main', function () {
    var nw = new NwBuilder({
        version: '0.35.3', // the NWJS version to use
        flavor: 'sdk', // sdk or normal
        files: CONFIG.DIST + '**/*', // copy everything inside of /dist to the final app
        buildDir: CONFIG.SHIP, // output directory
        cacheDir: CONFIG.SHIP, // cached NWJS versions (/dist/cache)
        macCredits: CONFIG.ASSETS + 'credits.html',
        macIcns: CONFIG.ASSETS + 'icon.icns',
        platforms: ['osx64'] // win32
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

// Creates a changelog from Git log
// Compares the commits from branch A that are not in branch B
// Then stores it to a variable that can later be used for a
// git log origin/branch-a..origin/branch-b --abbrev-commit --pretty=oneline
gulp.task('deploy-app:changelog', function (cb) {

    // As long as the new version isn't comparing to master...
    // Prepend with a "v" ("v1.0.0") instead of just "1.0.0"
    if (COMPARE_VERSION.includes("master") == false) {
        COMPARE_VERSION = "v" + COMPARE_VERSION;
        NEXT_APP_VERSION = "v" + NEXT_APP_VERSION;
    }

    exec(`git log ${COMPARE_VERSION}.. --abbrev-commit --pretty=oneline`, function (err, stdout, stderr) {
        CHANGELOG = stdout;
        CHANGELOG += `\n\n [View all changes since ${COMPARE_VERSION}](../../compare/${COMPARE_VERSION}..${NEXT_APP_VERSION})`
        console.log(chalk.yellow('Changelog:\n' + CHANGELOG));
        cb(err);
    });
});

// Create a ZIP of executable file
gulp.task('deploy-app:zip-app', function (done) {
    // create a file to stream archive data to.
    var output = fs.createWriteStream(PATH_TO_MAC_ZIP);
    var archive = archiver('zip', {
        zlib: {
            level: 9 // Sets the compression level.
        }
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function () {
        console.log(chalk.yellow('ZIP created: ' + archive.pointer() + ' total bytes'));
        console.log(chalk.yellow(`🚀 Setting up the Github release...`));
        done();
    });

    // Catch warnings
    archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
            // log warning
            console.log(err);
        } else {
            // throw error
            throw err;
        }
    });

    // Catch error
    archive.on('error', function (err) {
        throw err;
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Path to the app, app name
    archive.directory('ship/Shift/osx64/Shift.app/', 'Shift.app');

    // Finish the ZIP
    archive.finalize();
});

// Creates a draft release on Github
// 1. Open the file: `.env` (root directory of this project)
// 2. You can create a Github token here: https://github.com/settings/tokens
// 3. Add: `GITHUB_TOKEN=replace_with_your_token`
// 4. Save the file
gulp.task('deploy-app:draft-release', function () {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
    return gulp.src(PATH_TO_MAC_ZIP)
        .pipe(release({
            owner: 'nwittwer',
            token: GITHUB_TOKEN, // Did you set already add your Github token in a .env file?
            tag: NEXT_APP_VERSION, // format: v0.0.0
            draft: true, // draft or public
            prerelease: false,
            manifest: require('../../package.json'), // package.json from which default values will be extracted if they're missing
            notes: CHANGELOG
        }))
        .pipe(notify({
            title: "🎉 Shift " + NEXT_APP_VERSION + " release draft created!",
            message: "Opening in browser..."
        }))
});

// Opens the Github Releases page
gulp.task('deploy-app:open-release-in-browser', function (done) {
    opn('https://github.com/nwittwer/shift/releases');
    done();
});