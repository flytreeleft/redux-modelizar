import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';

import {
    hashCode
} from './hashCode';

export function isImmutableMap(obj) {
    return obj && obj['@@__IMMUTABLE_MAP__@@'];
}

export function isImmutableList(obj) {
    return obj && obj['@@__IMMUTABLE_LIST__@@'];
}

export function isImmutable(obj) {
    return obj && isFunction(obj.withMutations);
}

const primitiveClasses = [Boolean, Number, String, Date, Function, RegExp];

export function isPrimitive(obj) {
    return obj && isPrimitiveClass(obj.constructor);
}

export function isPrimitiveClass(cls) {
    return cls && primitiveClasses.indexOf(cls) >= 0;
}

/**
 * Check order:
 * - Reference comparison;
 * - `null` or `undefined`;
 * - `obj.valueOf() === other.valueOf()`?;
 * - `obj.equals(other) === true`?;
 * - Array check and compare every element;
 * - `hashCode(obj) === hashCode(other)`?;
 */
export function is(obj, other) {
    if (obj === other) {
        return true;
    } else if (!obj || !other) {
        return false;
    }

    if (isFunction(obj.valueOf) && isFunction(other.valueOf)
        && obj.valueOf() === other.valueOf()) {
        return true;
    }
    else if (isFunction(obj.equals) && isFunction(other.equals)
             && obj.equals(other)) {
        return true;
    }
    else if (isArray(obj) && isArray(other)
             && obj.length === other.length) {
        var equal = true;

        obj.forEach((value, index) => {
            equal = is(value, other[index]);
            return equal;
        });
        return equal;
    } else {
        return hashCode(obj) === hashCode(other);
    }
}
