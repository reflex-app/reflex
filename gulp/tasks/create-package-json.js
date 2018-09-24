const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const jsonFormat = require('json-format');
const CONFIG = require('../config.js');

const resolve = (to) => {
    return path.resolve(__dirname, '../..', to);
};

gulp.task('create-package-json:main', function(done) {
    var nwjsConfig = JSON.parse(fs.readFileSync(resolve(`${CONFIG.SRC}/package.json`)).toString());
    fs.writeFile(resolve(`${resolve(CONFIG.DIST)}/package.json`), jsonFormat(nwjsConfig), (err) => err && console.log(err));
    done();
});