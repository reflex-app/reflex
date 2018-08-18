const {PATH_CONFIG} = require('./config');
const fs = require('fs');
const ora = require('ora');
const express = require('express');
const webpack = require('webpack');
const {resolve} = require('./utils');
const webpackConfig = require('./webpack.prod.config');
const shell = require('shelljs');
const jsonFormat = require('json-format');
const spinner = ora('The code is compiling....');

spinner.start();

shell.rm('-rf', resolve(webpackConfig.output.path));

const app = express();

webpack(webpackConfig, (err, stats) => {
  spinner.stop();
  if (err)
    throw err;
  process.stdout.write(stats.toString({colors: true, modules: true, children: true, chunks: true, chunkModules: true}) + '\n');
  var nwjsConfig = JSON.parse(fs.readFileSync(resolve(`${PATH_CONFIG.MAIN}/nwjs.json`)).toString());
  fs.writeFile(resolve(`${resolve(webpackConfig.output.path)}/package.json`), jsonFormat(nwjsConfig),(err)=> err && console.log(err));
});
