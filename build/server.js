const {
  SERVER_CONFIG,
  PATH_CONFIG
} = require('./config');
const express = require('express');
const fs = require('fs');
const webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
var WebpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.dev.config');
const {
  resolve
} = require('./utils');
const ip = require('ip');
const ora = require('ora');
const chalk = require('chalk');
const spinner = ora('The code is compiling....');
const jsonFormat = require('json-format');
const shell = require('shelljs');

let firstCompiledCompleted = false;

const app = express();
const compiler = webpack(webpackConfig);

let devMiddleware = WebpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

let hotMiddleware = WebpackHotMiddleware(compiler, {
  log: false
});

compiler.plugin('done', stats => {
  firstCompiledCompleted || spinner.stop();
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: true
  }) + '\n');
  firstCompiledCompleted || process.stdout.write(chalk.bold('Local dev server listen : '));
  firstCompiledCompleted || process.stdout.write(chalk.underline(`http://${ip.address()}:${SERVER_CONFIG.PORT}`) + '\n');

  firstCompiledCompleted || startNwjsClient();
  firstCompiledCompleted || (firstCompiledCompleted = true);
});

compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({
      action: 'reload'
    })
    cb()
  })
});

function startNwjsClient() {
  var nwjsConfig = JSON.parse(fs.readFileSync(resolve(`${PATH_CONFIG.MAIN}/nwjs.json`)).toString());
  nwjsConfig['node-remote'] = nwjsConfig.main = `http://${ip.address()}:${SERVER_CONFIG.PORT}/${nwjsConfig.main}`;
  shell.rm('-rf', resolve('.dev_client'));
  shell.exec('mkdir .dev_client', {
    async: false
  });
  fs.writeFile(resolve(`.dev_client/package.json`), jsonFormat(nwjsConfig), (err) => {
    if (err)
      throw err;
    if (!shell.which('nw')) {
      shell.echo('Sorry, this client requires nw, maybe you try \'sudo npm install -g nw\'');
      shell.exit(1);
    } else {
      shell.exec('nw .dev_client', {
        async: true
      });
    }
  });
}

app.use(devMiddleware);
app.use(hotMiddleware);

app.listen(SERVER_CONFIG.PORT, (err) => {
  err && console.log(err);
  spinner.start();
});