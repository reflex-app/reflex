const path = require('path')
const PROJECT_ROOT = path.resolve(__dirname, '../src')

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  config.module.rules.push({
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
    include: PROJECT_ROOT, // path to node_modules
  })

  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, '../src/'),
  }

  // keep this if you're doing typescript
  config.resolve.extensions.push('.ts', '.tsx')

  // Configure to allow Electron
  // config.module.rules.push({
  //   test: /\.js$/,
  //   exclude: /node_modules/,
  //   loader: 'babel-loader',
  //   options: {
  //     cacheDirectory: true,
  //     babelrc: false,
  //     presets: [
  //       [
  //         '@babel/preset-env',
  //         {
  //           targets: {
  //             electron: '12.0.0',
  //           },
  //         },
  //       ],
  //     ],
  //   },
  // })

  // Vue loader
  // Required since vue-loader v15: https://stackoverflow.com/a/50280764/1114901
  // config.module.rules.push({
  //   test: /\.vue$/,
  //   loader: 'vue-loader',
  // })
  // config.plugins.push(new VueLoaderPlugin())

  // Resolver
  // config.resolve = {
  //   alias: {
  //     '@': path.join(__dirname, '../components/'), // Resolve to local /components dir
  //     vue$: 'vue/dist/vue.esm.js',
  //   },
  //   extensions: ['.js', '.vue', '.json', '.css', '.node'],
  // }

  // Return the altered config
  return config
}
