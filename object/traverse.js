import valueOf from '../utils/valueOf';
import isPrimitive from '../utils/isPrimitive';

import {
    OBJECT_CLASS_SENTINEL
} from './sentinels';

/**
 * @param {*} source
 * @param {Function} walker `(obj, top, path) => true`
 * @return {*} Return `source`.
 */
export default function traverse(source, walker) {
    if (!(walker instanceof Function)) {
        return source;
    }

    // NOTE: Recursion will cause heavy performance problem
    // and 'Maximum call stack size' error.
    // {[sourceObject]: true}
    var refs = new Map();
    // [[top, topProp, paths, srcIndex, src]]
    var stack = [undefined, undefined, [], -1, source];
    var src;
    var srcIndex;
    var paths;
    var top; // Top object of target object.
    var topProp; // Property of top object.
    while (stack.length > 0) {
        src = valueOf(stack.pop());
        srcIndex = stack.pop();
        paths = stack.pop();
        topProp = stack.pop();
        top = stack.pop();
        if (isPrimitive(src)) {
            walker(src, top, topProp, srcIndex, [...paths]);
            continue;
        }

        if (refs.get(src)) {
            var clsName = top[OBJECT_CLASS_SENTINEL] || top.constructor.name;
            throw new Error('Cycle reference detected:'
                            + ` ${clsName}.${topProp} = ${src}`);
        } else {
            refs.set(src, true);
        }

        if (walker(src, top, topProp, srcIndex, [...paths]) === false) {
            continue;
        }

        Object.keys(src).forEach((key, index) => {
            var value = src[key];
            stack.push(src, key, [...paths, key], index, value);
        });
    }

    return source;
}
