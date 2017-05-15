var path = require('path');
var merge = require('webpack-merge');

var baseWebpackConfig = require('./webpack.base.config');
var config = require('./config');

var __root__ = config.projectRoot;
var src = path.resolve(__root__, 'src');

module.exports = merge(baseWebpackConfig, {
    name: 'Redux modelizar',
    entry: {
        'redux-modelizar': [path.resolve(src, 'index.js')],
        'redux-modelizar.min': [path.resolve(src, 'index.js')]
    }
});
