module.exports = {
  // Core Directories
  SRC: 'src/',
  ASSETS: 'src/assets/',
  DIST: 'dist/',
  SHIP: 'ship/',
  TEST: 'test/',

  SERVER: {
    PORT: 8080
  },

  JS_FILES: [
    'js/*.js'
  ],

  // Assets
  ASSETS_FILES: [
    'img/assets/**/*',
    '!img/assets/{js,scss}',
    '!img/assets/{js,scss}/**/*'
  ]

}
