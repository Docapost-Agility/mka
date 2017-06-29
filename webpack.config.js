var path = require('path');
var webpack = require('webpack');

const env = require('yargs').argv.env;

let libraryName = 'mka';
let plugins = [];
let buildPath, outputFile;

console.log("Environment : " + env);
if (env === 'prod') {
    
    buildPath = "dist";
    outputFile = libraryName + '.min.js';
} else {
    buildPath = "build";
    outputFile = libraryName + '.js';
}

module.exports = {
    entry: './src/js/main.js',
    output: {
        path: path.resolve(__dirname, buildPath),
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};