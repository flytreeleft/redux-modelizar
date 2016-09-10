import instance from '../utils/instance';
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
    parseObjClass,
    parseRefKey,
    parseFunction,
    parseDate,
    parseRegExp
} from './sentinels';

function createRealObj(source) {
    var ctor = parseObjClass(source);
    if (!ctor) {
        throw new Error(`No registered Class found for ${source}.`
                        + 'Please make sure this object is converted by #toPlain(obj).');
    }

    var ro = instance(ctor);
    guid(ro, guid(source));

    return ro;
}

const emptyProcessor = (obj) => obj;
export default function toReal(source,
                               processor = emptyProcessor,
                               refs = new Map()/*{[guid(sourceObject)]: realObject}*/) {
    if (isPrimitive(source)) {
        return valueOf(source);
    }

    var pre = processor instanceof Function ? processor : processor.pre || emptyProcessor;
    var post = processor && processor.post || emptyProcessor;
    processor = {
        pre: (obj) => {
            obj = pre(obj);
            !isPrimitive(obj) && refs.set(guid(obj), obj);
            return obj;
        },
        post: (obj) => {
            obj = post(obj);
            !isPrimitive(obj) && refs.set(guid(obj), obj);
            return obj;
        }
    };

    // NOTE: Recursion will cause heavy performance problem
    // and 'Maximum call stack size' error.
    var root;
    // [[roTopRefObjCount, roTop, roTopProp, src]]
    var stack = [-1, undefined, undefined, source];
    var src;
    var srcId;
    var ro; // Real object mapping source object.
    var roTop; // Top object of real object.
    var roTopProp; // Property of top object.
    var roTopRefObjCount; // How may objects are referred by top object?
    var excludeKeys = [OBJECT_CLASS_SENTINEL];
    while (stack.length > 0) {
        src = valueOf(stack.pop());
        srcId = guid(src);
        roTopProp = stack.pop();
        roTop = stack.pop();
        roTopRefObjCount = stack.pop();

        var existedRef = refs.has(srcId);
        if (existedRef) {
            ro = refs.get(srcId);
        } else {
            ro = createRealObj(src);
            // Pre-processor
            ro = processor.pre(ro, roTop, roTopProp);
        }

        // Pre-processor may return a primitive value.
        if (!existedRef && !isPrimitive(ro)) {
            var refObjCount = 0;
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
                    stack.push(refObjCount++, ro, key, value);
                }
            });
            // Post-processor for leaf node
            if (refObjCount === 0) {
                ro = processor.post(ro);
            }
        }

        if (roTop === undefined) {
            root = roTop = ro;
        } else {
            roTop[roTopProp] = ro;
        }
        // Post-processor
        if (roTopRefObjCount === 0) {
            roTop = processor.post(roTop);
        }
    }

    return root;
}
