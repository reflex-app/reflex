const path = require('path')
const PROJECT_ROOT = path.resolve(__dirname, '../src')

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // NOTE: You do NOT need to add rules for vue-loader!
  // These are handled by Storybook automatically

  config.module.rules.push(
    {
      // CSS, SCSS
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      include: PROJECT_ROOT, // path to node_modules
    },
    {
      // Pug loader
      // NOTE: Only needed for Storybook w/ Webpack config
      // it is pre-included with Vite
      test: /\.pug$/,
      use: [{ loader: 'pug-plain-loader' }],
    }
  )

  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, '../src/'),
  }

  // Typescript
  config.resolve.extensions.push('.ts', '.tsx')

  // Return the altered config
  return config
}
