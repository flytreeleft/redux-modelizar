import {
    applyMiddleware
} from 'redux';

import isArray from 'lodash/isArray';

export default function () {
    var args = [...arguments];

    if (args.length === 1 && isArray(args[0])) {
        args = args[0];
    }

    return applyMiddleware(...args);
}
