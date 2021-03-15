const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
// const nodeExternals = require('webpack-node-externals')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  return {
    entry: ['./src/index.ts'],
    module: {
      rules: [
        {
          test: /\.(tsx|ts)?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: 'current',
                  },
                },
              ],
            ],
            plugins: [
              // https://babeljs.io/docs/en/babel-plugin-transform-classes.html
              [
                '@babel/plugin-transform-classes',
                {
                  loose: false,
                },
              ],
              // Transform Class decorators https://babeljs.io/docs/en/babel-plugin-proposal-decorators
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              // Transform Class properties https://babeljs.io/docs/en/babel-plugin-proposal-class-properties
              ['@babel/plugin-proposal-class-properties', { loose: true }],
            ],
          },
        },
      ],
    },

    plugins: [
      // Copy browsers.json to dist/
      new CopyPlugin({
        patterns: [
          { from: './src/browsers.json', to: './' },
          { from: './src/bin', to: './bin' },
        ],
      }),
      // Set Webpack variables
      // https://webpack.js.org/plugins/define-plugin/
      new webpack.DefinePlugin({
        'process.env.PLAYWRIGHT_BROWSERS_PATH': '0',
      }),
      // new NodePolyfillPlugin(), // Polyfill plugins in Webpack (Required in 5+)
    ],

    optimization: {
      minimize: isProduction, // Minimize only for production builds
      minimizer: [
        new TerserPlugin({
          parallel: true,
          // terserOptions: {
          //   keep_fnames: true, // Prevent too much mangling (https://github.com/puppeteer/puppeteer/issues/2245#issuecomment-410735923)
          // },
        }),
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },

    // What should be included in the bundle and what is required externally?
    // We expect Playwright to be inclueded in the parent project
    // https://webpack.js.org/configuration/externals/#object
    target: 'electron-main',
    // target: 'node',
    // externalsPresets: { electronMain: true }, // Replaces 'target' in Webpack 5+
    externals: [{ 'playwright-core': 'playwright-core' }], // https://github.com/puppeteer/puppeteer/issues/3466#issuecomment-513478584]
    // externals: { 'playwright-core': 'playwright-core' }, // https://github.com/puppeteer/puppeteer/issues/3466#issuecomment-513478584]
    // https://github.com/liady/webpack-node-externals

    output: {
      path: path.resolve(__dirname, 'dist/'),
      publicPath: 'dist/',
      filename: '[name].js',
      globalObject: 'this',
      libraryTarget: 'umd', // Universal Module (module.export, ES6, AMD)
      library: 'browserInstaller', // Expose the library under this global variable https://webpack.js.org/guides/author-libraries/#expose-the-library
      // libraryExport: 'default', // Export the default Object
      // umdNamedDefine: true,
    },
    devtool: 'inline-source-map',
  }
}
