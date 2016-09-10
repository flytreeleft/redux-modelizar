import isArray from 'lodash/isArray';

import guid from '../utils/guid';
import isWritable from '../utils/isWritable';
import valueOf from '../utils/valueOf';
import isPrimitive from '../utils/isPrimitive';

import {
    OBJECT_CLASS_SENTINEL,
    isRefObj,
    isFunctionObj,
    isDateObj,
    isRegExpObj,
    parseRefKey,
    parseFunction,
    parseDate,
    parseRegExp
} from './sentinels';
import toReal from './toReal';

export default function diffReal(target,
                                 source,
                                 oldSource,
                                 processor,
                                 refs = new Map()/*{[guid(sourceObject)]: realObject}*/) {
    if (isPrimitive(source)) {
        return valueOf(source);
    } else if (target === source) {
        return target;
    }

    // NOTE: Recursion will cause heavy performance problem
    // and 'Maximum call stack size' error.
    var root;
    // [[roTop, roTopProp, old, src]]
    var stack = [target, undefined, oldSource, source];
    var src;
    var srcId;
    var old;
    var ro; // Real object mapping source object.
    var roId;
    var roTop; // Top object of real object.
    var roTopProp; // Property of top object.
    var excludeKeys = [OBJECT_CLASS_SENTINEL];
    while (stack.length > 0) {
        src = valueOf(stack.pop());
        srcId = guid(src);
        old = valueOf(stack.pop());
        roTopProp = stack.pop();
        roTop = stack.pop();

        if (src === old) {
            continue;
        }

        ro = roTopProp === undefined ? roTop : roTop[roTopProp];
        roId = guid(ro);
        if (isArray(src)) {
            var newRo = new Array(src.length);
            // Sort the same element in old array as order of source
            if (isArray(ro)) {
                var objMap = {};
                ro.forEach((obj) => {
                    var objId = guid(obj);
                    objMap[objId] = obj;
                });
                src.forEach((obj, index) => {
                    var objId = guid(obj);
                    newRo[index] = objMap[objId];
                });
            }
            ro = newRo;
            roId = guid(ro, srcId);
        }

        var realNewOne = roId !== srcId;
        if (realNewOne) {
            ro = toReal(src, processor, refs);
        } else {
            refs.set(srcId, ro);
        }

        if (roTopProp === undefined) {
            root = roTop = ro;
            // Replace target root
            if (roId !== srcId) {
                return root;
            }
        } else {
            roTop[roTopProp] = ro;
        }
        // toReal maybe return a primitive value.
        if (realNewOne || isPrimitive(ro)) {
            continue;
        }
        // Diff merge
        Object.keys(src).forEach((key) => {
            if (excludeKeys.indexOf(key) >= 0 || !isWritable(ro, key)) {
                return;
            }

            var value = valueOf(src[key]);
            if (isPrimitive(value)) {
                ro[key] = value;
            }
            else if (isRefObj(value)) {
                ro[key] = refs.get(parseRefKey(value));
            }
            else if (isFunctionObj(value)) {
                ro[key] = parseFunction(value);
            }
            else if (isDateObj(value)) {
                ro[key] = parseDate(value);
            }
            else if (isRegExpObj(value)) {
                ro[key] = parseRegExp(value);
            }
            else {
                stack.push(ro, key, isPrimitive(old) ? undefined : old[key], value);
            }
        });
    }

    return root;
}
