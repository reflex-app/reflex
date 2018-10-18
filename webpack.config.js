// Imports
const path = require('path');
// require("babel-register");
// Webpack Configuration
const config = {
    // Entry
    entry: './src/index.js',
    // Output
    output: {
        path: path(__dirname, './dist/js/'),
        filename: 'app.js'
    },
    // Loaders
    module: {
        rules: [
            // JavaScript files
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            // CSS Files
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    // Plugins
    plugins: []
};
// Exports
module.exports = config;