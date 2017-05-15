// https://github.com/shelljs/shelljs
var shell = require('shelljs');
var path = require('path');
var merge = require('lodash/merge');

var projectRoot = path.resolve(__dirname, '../..');
var outputPath = path.resolve(projectRoot, 'dist');

var packageJSON = require(path.resolve(projectRoot, 'package.json'));
var version = packageJSON.version;
var license = packageJSON.license;
var banner = shell.cat(path.resolve(__dirname, 'banner.txt'))
                  .replace(/(\$\{([-_\w.]+)})/g, function ($0, $1, $2) {
                      var data = {
                          version: version,
                          year: new Date().getFullYear(),
                          license: license
                      };
                      return data[$2] !== undefined ? data[$2] : $1;
                  });

var config = {
    banner: banner,
    projectRoot: projectRoot,
    outputPath: outputPath,
    env: {
        VERSION: JSON.stringify(version)
    }
};

switch (process.env.NODE_ENV) {
    case 'testing':
        merge(config, {
            test: true
        });
        break;
}

module.exports = config;
