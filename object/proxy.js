import isArray from 'lodash/isArray';
import uniq from 'lodash/uniq';

import extend, {getBaseClass} from 'ui-designer/lib/utils/extend';
import {
    classify
} from 'ui-designer/lib/utils/lang';

import forEach from '../utils/forEach';
import instance from '../utils/instance';
import isWritable from '../utils/isWritable';
import map from '../utils/map';
import traverse from '../object/traverse';

import {
    mutateState
} from '../modelizar/actions';

export default function proxy(store, source, deep = true) {
    if (isPrimitive(source) || isProxied(source)) {
        return source;
    } else if (!deep && (isArray(source) || source.constructor === Object)) {
        return map(source, (value) => {
            return proxy(store, value, false);
        });
    }

    // NOTE: Recursion will cause heavy performance problem
    // and 'Maximum call stack size' error.
    var root;
    // {[sourceObject]: proxiedObject}
    var seen = new Map();
    // [topDst, topDstProp, src]
    var stack = [undefined, undefined, source];
    var src;
    var dst; // Target object for receiving source properties.
    var topDst; // Top object of target object.
    var topDstProp; // Property of top object.
    while (stack.length > 0) {
        src = stack.pop();
        topDstProp = stack.pop();
        topDst = stack.pop();

        var isSrcProxied = seen.has(src);
        if (isSrcProxied) {
            dst = seen.get(src);
        } else {
            dst = createObj(src, store);
            seen.set(src, dst);
        }

        if (topDst === undefined) {
            root = topDst = dst;
        } else {
            topDst[topDstProp] = dst;
        }

        if (isSrcProxied) {
            continue;
        }

        Object.keys(src).forEach((key) => {
            if (!isWritable(dst, key)) {
                return;
            }

            var value = src[key];
            if (isPrimitive(value) || !deep) {
                dst[key] = value;
            } else {
                stack.push(dst, key, value);
            }
        });
    }

    return root;
}

export function isProxied(obj) {
    return !!(obj && isProxiedClass(obj.constructor));
}

const PROXIED_CLASS_SENTINEL = '__PROXIED_CLASS__';
export function getProxiedClass(obj) {
    return isProxied(obj) ? obj.constructor[PROXIED_CLASS_SENTINEL] : undefined;
}

function isPrimitive(obj) {
    return !(obj instanceof Object) || isPrimitiveClass(obj.constructor);
}

const primitiveClasses = [Boolean, Number, String, Date, Function, RegExp];
function isPrimitiveClass(cls) {
    return !!(cls && primitiveClasses.indexOf(cls) >= 0);
}

function isProxiedClass(cls) {
    return !!(cls instanceof Function && cls[PROXIED_CLASS_SENTINEL]);
}

function deepClone(obj) {
    var refs = new Map();
    traverse(obj, (obj, top, prop) => {
        var clonedTop = refs.get(top);

        if (isPrimitive(obj) || isProxied(obj)) {
            clonedTop && (clonedTop[prop] = obj);
            return false;
        } else {
            var clonedObj = isArray(obj) ? new Array(obj.length) : new obj.constructor();
            refs.set(obj, clonedObj);

            clonedTop && (clonedTop[prop] = clonedObj);
        }
    });

    return refs.has(obj) ? refs.get(obj) : obj;
}

/**
 * Patch structure:
 * - https://github.com/benjamine/jsondiffpatch/blob/master/docs/deltas.md
 * ```
 * // For Object
 * delta = {
 *   property1: [ newValue1 ], // obj[property1] = newValue1
 *   property2: [ oldValue2, newValue2 ] // obj[property2] = newValue2 (and previous value was oldValue2)
 *   property5: [ oldValue5, 0, 0 ] // delete obj[property5] (and previous value was oldValue5)
 * }
 * // For Array
 * delta = {
 *   _t: 'a', // indicates this applies to an array
 *   '1': [{'name': 'Cordoba'}], // inserted at index 1
 *   '_3': [{'name': 'La Plata'}, 0, 0], // removed '{'name': 'La Plata'}' from index 3
 *   '_4': ['obj', 2, 3] // move 'obj' from index 4 to index 2
 * }
 * ```
 */
function diffObj(leftObj, rightObj) {
    var diff = {};
    var refs = new Map([[rightObj, [leftObj, diff]]]);

    traverse(rightObj, (right, rightTop, prop) => {
        var left;
        var leftTop;
        var delta;
        if (rightTop === undefined) {
            left = refs.get(right)[0];
            delta = refs.get(right)[1];
        } else {
            leftTop = refs.get(rightTop)[0];
            delta = refs.get(rightTop)[1];
            left = leftTop[prop];
        }

        if (right === left) {
            return false;
        }
        if (isPrimitive(right)
            || isPrimitive(left)
            || right.constructor !== left.constructor
            // `right` and `left` are all proxied, and `right` isn't `rightObj`
            || (isProxied(right) && rightTop !== undefined)) {

            if (isArray(rightTop) && isArray(leftTop)) {
                var existingIndex = leftTop.indexOf(right);
                // Move `right` from `existingIndex` to `prop`
                if (existingIndex >= 0) {
                    delta['_' + existingIndex] = [right, parseInt(prop, 10), 3];
                } else {
                    // A new element
                    delta[prop] = [right];
                }
            } else {
                // Change or add a property
                delta[prop] = left === undefined ? [right] : [left, right];
            }
            return false;
        }

        if (rightTop !== undefined) {
            delta = delta[prop] = isArray(right) ? {'_t': 'a'} : {};
        }
        // Removing checking
        forEach(left, (value, prop) => {
            if (isArray(left)) {
                var valueInRightIndex = right.indexOf(value);
                if (valueInRightIndex < 0) {
                    delta['_' + prop] = [value, 0, 0];
                }
            } else if (!(prop in right)) {
                delta[prop] = [value, 0, 0];
            }
        });

        refs.set(right, [left, delta]);
    });

    return diff;
}

