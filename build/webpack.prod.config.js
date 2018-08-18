const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config');
const {resolve} = require('./utils');

const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify('production')
  }
});

const uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
  minimize: true,
  sourceMap: false,
  comments: false,
  compress: {
    warnings: false,
    properties: true,
    sequences: true,
    dead_code: true,
    conditionals: true,
    comparisons: true,
    evaluate: true,
    booleans: true,
    unused: true,
    loops: true,
    hoist_funs: true,
    cascade: true,
    if_return: true,
    join_vars: true,
    drop_console: true,
    drop_debugger: true,
    unsafe: true,
    hoist_vars: true,
    negate_iife: true
  }
})

let prodWebpackConfig = merge(baseWebpackConfig, {
  devtool: 'eval',
  plugins: [definePlugin, new webpack.optimize.OccurrenceOrderPlugin(), new webpack.NoEmitOnErrorsPlugin(), uglifyPlugin]
});

module.exports = prodWebpackConfig;
