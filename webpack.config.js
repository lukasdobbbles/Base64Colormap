const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './dist/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'webpack.bundle.js'
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()]
    },
    resolve: {
        alias: {
            'node_modules': path.join(__dirname, 'node_modules'),
        },
    }
};