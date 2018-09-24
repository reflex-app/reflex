const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const jsonFormat = require('json-format');
const CONFIG = require('../config.js');

const resolve = (to) => {
    return path.resolve(__dirname, '../..', to);
};

gulp.task('create-package-json:dev', function(done) {
  var nwjsConfig = JSON.parse(fs.readFileSync(resolve(`${CONFIG.SRC}/package.json`)).toString());
  nwjsConfig['node-remote'] = nwjsConfig.main = `http://localhost:${CONFIG.SERVER.PORT}/${nwjsConfig.main}`;
  fs.writeFile(resolve(`${resolve(CONFIG.DIST)}/package.json`), jsonFormat(nwjsConfig), (err) => err && console.log(err));
  done();
});