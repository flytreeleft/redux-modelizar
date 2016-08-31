import isArray from 'lodash/isArray';

import isPrimitive from './isPrimitive';

/**
 * Do map and return new object.
 *
 * NOTE: If no value is changed, the original `obj` will be returned.
 */
export default function map(obj, mapper) {
    if (isPrimitive(obj) || !(mapper instanceof Function)) {
        return obj;
    }

    let changed = false;
    let newObj;
    if (isArray(obj)) {
        newObj = obj.map((value, key) => {
            var newValue = mapper(value, key);
            !changed && (changed = newValue !== value);

            return newValue;
        });
    } else {
        newObj = {};

        Object.keys(obj).forEach((key) => {
            var value = obj[key];
            var newValue = mapper(value, key);

            !changed && (changed = newValue !== value);

            newObj[key] = newValue;
        });
    }

    return changed ? newObj : obj;
}
