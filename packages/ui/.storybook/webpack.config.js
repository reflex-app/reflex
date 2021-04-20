const path = require('path')
const PROJECT_ROOT = path.resolve(__dirname, '../src')

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // NOTE: You do NOT need to add rules for vue-loader!
  // These are handled by Storybook automatically

  // Loading SVGs
  // https://stackoverflow.com/a/57074973/1114901
  let rule = config.module.rules.find(
    (r) =>
      // it can be another rule with file loader
      // we should get only svg related
      r.test &&
      r.test.toString().includes('svg') &&
      // file-loader might be resolved to js file path so "endsWith" is not reliable enough
      r.loader &&
      r.loader.includes('file-loader')
  )
  rule.test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/

  // Webpack 5 file names for assets
  // https://dev.to/smelukov/webpack-5-asset-modules-2o3h
  config.output['assetModuleFilename'] = 'assets/[hash][ext]'

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
    },
    {
      // Webpack 5 SVG loader
      // Answer: https://stackoverflow.com/questions/44695560/how-can-i-import-a-svg-file-to-a-vue-component/67174666#67174666
      // https://webpack.js.org/guides/asset-modules/
      // https://dev.to/smelukov/webpack-5-asset-modules-2o3h
      test: /\.svg$/,
      type: 'asset',
      use: 'svgo-loader',
    }
  )

  config.resolve.alias['@'] = PROJECT_ROOT

  // Typescript
  config.resolve.extensions.push('.ts', '.tsx')

  // Return the altered config
  return config
}