const IS_GUARDED_SENTINEL = '__IS_GUARDED__';
/**
 * Add guard for `obj` to receive the state mutations.
 */
function addMutationGuard(obj) {
    var guard = {
        descriptors: {},
        mutations: new obj.constructor() // Like a ghost
    };

    forEach(obj, (value, prop) => {
        if (value instanceof Function) {
            return;
        }

        var des = Object.getOwnPropertyDescriptor(obj, prop);

        guard.descriptors[prop] = des;
        // TODO How to receive new value of the non-configurable but writable property?
        guard.mutations[prop] = deepClone(value);
        if (!des.configurable || !des.writable) {
            return;
        }

        Object.defineProperty(obj, prop, {
            configurable: des.configurable,
            enumerable: des.enumerable,
            get: () => guard.mutations[prop],
            set: val => {
                guard.mutations[prop] = val;
            }
        });
    });

    Object.defineProperty(obj, IS_GUARDED_SENTINEL, {
        configurable: true,
        writable: false,
        enumerable: false,
        value: true
    });

    return guard;
}

function isMutationGuarded(obj) {
    return obj && obj[IS_GUARDED_SENTINEL];
}

/**
 * Remove guard and return the mutations.
 */
function removeMutationGuard(obj, guard) {
    forEach(guard.descriptors, (des, prop) => {
        if (des.configurable) {
            Object.defineProperty(obj, prop, des);
        }
    });

    delete obj[IS_GUARDED_SENTINEL];

    return guard.mutations;
}

const STORE_SENTINEL = '__STORE__';
function bindStore(store, obj) {
    Object.defineProperty(obj, STORE_SENTINEL, {
        configurable: false,
        writable: false,
        enumerable: false,
        value: store
    });
}

function getMethodsUntilBase(cls) {
    var proto = cls.prototype;
    var methods = [];

    while (proto && proto.constructor !== Object) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
        var names = Object.getOwnPropertyNames(proto)
                          .filter(name => proto[name] instanceof Function);
        Array.prototype.push.apply(methods, names);

        proto = Object.getPrototypeOf(proto);
    }

    return uniq(methods).filter(name => {
        return ['constructor', 'override', 'superclass',
                'supr', 'extend'
               ].indexOf(name) < 0;
    });
}

const proxyClassMap = new Map();
export function proxyClass(cls) {
    if (isPrimitiveClass(cls)
        || cls === Object
        || cls === Array
        || isProxiedClass(cls)) {
        return cls;
    }

    var proxyCls = proxyClassMap.get(cls);
    if (!proxyCls) {
        proxyCls = createProxyClass(cls);

        proxyClassMap.set(cls, proxyCls);
    }

    return proxyCls;
}

const PROXY_SUFFIX = '$$ModelizarProxy';
function createProxyClass(cls) {
    if (!cls.name || !getBaseClass(cls).name) {
        throw new Error('Class or it\'s base class can not be anonymous.');
    }

    var proxyClsName = classify(cls.name + PROXY_SUFFIX);
    // Non-argument constructor
    var proxyCls = new Function('base', `return function ${proxyClsName}() {
        arguments.length > 0 && base.apply(this, arguments);
    }`)(cls);

    proxyCls = extend(proxyCls, cls);
    proxyCls[PROXIED_CLASS_SENTINEL] = cls;

    proxyClassMethod(proxyCls, cls);
    proxyClassStatic(proxyCls, cls);

    return proxyCls;
}

function proxyClassMethod(proxyCls, cls) {
    getMethodsUntilBase(cls).forEach(methodName => {
        var callback = cls.prototype[methodName];

        proxyCls.prototype[methodName] = new Function('proxiedMethod', `
            return function ${cls.name}$${methodName}${PROXY_SUFFIX}() {
                return proxiedMethod.apply(this, arguments);
            };
        `)(function proxiedMethod() {
            var ret;

            if (isMutationGuarded(this)) {
                ret = callback.apply(this, arguments);
            } else {
                var mutations = null;
                var guard = null;
                // NOTE: The current scope `this` can not be changed to other,
                // so that, `===` can be used in any method.
                try {
                    guard = addMutationGuard(this);
                    ret = callback.apply(this, arguments);
                } finally {
                    mutations = removeMutationGuard(this, guard);
                }

                var diff = diffObj(this, mutations);
                if (diff && Object.keys(diff).length > 0) {
                    var method = `${cls.name}#${methodName}`;
                    var store = this[STORE_SENTINEL];
                    store.dispatch(mutateState(this, diff, method));
                }
            }
            return ret;
        });
    });
}

function proxyClassStatic(proxyCls, cls) {
    var excludeProps = ['constructor', 'override', 'superclass', 'supr', 'extend'];

    forEach(cls, (value, prop) => {
        if (excludeProps.indexOf(prop) < 0) {
            proxyCls[prop] = value;
        }
    });
}

function createObj(source, store) {
    if (isArray(source)) {
        return new Array(source.length);
    } else if (source.constructor === Object) {
        return {};
    } else {
        var ctor = source.constructor;
        var proxyCls = proxyClass(ctor);
        if (proxyCls === ctor) {
            return source;
        }

        var proxied = instance(proxyCls);
        // NOTE: Binding store to instance, not class for global sharing proxied class.
        store && bindStore(store, proxied);

        return proxied;
    }
}
