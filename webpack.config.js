const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: ["./src/js/app.js"],
    output: {
        path: __dirname + "/public/js",
        filename: 'app.js'
    },
    devtool: "sourcemap",
    externals: {
        "jquery": "jQuery"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!chart-js)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env']
                    }
                }
            }
        ]
    }
}