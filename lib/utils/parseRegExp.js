'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (exp) {
    if (typeof exp === 'string' && /^\/.+\/([igm]*)$/.test(exp)) {
        // NOTE: Avoid xss attack
        return new Function('return ' + exp + ';')();
    } else {
        return null;
    }
};

module.exports = exports['default'];