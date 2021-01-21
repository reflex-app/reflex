const path = require("path");
const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// "@babel/plugin-transform-runtime": "^7.12.10",

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: [
      // "regenerator-runtime/runtime", // https://github.com/facebook/regenerator/tree/master/packages/regenerator-runtime
      "./src/index.js",
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules)/,
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    node: "12",
                  },
                },
              ],
            ],
            plugins: [
              // https://babeljs.io/docs/en/babel-plugin-transform-classes.html
              [
                "@babel/plugin-transform-classes",
                {
                  loose: false,
                },
              ],
              // Transform Class decorators https://babeljs.io/docs/en/babel-plugin-proposal-decorators
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              // Transform Class properties https://babeljs.io/docs/en/babel-plugin-proposal-class-properties
              ["@babel/plugin-proposal-class-properties", { loose: true }],
            ],
          },
        },
      ],
    },
    plugins: [
      // Copy browsers.json to dist/
      new CopyPlugin({
        patterns: [{ from: "./src/browsers.json", to: "./" }], // dist/
      }),
      new NodePolyfillPlugin(), // Polyfill
      // Inject an environment variable
      // For Playwright!
      new webpack.EnvironmentPlugin({
        PLAYWRIGHT_BROWSERS_PATH: "0",
      }),
      // Runtime
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      // [
      //   "@babel/plugin-transform-runtime",
      //   {
      //     absoluteRuntime: false,
      //     corejs: false,
      //     helpers: true,
      //     regenerator: true,
      //     useESModules: false,
      //     version: "7.0.0-beta.0",
      //   },
      // ],
    ],
    optimization: {
      minimize: isProduction ? true : false, // Minimize only for production builds
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            // keep_fnames: true, // Prevent too much mangling (https://github.com/puppeteer/puppeteer/issues/2245#issuecomment-410735923)
          },
        }),
      ],
    },
    resolve: {
      extensions: ["*", ".js", ".jsx"],
    },
    // What should be included in the bundle and what is required externally?
    // We expect Playwright to be inclueded in the parent project
    // https://webpack.js.org/configuration/externals/#object
    // externals: require("webpack-node-externals")(),
    externals: {
      "playwright-core": "playwright-core",
      bufferutil: "bufferutil", // Avoid error message (https://github.com/websockets/ws/issues/1126#issuecomment-631605589)
      "utf-8-validate": "utf-8-validate", // Avoid error message (https://github.com/websockets/ws/issues/1126#issuecomment-631605589)
    },
    // externals: nodeExternals(),
    // const nodeExternals = require("webpack-node-externals"); // https://stackoverflow.com/a/53744505/1114901
    // externals: {
    //   nodeExternals()
    //   // playwright: "playwright-core",
    // },
    // externalsPresets: {
    //   electron: true,
    // },
    // Build for a Node environment https://webpack.js.org/configuration/target/
    target: "node",
    output: {
      // https://stackoverflow.com/a/65452278/1114901
      path: path.resolve(__dirname, "dist/"),
      publicPath: "dist/",
      filename: "[name].js",
      libraryTarget: "umd", // Universal Module (module.export, ES6, AMD)
      library: "electronPlaywrightBrowserInstaller", // Expose the library under this global variable https://webpack.js.org/guides/author-libraries/#expose-the-library
      globalObject: "this",
      // umdNamedDefine: true,
      // libraryExport: "default",
    },
    devtool: "source-map",
    // optimization: {
    //   runtimeChunk: true,
    // },
    // devServer: {
    //   contentBase: path.join(__dirname, "public/"),
    //   port: 3000,
    //   publicPath: "http://localhost:3000/dist/",
    // },
  };
};
