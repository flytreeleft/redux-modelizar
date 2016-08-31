import valueOf from '../utils/valueOf';
import isPrimitive from '../utils/isPrimitive';

import {
    OBJECT_CLASS_SENTINEL
} from './sentinels';

export default function traverse(source, walker) {
    if (!(walker instanceof Function)) {
        return source;
    }

    // NOTE: Recursion will cause heavy performance problem
    // and 'Maximum call stack size' error.
    // {[sourceObject]: guid(sourceObjectCopy)}
    var refs = new Map();
    // [topDst, topDstProp, src]
    var stack = [undefined, undefined, source];
    var src;
    var dst; // Target object for receiving source properties.
    var top; // Top object of target object.
    var topProp; // Property of top object.
    while (stack.length > 0) {
        src = valueOf(stack.pop());
        topProp = stack.pop();
        top = stack.pop();
        if (isPrimitive(src)) {
            walker(src, top, topProp);
            continue;
        }

        if (refs.get(src)) {
            var clsName = top[OBJECT_CLASS_SENTINEL] || top.constructor.name;
            throw new Error('Cycle reference detected:'
                            + ` ${clsName}.${topProp} = ${src}`);
        } else {
            refs.set(src, true);
        }
        walker(src, top, topProp);

        Object.keys(src).forEach((key) => {
            var value = src[key];
            stack.push(dst, key, value);
        });
    }

    return source;
}
