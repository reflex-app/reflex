// module.exports = {
//   root: true,
//   parserOptions: {
//     parser: 'babel-eslint',
//     sourceType: 'module'
//   },
//   env: {
//     browser: true,
//     node: true,
//     jest: true
//   },
//   extends: [
//     'standard',
//     'plugin:vue/recommended',
//     'plugin:vue/base'
//   ],
//   globals: {
//     __static: true
//   },
//   plugins: [
//     'vue'
//   ],
//   'rules': {
//     // allow paren-less arrow functions
//     'arrow-parens': 0,
//     // stop being annoying about spaces before parameters
//     'space-before-function-paren': 0,
//     // allow async-await
//     'generator-star-spacing': 0,
//     // allow new()
//     'no-new': 0,
//     // allow debugger during development
//     'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
//   }
// }



module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
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
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
