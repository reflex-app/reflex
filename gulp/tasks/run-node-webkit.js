const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const shell = require('shelljs');
const jsonFormat = require('json-format');
const CONFIG = require('../config.js');

const resolve = (to) => {
  return path.resolve(__dirname, '../..', to);
};

gulp.task('run-node-webkit', function (done) {
  var nwjsConfig = JSON.parse(fs.readFileSync(resolve(`${CONFIG.SRC}/nwjs.json`)).toString());
  fs.writeFile(resolve(`${resolve(CONFIG.DIST)}/package.json`), jsonFormat(nwjsConfig), (err) => err && console.log(err));
  nwjsConfig['node-remote'] = nwjsConfig.main = `http://localhost:${CONFIG.SERVER.PORT}/${nwjsConfig.main}`;
  shell.rm('-rf', resolve('.dev_client'));
  shell.exec('mkdir .dev_client', {
    async: false
  });
  done();
  // fs.writeFile(resolve(`.dev_client/package.json`), jsonFormat(nwjsConfig), (err) => {
  //   if (err)
  //     throw err;
  //   if (!shell.which('nw')) {
  //     shell.echo('Sorry, this client requires nw, maybe you try \'sudo npm install -g nw\'');
  //     shell.exit(1);
  //   } else {
  //     shell.exec('nw dist', { // nw .dev_client
  //       async: true
  //     });
  //   }
  // });
});