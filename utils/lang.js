import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';

export function isImmutableMap(obj) {
    return obj && obj['@@__IMMUTABLE_MAP__@@'];
}

export function isImmutableList(obj) {
    return obj && obj['@@__IMMUTABLE_LIST__@@'];
}

const primitiveClasses = [Boolean, Number, String, Date, Function, RegExp];

export function isPrimitive(obj) {
    return obj && isPrimitiveClass(obj.constructor);
}

export function isPrimitiveClass(cls) {
    return cls && primitiveClasses.indexOf(cls) >= 0;
}

export function equals(obj, other) {
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
        return obj.filter((value, index) => !equals(value, other[index])).length === 0;
    }
    else {
        return false;
    }
}
