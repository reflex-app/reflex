const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  core: {
    builder: 'storybook-builder-vite',
  },
  async viteFinal(config, { configType }) {
    // customize the Vite config here
    config.resolve.alias['@'] = path.resolve(__dirname, '../src')

    config.resolve.alias['~reflex/ui'] = path.resolve(
      __dirname,
      '../src/components'
    )

    // return the customized config
    return config
  },
}
