import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';

import {
    isImmutableList,
    isImmutableMap,
    isPrimitive
} from '../utils/lang';
import forEach from '../utils/forEach';
import isWritable from '../utils/isWritable';
import {
    hashCode
} from '../utils/hashCode';

import {
    OBJECT_CLASS_SENTINEL,
    isRefObj,
    isFunctionObj,
    isDateObj,
    isRegExpObj,
    isUndoableObj
} from './sentinels';
import toReal, {
    realFunction,
    realDate,
    realRegExp,
    realObject
} from './toReal';

function syncRegExp(real, source, processor, refs) {
    var src = realRegExp(source, processor, refs);

    return syncReal(real, src, processor, refs);
}

function syncDate(real, source, processor, refs) {
    var src = realDate(source, processor, refs);

    return syncReal(real, src, processor, refs);
}

function syncFunction(real, source, processor, refs) {
    var src = realFunction(source, processor, refs);

    return syncReal(real, src, processor, refs);
}

function syncUndoableState(real, source, processor, refs) {
    var src = source.valueOf();

    return syncReal(real, src, processor, refs);
}

function syncRefObj(real, source, processor, refs) {
    var srcHash = hashCode(source);
    var src = refs.get(srcHash);

    return syncReal(real, src, processor, refs);
}

function syncImmutableMap(real, source, processor, refs) {
    return syncObject(real, source, processor, refs);
}

function syncImmutableList(real, source, processor, refs) {
    return syncArray(real, source, processor, refs);
}

function syncArray(real, source, processor, refs) {
    if (!isArray(real)) {
        real = [];
    }

    var realHash = hashCode(real);
    var srcHash = hashCode(source);

    refs.set(realHash, real);
    if (srcHash !== realHash) {
        refs.set(srcHash, real);
    }

    var temp = [];
    var realMap = real.reduce((map, value) => {
        var hash = hashCode(value);
        map[hash] = value;

        return map;
    }, {});
    source.forEach(srcVal => {
        var srcHash = hashCode(srcVal);
        var realVal = realMap[srcHash];

        var value;
        if (realVal) {
            value = syncReal(realVal, srcVal, processor, refs);
        } else {
            value = toReal(srcVal, processor, refs);
        }
        temp.push(value);
    });

    real.splice(0, real.length);
    temp.forEach(value => real.push(value));

    return real;
}

function syncObject(real, source, processor, refs) {
    var realHash = hashCode(real);
    var srcHash = hashCode(source);

    if (realHash !== srcHash) {
        return realObject(source, processor, refs);
    } else {
        refs.set(srcHash, real);

        var excludeProps = [OBJECT_CLASS_SENTINEL,
                            'equals', 'hashCode', 'toJS',
                            'toJSON', 'toObject', 'toArray'];
        forEach(source, (srcVal, prop) => {
            if (excludeProps.indexOf(prop) >= 0 || !isWritable(source, prop)) {
                return;
            }

            var value = syncReal(real[prop], srcVal, processor, refs);
            if (value !== real[prop]) {
                real[prop] = value;
            }
        });

        return real;
    }
}

// NOTE: Keep the original reference if possible!
export default function syncReal(real, source, processor, refs = new Map()) {
    if (source === null || source === undefined) {
        return source;
    } else if (real === source) {
        return real;
    }

    if (!isObject(source) || isPrimitive(source)) {
        return source;
    }

    if (isArray(source)) {
        return syncArray(real, source, processor, refs);
    }
    else if (isUndoableObj(source)) {
        return syncUndoableState(real, source, processor, refs);
    }
    else if (isRefObj(source)) {
        return syncRefObj(real, source, processor, refs);
    }
    else if (isFunctionObj(source)) {
        return syncFunction(real, source, processor, refs);
    }
    else if (isDateObj(source)) {
        return syncDate(real, source, processor, refs);
    }
    else if (isRegExpObj(source)) {
        return syncRegExp(real, source, processor, refs);
    }
    else if (isImmutableList(source)) {
        return syncImmutableList(real, source, processor, refs);
    }
    else if (isImmutableMap(source)) {
        return syncImmutableMap(real, source, processor, refs);
    }
    else {
        return syncObject(real, source, processor, refs);
    }
}
