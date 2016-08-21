import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';

import {
    isImmutableList,
    isImmutableMap,
    isPrimitive
} from '../utils/lang';
import forEach from '../utils/forEach';
import instance from '../utils/instance';
import {
    hashCode,
    setHashCode
} from '../utils/hashCode';
import {
    getFunctionByName
} from './functions';

import {
    OBJECT_CLASS_SENTINEL,
    isRefObj,
    isFunctionObj,
    isDateObj,
    isRegExpObj,
    isUndoableObj,
    getObjClass
} from './sentinels';

export function realFunction(obj, processor, refs) {
    var fnName = obj.name;

    return getFunctionByName(fnName);
}

export function realDate(obj, processor, refs) {
    var time = obj.time;

    return new Date(time);
}

export function realRegExp(obj, processor, refs) {
    var exp = obj.exp;

    if (isString(exp) && /^\/.+\/([igm]*)$/.test(exp)) {
        // NOTE: Avoid xss attack
        return new Function(`return ${exp};`)();
    } else {
        return null;
    }
}

export function realUndoableState(obj, processor, refs) {
    return toReal(obj.valueOf(), processor, refs);
}

export function realImmutableMap(obj, processor, refs) {
    return realObject(obj, processor, refs, Object);
}

export function realImmutableList(obj, processor, refs) {
    return realArray(obj, processor, refs);
}

export function realArray(obj, processor, refs) {
    var hash = hashCode(obj);
    var ro = [];

    setHashCode(ro, hash);
    refs.set(hash, ro);

    forEach(obj, value => {
        var real = toReal(value, processor, refs);
        ro.push(real);
    });

    return ro;
}

export function realObject(obj, processor, refs, candidateCtor) {
    var Ctor = getObjClass(obj) || candidateCtor;
    if (!Ctor) {
        throw new Error(`No registered Class found for ${obj}.`
                        + 'Please make sure this object is converted by #toPlain(obj).');
    }

    var hash = hashCode(obj);
    var ro = instance(Ctor);

    if (processor && isFunction(processor.pre || processor)) {
        ro = (processor.pre || processor)(ro);
    }
    setHashCode(ro, hash);
    refs.set(hash, ro);

    var excludeProps = [OBJECT_CLASS_SENTINEL,
                        'equals', 'hashCode', 'toJS',
                        'toJSON', 'toObject', 'toArray'];
    forEach(obj, (value, prop) => {
        if (excludeProps.indexOf(prop) < 0) {
            // TODO Ignore the property with `writable==false`
            ro[prop] = toReal(value, processor, refs);
        }
    });

    if (processor && isFunction(processor.post)) {
        ro = processor.post(ro);
    }
    return ro;
}

export default function toReal(obj, processor, refs = new Map()) {
    if (!isObject(obj) || isPrimitive(obj)) {
        return obj;
    }

    if (isArray(obj)) {
        return realArray(obj, processor, refs);
    }
    else if (isUndoableObj(obj)) {
        return realUndoableState(obj, processor, refs);
    }
    else if (isRefObj(obj)) {
        return refs.get(hashCode(obj));
    }
    else if (isFunctionObj(obj)) {
        return realFunction(obj, processor, refs);
    }
    else if (isDateObj(obj)) {
        return realDate(obj, processor, refs);
    }
    else if (isRegExpObj(obj)) {
        return realRegExp(obj, processor, refs);
    }
    else if (isImmutableList(obj)) {
        return realImmutableList(obj, processor, refs);
    }
    else if (isImmutableMap(obj)) {
        return realImmutableMap(obj, processor, refs);
    }
    else {
        return realObject(obj, processor, refs);
    }
}
