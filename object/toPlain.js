import isArray from 'lodash/isArray';

import guid from '../utils/guid';
import valueOf from '../utils/valueOf';
import isPrimitive from '../utils/isPrimitive';

import {
    OBJECT_CLASS_SENTINEL,
    isRefObj,
    createRefObj,
    createFunctionObj,
    createDateObj,
    createRegExpObj,
    createClassObj
} from './sentinels';

/**
 * NOTE: 仅处理自上而下存在的循环引用
 *
 * TODO 如何避免对已Plain的Object再次Plain？
 *
 * @param {*} [source]
 * @param {Function/Object} [processor]
 * @param {Function} [processor.pre] The pre-processor
 * @param {Function} [processor.post] The post-processor
 */
export default function toPlain(source, processor = (obj) => obj) {
    if (isPrimitive(source)) {
        return valueOf(source);
    }

    // NOTE: Recursion will cause heavy performance problem
    // and 'Maximum call stack size' error.
    var root;
    // {[sourceObject]: guid(sourceObjectCopy)}
    var refs = new Map();
    // [topDstRefObjCount, topDst, topDstProp, src]
    var stack = [-1, undefined, undefined, source];
    var src;
    var srcId;
    var dst; // Target object for receiving source properties.
    var topDst; // Top object of target object.
    var topDstProp; // Property of top object.
    var topDstRefObjCount; // How many objects are referred by top object?
    var excludeKeys = [OBJECT_CLASS_SENTINEL];
    while (stack.length > 0) {
        src = valueOf(stack.pop());
        srcId = guid(src);
        topDstProp = stack.pop();
        topDst = stack.pop();
        topDstRefObjCount = stack.pop();

        if ([null, undefined].indexOf(refs.get(src)) < 0) {
            throw new Error('Cycle reference detected:'
                            + ` ${topDst[OBJECT_CLASS_SENTINEL]}.${topDstProp} = ${src}`);
        }

        dst = isArray(src) ? new Array(src.length) : createClassObj(src);
        refs.set(src, guid(dst, srcId));

        // Pre-processor
        if (processor && (processor.pre || processor) instanceof Function) {
            dst = (processor.pre || processor)(dst, topDst, topDstProp);
        }
        if (topDst === undefined) {
            root = topDst = dst;
        } else {
            topDst[topDstProp] = dst;
        }
        // Post-processor
        if (topDstRefObjCount === 0 && processor && processor.post instanceof Function) {
            topDst = processor.post(topDst);
        }
        // Pre-processor may return a primitive value.
        if (isRefObj(dst) || isPrimitive(dst)) {
            continue;
        }

        var refObjCount = 0;
        Object.keys(src).forEach((key) => {
            if (excludeKeys.indexOf(key) >= 0) {
                return;
            }

            var value = valueOf(src[key]);
            if (isPrimitive(value)) {
                dst[key] = value;
                return;
            }

            var valueId = refs.get(value);
            if (valueId) {
                value = createRefObj(valueId);
            }
            else if (value instanceof Function) {
                value = createFunctionObj(value);
            }
            else if (value instanceof Date) {
                value = createDateObj(value);
            }
            else if (value instanceof RegExp) {
                value = createRegExpObj(value);
            }
            stack.push(refObjCount++, dst, key, value);
        });
    }

    return root;
}
