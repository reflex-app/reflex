module.exports = {
  // Core Directories
  SRC: 'src/',
  DIST: 'dist/',
  SHIP: 'ship/',
  TEST: 'test/',

  SERVER: {
    PORT: 8000
  },

  JS_FILES: [
    'js/*.js'
  ],

  // Assets
  ASSETS_FILES: [
    'img/assets/**/*',
    '!img/assets/{js,scss}',
    '!img/assets/{js,scss}/**/*'
  ],

  // Webpack stuff
  RESOLVE_CONFIG: {
    EXTENSIONS: ['.js', '.json'],    //webpck extensions
    ALIAS:{}                          //webpack alias
  }

};
