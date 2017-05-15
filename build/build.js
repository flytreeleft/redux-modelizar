// https://github.com/shelljs/shelljs
var shell = require('shelljs');
var path = require('path');
var webpack = require('webpack');

process.env.NODE_ENV = 'production';

var webpackConfig = require('./webpack.config');
var config = require('./config');

var __root__ = config.projectRoot;
var outputPath = path.resolve(__root__, 'dist');
shell.rm('-rf', outputPath);
shell.mkdir('-p', outputPath);

webpack(webpackConfig, function (e, stats) {
    if (e) {
        throw e;
    }

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }));
    process.stdout.write('\n');
});
