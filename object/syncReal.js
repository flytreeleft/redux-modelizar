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

const emptyProcessor = (obj) => obj;
/**
 * @param {*} target The target which receives the real object.
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
export default function syncReal(target,
                                 source,
                                 processor = emptyProcessor,
                                 refs = new Map()/*{[guid(sourceObject)]: realObject}*/) {
    if (isPrimitive(source)) {
        return valueOf(source);
    } else if (target === source) {
        return target;
    }
    processor = {
        pre: processor instanceof Function ? processor : processor.pre || emptyProcessor,
        post: processor && processor.post || emptyProcessor
    };

    // NOTE: Recursion will cause heavy performance problem
    // and 'Maximum call stack size' error.
    var root;
    // [[roTopRefObjCount, roTop, roTopProp, src]]
    var stack = [-1, target, undefined, source];
    var src;
    var srcId;
    var ro; // Real object mapping source object.
    var roId;
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
            ro = processor.pre(ro, roTop, roTopProp, src);
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
        // Post-processor for top node
        if (roTopRefObjCount === 0) {
            roTop = processor.post(roTop);
        }
    }

    return root;
}
