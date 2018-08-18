const gulp = require('gulp');
const gutil = require('gulp-util');
const NwBuilder = require('nw-builder');

const src = "src/";
const dist = "dist/";
const shipDir = "ship/";

// The overall task
gulp.task('build-app', gulp.series('build-app:main', 'build-app:node_modules'));

gulp.task('build-app:main', function () {
    var nw = new NwBuilder({
        version: '0.32.2', // the NWJS version to use
        flavor: 'sdk', // ship a smaller flavor without Devtools (sdk or normal)
        files: [
            dist + '**/*',
        ],
        buildDir: shipDir,
        cacheDir: shipDir,
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

});

gulp.task('build-app:node_modules', function () {
    return gulp.src('src/node_modules/**/*')
        .pipe(gulp.dest('app/screens/osx64/screens.app/Contents/Resources/app.nw/node_modules'));
});