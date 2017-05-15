import {
    compose
} from 'redux';

import {isArray} from 'immutable-js';

/**
 * Override `compose` of `redux` to support to pass array argument.
 */
export default function () {
    var args = [...arguments];

    if (args.length === 1 && isArray(args[0])) {
        args = args[0];
    }

    return compose(...args);
}
