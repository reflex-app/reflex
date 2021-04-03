const path = require('path')
const PROJECT_ROOT = path.resolve(__dirname, '../../')

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push({
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
    include: PROJECT_ROOT, // path to node_modules
  })

  // Configure to allow Electron
  config.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      babelrc: false,
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              electron: '6.1.2',
            },
          },
        ],
      ],
    },
  })

  config.resolve = {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      vue$: 'vue/dist/vue.esm.js',
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node'],
  }

  // Fix issues with FS module (relating to Electron)
  // config.node = {
  //   fs: 'empty',
  //   // electron: 'empty'
  // };

  // Return the altered config
  return config
}
