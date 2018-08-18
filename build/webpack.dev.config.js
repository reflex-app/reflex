const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config');
const {resolve} = require('./utils');

const definePlugin = new webpack.DefinePlugin({
    'process.env': {
        'NODE_ENV': JSON.stringify('development')
    }
});

Object.keys(baseWebpackConfig.entry).forEach(function(name) {
    baseWebpackConfig.entry[name] = [resolve('build/hotReload')].concat(baseWebpackConfig.entry[name])
});

let devWebpackConfig = merge(baseWebpackConfig, {
    devtool: 'eval',
    plugins: [definePlugin, new webpack.optimize.OccurrenceOrderPlugin(),new webpack.NoEmitOnErrorsPlugin(), new webpack.HotModuleReplacementPlugin()]
});

module.exports = devWebpackConfig;
