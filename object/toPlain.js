import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import isDate from 'lodash/isDate';
import isFunction from 'lodash/isFunction';
import isRegExp from 'lodash/isRegExp';

import {
    isImmutableList,
    isImmutableMap
} from '../utils/lang';
import forEach from '../utils/forEach';
import {
    OBJECT_HASH_CODE_SENTINEL,
    hashCode,
    setHashCode
} from '../utils/hashCode';
import {
    getFunctionName
} from './functions';

import {
    OBJECT_CLASS_SENTINEL,
    IS_REFERENCE_SENTINEL,
    IS_FUNCTION_SENTINEL,
    IS_DATE_SENTINEL,
    IS_REG_EXP_SENTINEL
} from './sentinels';

function createRefObj(hash) {
    return {
        [IS_REFERENCE_SENTINEL]: true,
        [OBJECT_HASH_CODE_SENTINEL]: hash
    };
}

function createObj(ctor, hash) {
    return {
        [OBJECT_CLASS_SENTINEL]: getFunctionName(ctor),
        [OBJECT_HASH_CODE_SENTINEL]: hash,
        equals: function (other) {
            if (!other) {
                return false;
            } else if (isFunction(other.hashCode)) {
                return this.hashCode() === other.hashCode();
            } else if (!isImmutableMap(other)) {
                return this.hashCode() === hashCode(other);
            }
        },
        hashCode: () => hash
    };
}

/**
 * Check if the `prop` of `obj` is an object reference or not.
 */
function isRefProp(obj, prop, refProps) {
    var props = [prop];
    var proto = obj;
    // Check all inherited class
    while (proto && Object.getPrototypeOf(proto).constructor !== Object) {
        proto = Object.getPrototypeOf(proto);

        var clsName = proto.constructor.name;
        if (clsName) {
            props.push(`${clsName}#${prop}`);
        }
    }

    return props.filter(prop => refProps.indexOf(prop) >= 0).length > 0;
}

function plainRegExp(reg, refProps, refs) {
    return {
        [IS_REG_EXP_SENTINEL]: true,
        exp: reg.toString(),
        valueOf: function () {
            return this.exp;
        }
    };
}

function plainDate(date, refProps, refs) {
    return {
        [IS_DATE_SENTINEL]: true,
        time: date.getTime(),
        valueOf: function () {
            return this.time;
        }
    };
}

function plainFunction(fn, refProps, refs) {
    return {
        [IS_FUNCTION_SENTINEL]: true,
        name: getFunctionName(fn),
        valueOf: function () {
            return this.name;
        }
    };
}

function plainImmutable(obj, refProps, refs) {
    return obj.map(value => toPlain(value, refProps, refs));
}

function plainArray(array, refProps, refs) {
    var hash = refs.get(array);
    var newArray = array.map(value => toPlain(value, refProps, refs));

    setHashCode(newArray, hash);

    return newArray;
}

function plainObject(obj, refProps, refs) {
    var excludeProps = [OBJECT_HASH_CODE_SENTINEL,
                        OBJECT_CLASS_SENTINEL,
                        'equals', 'hashCode', 'toJS',
                        'toJSON', 'toObject', 'toArray'];
    var objHash = refs.get(obj);
    var po = createObj(obj.constructor, objHash);

    forEach(obj, (value, prop) => {
        if (excludeProps.indexOf(prop) >= 0) {
            return;
        }

        if (isObject(value) && isRefProp(obj, prop, refProps)) {
            let valueHash = hashCode(value);
            po[prop] = createRefObj(valueHash);
        } else {
            po[prop] = toPlain(value, refProps, refs);
        }
    });

    return po;
}

/**
 * @param {*} [obj]
 * @param {String[]} [refProps] Like: `parent`, `Link#prev`, `Stack#next`
 */
export default function toPlain(obj, refProps = [], refs = new Map()) {
    if (!isObject(obj)) {
        return obj;
    }

    if ([null, undefined].indexOf(refs.get(obj)) < 0) {
        throw new Error('Cycle reference is detected,'
                        + ' please add it to "refProps": '
                        + obj);
    } else {
        refs.set(obj, hashCode(obj));
    }

    if (isArray(obj)) {
        return plainArray(obj, refProps, refs);
    }
    else if (isImmutableList(obj) || isImmutableMap(obj)) {
        return plainImmutable(obj, refProps, refs);
    }
    else if (isFunction(obj)) {
        return plainFunction(obj, refProps, refs);
    }
    else if (isDate(obj)) {
        return plainDate(obj, refProps, refs);
    }
    else if (isRegExp(obj)) {
        return plainRegExp(obj, refProps, refs);
    }
    else {
        return plainObject(obj, refProps, refs);
    }
}
