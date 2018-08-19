const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const shell = require('shelljs');
const jsonFormat = require('json-format');
const CONFIG = require('../config.js');

const resolve = (to) => {
  return path.resolve(__dirname, '../..', to);
};

gulp.task('dev-package-json', function (done) {
 
  var nwjsConfig = JSON.parse(fs.readFileSync(resolve(`${CONFIG.SRC}/nwjs.json`)).toString());
  // nwjsConfig['node-remote'] = nwjsConfig.main = `http://${ip.address()}:${SERVER_CONFIG.PORT}/${nwjsConfig.main}`;
  fs.writeFile(CONFIG.SRC + resolve(`package.json`), jsonFormat(nwjsConfig),(err)=> err && console.log(err));

  done();
});