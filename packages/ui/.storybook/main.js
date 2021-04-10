module.exports = {
  stories: ['../stories/**/*.stories.@(ts|js|mdx)'],
  addons: ['@storybook/addon-essentials'],
  core: {
    builder: 'webpack4',
  },
}
