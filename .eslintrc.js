module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  // extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 'no-multiple-empty-lines': ['error', {
    //   max: 2,
    //   maxEOF: 2,
    //   maxBOF: 2
    // }],
    'no-multiple-empty-lines': 0,
    'space-before-function-paren':0,
    'semi':0,
    'no-new':0,
    'no-unused-vars':0,
    'no-undef':0
  }
}
