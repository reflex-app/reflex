const path = require('path');
const gulp = require('gulp');
const concat = require('gulp-concat');
// var named = require('vinyl-named');
const sourcemaps = require('gulp-sourcemaps');

const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

// const extractCssPlugin = new ExtractTextPlugin('css/[name].[hash].css');
// const cssLoader = extractCssPlugin.extract(['css-loader','autoprefixer-loader']);
// const sassLoader = extractCssPlugin.extract(['css-loader','autoprefixer-loader', 'sass-loader']);

var utils = require('../utils.js');
var CONFIG = require('../config.js');

const resolve = (to) => {
  return path.resolve(__dirname, '../..', to);
};

// Tasks
gulp.task('javascript', gulp.series('javascript:webpack', 'javascript:main'))

// Webpack
gulp.task('javascript:webpack', function() {
  return gulp.src(resolve(CONFIG.SRC + 'index.js'))
    .pipe(webpackStream({
      target:'node-webkit',
        // entry: {
        //   app: resolve(CONFIG.SRC)
        // },
        output: {
          path: resolve(CONFIG.DIST),
          filename: '[name].[hash].js',
          chunkFilename: '[hash].js'
        },
        resolve: {
          extensions: CONFIG.RESOLVE_CONFIG.EXTENSIONS,
          modules: [resolve('node_modules')],
          alias: CONFIG.RESOLVE_CONFIG.ALIAS
        },
        // plugins: [htmlPlugin,extractCssPlugin],
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
              exclude: new RegExp(`${CONFIG.SRC}/index.html`)
            }, {
            //   test: /\.css$/,
            //   loader: cssLoader
            // }, {
            //   test: /\.scss$/,
            //   loader: sassLoader
            // }, {
              test: /\.json$/,
              loader: 'json-loader'
            }, {
              test: /\.(png|jpg|gif|svg|jpeg)$/,
              loader: 'url-loader',
              query: {
                limit: 10000,
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
    }, webpack))
    .pipe(gulp.dest(CONFIG.DIST));
});

// All other JS
gulp.task('javascript:main', function() {
  return gulp.src([
    CONFIG.SRC + 'js/required/jquery-3.2.1.min.js', // jQuery MUST be loaded first
    CONFIG.SRC + 'js/required/**/!(jquery-3.2.1)*.js', // all the other required scripts
    CONFIG.SRC + 'js/plugins/**/*.js', // Any 3rd-party plugins
    CONFIG.SRC + 'js/app-variables.js', // Setup any variables, namespaces, etc.

    // GUI
    CONFIG.SRC + 'js/features/gui/gui.js',

    // Toolbar
    CONFIG.SRC + 'js/features/toolbar/toolbar.js',
    CONFIG.SRC + 'js/features/toolbar/**/*.js',

    // App Settings
    CONFIG.SRC + 'js/features/settings/settings.js',
    CONFIG.SRC + 'js/features/settings/**/*.js',

    // Artboard
    CONFIG.SRC + 'js/features/artboard/artboard.js',
    CONFIG.SRC + 'js/features/artboard/**/*.js',

    // Canvas
    CONFIG.SRC + 'js/features/canvas/canvas-pan-zoom.js',
    CONFIG.SRC + 'js/features/canvas/canvas-view-mode.js',

    CONFIG.SRC + 'js/components/**/*.js', // Anything that builds on the features

    CONFIG.SRC + 'js/app.js' // Triggers functions!
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('app.min.js'))
  .pipe(sourcemaps.write('.'))
  .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
  .pipe(gulp.dest(CONFIG.DIST + 'js'));
});