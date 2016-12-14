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

export function createRealObj(source) {
    var ctor = parseObjClass(source);
    if (!ctor) {
        throw new Error(`No registered Class found for ${source}.`
                        + 'Please make sure this object is converted by #toPlain(obj).');
    }

    return instance(ctor);
}

const emptyProcessor = (obj) => obj;
/**
 * @param {*} source The source which will be converted to real object.
 * @param {Function/Object} [processor=(ro,&nbsp;roTop,&nbsp;roTopProp,&nbsp;src)=>ro]
 *          A pre processor for processing the real instance
 *          before assigning real properties.
 *          Or an object which contains pre and post processor.
 * @param {Function} [processor.pre=(ro,&nbsp;roTop,&nbsp;roTopProp,&nbsp;src)=>ro]
 *          The pre processor.
 * @param {Function} [processor.post=(ro)=>ro] The post processor.
 * @param {Map} [refs=new&nbsp;Map()] The `&lt;sourceObjectGUID, realObject&gt;` map.
 */
export default function toReal(source,
                               processor = emptyProcessor,
                               refs = new Map()/*{[guid(sourceObject)]: realObject}*/) {
    if (isPrimitive(source)) {
        return valueOf(source);
    }

    var pre = processor instanceof Function ? processor : processor.pre || emptyProcessor;
    var post = processor && processor.post || emptyProcessor;
    processor = {
        pre: (ro, roTop, roTopProp, src) => {
            ro = pre(ro, roTop, roTopProp, src);
            !isPrimitive(ro) && refs.set(guid(ro), ro);
            return ro;
        },
        post: (ro) => {
            ro = post(ro);
            !isPrimitive(ro) && refs.set(guid(ro), ro);
            return ro;
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

        var existingRef = refs.has(srcId);
        if (existingRef) {
            ro = refs.get(srcId);
        } else {
            ro = createRealObj(src);
            guid(ro, srcId);
            // Pre-processor
            ro = processor.pre(ro, roTop, roTopProp, src);
        }

        // Pre-processor may return a primitive value.
        if (!existingRef && !isPrimitive(ro)) {
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
        // Post-processor for top node
        if (roTopRefObjCount === 0) {
            roTop = processor.post(roTop);
        }
    }

    return root;
}
