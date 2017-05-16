'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = forEach;
/**
 * Try using the original `forEach` function,
 * if it doesn't exist, then trying traverse
 * every key and value by `Object.keys()`.
 */
function forEach(collection, iteratee) {
    if (!collection || !iteratee || !(collection instanceof Object)) {
        return;
    }

    if (typeof collection.forEach === 'function') {
        collection.forEach(iteratee);
    } else {
        Object.keys(collection).forEach(function (key) {
            var val = collection[key];

            return iteratee(val, key, collection);
        });
    }
}
module.exports = exports['default'];