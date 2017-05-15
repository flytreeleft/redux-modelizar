import isArray from 'lodash/isArray';

import guid from '../utils/guid';
import valueOf from '../utils/valueOf';
import isPrimitive from '../utils/isPrimitive';

import {
    OBJECT_CLASS_SENTINEL,
    isRefObj,
    parseRefKey,
    createRefObj,
    createFunctionObj,
    createDateObj,
    createRegExpObj,
    createClassObj
} from './sentinels';

/** Convert Function, Date, RegExp to a plain object. */
function processSrcObj(source) {
    if (source instanceof Function) {
        source = createFunctionObj(source);
    }
    else if (source instanceof Date) {
        source = createDateObj(source);
    }
    else if (source instanceof RegExp) {
        source = createRegExpObj(source);
    }

    return source;
}

function createDstObj(source) {
    var obj = isArray(source) ? new Array(source.length) : createClassObj(source);
    guid(obj, guid(source));

    return obj;
}

const emptyProcessor = (obj) => obj;
/**
 * @param {*} source The source which will be converted to a plain object.
 * @param {Function/Object} [processor=(dst,&nbsp;dstTop,&nbsp;dstTopProp,&nbsp;src,&nbsp;paths)=>dst]
 *          A pre processor for processing the plain object
 *          before assigning other properties.
 *          Or an object which contains pre and post processor.
 * @param {Function} [processor.pre=(dst,&nbsp;dstTop,&nbsp;dstTopProp,&nbsp;src,&nbsp;paths)=>dst]
 *          The pre processor.
 * @param {Function} [processor.post=(dst)=>dst] The post processor
 */
export default function toPlain(source, processor = emptyProcessor) {
    if (isPrimitive(source)) {
        return valueOf(source);
    }
    processor = {
        pre: processor instanceof Function ? processor : processor.pre || emptyProcessor,
        post: processor && processor.post || emptyProcessor
    };

    // NOTE: Recursion will cause heavy performance problem
    // and 'Maximum call stack size' error.
    var root;
    // {[sourceObject]: guid(sourceObjectCopy)}
    var refs = new Map();
    // [[topDstRefObjCount, topDst, topDstProp, pathFromRoot, src]]
    var stack = [-1, undefined, undefined, [], source];
    var src;
    var dst; // Target object for receiving source properties.
    var topDst; // Top object of target object.
    var topDstProp; // Property of top object.
    var pathFromRoot; // Node path from the source root.
    var topDstRefObjCount; // How many objects are referred by top object?
    var excludeKeys = [OBJECT_CLASS_SENTINEL];
    while (stack.length > 0) {
        src = valueOf(stack.pop());
        pathFromRoot = stack.pop();
        topDstProp = stack.pop();
        topDst = stack.pop();
        topDstRefObjCount = stack.pop();

        if (isRefObj(src)) {
            dst = {...src};
        } else {
            var copyId = refs.get(src);
            if (copyId) {
                dst = createRefObj(copyId);
            } else {
                src = processSrcObj(src);
                dst = createDstObj(src);
            }
        }

        // Pre-processor
        dst = processor.pre(dst, topDst, topDstProp, src, pathFromRoot);
        // Pre-processor may return a primitive value.
        if (isRefObj(dst)) {
            refs.set(src, parseRefKey(dst));
        } else if (!isPrimitive(dst)) {
            refs.set(src, guid(dst));
        }

        if (!isRefObj(dst) && !isPrimitive(dst)) {
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
                stack.push(refObjCount++, dst, key, pathFromRoot.concat(key), value);
            });
            // Post-processor for leaf node
            if (refObjCount === 0) {
                dst = processor.post(dst);
            }
        }

        if (topDst === undefined) {
            root = topDst = dst;
        } else {
            topDst[topDstProp] = dst;
        }
        // Post-processor
        if (topDstRefObjCount === 0) {
            topDst = processor.post(topDst);
        }
    }

    return root;
}
