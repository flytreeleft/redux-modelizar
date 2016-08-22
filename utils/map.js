import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import forEach from 'lodash/forEach';

import {
    isImmutable
} from './lang';

/**
 * Do map and return new object.
 *
 * NOTE: If no value is changed, the original `obj` will be returned.
 */
export default function map(obj, mapper) {
    if (!obj || !isFunction(mapper)) {
        return obj;
    }

    let changed = false;
    let newObj;
    if (isArray(obj) || isImmutable(obj)) {
        newObj = obj.map((value, key) => {
            var newValue = mapper(value, key);
            !changed && (changed = newValue !== value);

            return newValue;
        });
    } else if (isObject(obj)) {
        newObj = {};
        forEach(obj, (value, key) => {
            var newValue = mapper(value, key);
            !changed && (changed = newValue !== value);

            newObj[key] = newValue;
        });
    }

    return changed ? newObj : obj;
}
