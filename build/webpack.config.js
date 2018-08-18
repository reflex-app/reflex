const {resolve} = require('./utils');
const {PATH_CONFIG, RESOLVE_CONFIG,DEFAULT_CONFIG} = require('./config');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCssPlugin = new ExtractTextPlugin('css/[name].[hash].css');
const cssLoader = extractCssPlugin.extract(['css-loader','autoprefixer-loader']);
const sassLoader = extractCssPlugin.extract(['css-loader','autoprefixer-loader', 'sass-loader']);
const lessLoader = extractCssPlugin.extract(['css-loader','autoprefixer-loader', 'less-loader']);
const stylusLoader = extractCssPlugin.extract(['css-loader','autoprefixer-loader', 'stylus-loader']);

var htmlPlugin = new HtmlWebpackPlugin({filename: 'index.html', template: resolve(`${PATH_CONFIG.MAIN}/index.html`), inject: true, title: DEFAULT_CONFIG.TITLE});

module.exports = {
  target:'node-webkit',
  entry: {
    app: resolve(PATH_CONFIG.MAIN)
  },
  output: {
    path: resolve(PATH_CONFIG.OUTPUT),
    filename: '[name].[hash].js',
    chunkFilename: '[hash].js'
  },
  resolve: {
    extensions: RESOLVE_CONFIG.EXTENSIONS,
    modules: [resolve('node_modules')],
    alias: RESOLVE_CONFIG.ALIAS
  },
  plugins: [htmlPlugin,extractCssPlugin],
  resolveLoader: {
    modules: [resolve('node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: [
          {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-friendly-formatter')
            }
          }
        ],
        exclude: /node_modules/
      }, {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'stage-2']
            }
          }
        ],
        exclude: /node_modules/
      },{
        test: /\.html$/,
        loader: 'html-loader',
        exclude: new RegExp(`${PATH_CONFIG.MAIN}/index.html`)
      }, {
        test: /\.css$/,
        loader: cssLoader
      }, {
        test: /\.scss$/,
        loader: sassLoader
      }, {
        test: /\.less$/,
        loader: lessLoader
      }, {
        test: /\.styl$/,
        loader: stylusLoader
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.(png|jpg|gif|svg|jpeg)$/,
        loader: 'url-loader',
        query: {
          limit: 10000, //低于10kb的直接变成base64
          name: 'assets/[name].[ext]?[hash]'
        }
      }, {
        test: /\.((eot|woff|ttf)[\?]?.*)$/,
        loader: 'url-loader',
        query: {
          name: 'assets/[name].[ext]?[hash]'
        }
      }
    ]
  }
};
