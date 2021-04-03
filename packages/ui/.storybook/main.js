module.exports = {
  stories: ['../stories/**/*.stories.@(ts|js|mdx)'],
  addons: [
    '@storybook/addon-essentials, @storybook/addon-docs, @storybook/addon-postcss',
  ],
  core: {
    builder: 'webpack4',
  },
}
