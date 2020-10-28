module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'prettier/prettier': 'error',
    'nuxt/no-cjs-in-config': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // stop being annoying about spaces before parameters
    'space-before-function-paren': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow new()
    'no-new': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    eqeqeq: ['error', 'smart'],
  },
}
