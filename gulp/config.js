module.exports = {

  JS_FILES: [
    'js/*.js'
  ],

  JS_DEPS: [
    'node_modules/jquery/dist/jquery.js',
  ],

  // Sass
  SASS_DEPS_FILES: [
    'node_modules/@(sassy-lists)/stylesheets/helpers/_missing-dependencies.scss',
    'node_modules/@(sassy-lists)/stylesheets/helpers/_true.scss',
    'node_modules/@(sassy-lists)/stylesheets/functions/_contain.scss',
    'node_modules/@(sassy-lists)/stylesheets/functions/_purge.scss',
    'node_modules/@(sassy-lists)/stylesheets/functions/_remove.scss',
    'node_modules/@(sassy-lists)/stylesheets/functions/_replace.scss',
    'node_modules/@(sassy-lists)/stylesheets/functions/_to-list.scss'
  ],

  SASS_LINT_FILES: [
    'scss/**/*.scss',
  ],

  // Assets
  ASSETS_FILES: [
    'img/assets/**/*',
    '!img/assets/{js,scss}',
    '!img/assets/{js,scss}/**/*'
  ],

};
