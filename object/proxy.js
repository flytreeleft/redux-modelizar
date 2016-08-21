import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isPlainObject from 'lodash/isPlainObject';
import isEqualWith from 'lodash/isEqualWith';
import uniq from 'lodash/uniq';

import extend, {getBaseClass} from 'lib.utils.extend';
import {
    classify,
    kebabCase,
    readonly
} from 'lib.utils.lang';

import forEach from '../utils/forEach';
import instance from '../utils/instance';

import {
    mutateState
} from '../modelizar/actions';
import {
    isPrimitive,
    isPrimitiveClass
} from '../utils/lang';

const PROXY_CLASS_SUFFIX = '$$ModelizarProxy';
const IS_PROXIED_CLASS_SENTINEL = '__IS_PROXIED_CLASS__';
const proxyClassMap = new Map();

function isProxied(obj) {
    return obj && isProxiedClass(obj.constructor);
}

function isProxiedClass(cls) {
    return isFunction(cls) && cls[IS_PROXIED_CLASS_SENTINEL];
}

function deepEqual(obj, other) {
    return isEqualWith(obj, other, (objVal, otherVal) => {
        // Stop comparison when any one is proxied,
        // because proxied's mutation should be dispatched by itself.
        if (isProxied(objVal) || isProxied(otherVal)) {
            return objVal === otherVal;
        }
        // NOTE: Return undefined will continue to compare by `===` deeply.
    });
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

    // TODO 在Vue.js中以下方式可能会存在问题
    forEach(obj, (value, prop) => {
        if (isFunction(value)) {
            return;
        }

        var des = Object.getOwnPropertyDescriptor(obj, prop);

        guard.descriptors[prop] = des;
        // TODO How to receive new value of the non-configurable but writable property?
        // TODO 深度克隆Array和未被代理的Object。注意对循环引用的处理！！
        // TODO 不允许其他Object引用本Object内的数据并作引用相等比较！！
        guard.mutations[prop] = value;
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
        var names = Object.getOwnPropertyNames(proto).filter(name => isFunction(proto[name]));
        Array.prototype.push.apply(methods, names);

        proto = Object.getPrototypeOf(proto);
    }

    return uniq(methods).filter(name => {
        return ['constructor', 'override', 'superclass', 'supr', 'extend'].indexOf(name) < 0;
    });
}

function proxyClass(cls) {
    if (isPrimitiveClass(cls)
        || [Object, Array].indexOf(cls) >= 0
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

function createProxyClass(cls) {
    if (!cls.name || !getBaseClass(cls).name) {
        throw new Error('Class or it\'s base class can not be anonymous.');
    }

    var proxyClsName = classify(cls.name + PROXY_CLASS_SUFFIX);
    // No-argument constructor
    var proxyCls = new Function(`return function ${proxyClsName}() {}`)();

    proxyCls = extend(proxyCls, cls);
    proxyCls[IS_PROXIED_CLASS_SENTINEL] = true;

    proxyClassMethod(proxyCls, cls);
    proxyClassStatic(proxyCls, cls);

    return proxyCls;
}

function proxyClassMethod(proxyCls, cls) {
    // TODO 代理属性的setter接口，仅在开关开启时允许修改（即backup/recover时），其余情况抛异常
    getMethodsUntilBase(cls).forEach(methodName => {
        var callback = cls.prototype[methodName];

        proxyCls.prototype[methodName] = function proxiedByModelizar() {
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

                if (!deepEqual(this, mutations)) {
                    var method = `${cls.name}#${methodName}`;
                    var store = this[STORE_SENTINEL];
                    store.dispatch(mutateState(mutations, method));
                }
            }
            return ret;
        };
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

function proxyMerge(store, target, source, deep, depth, seen) {
    seen.set(source, target);

    forEach(source, (value, prop) => {
        // TODO 忽略`target`的只读属性
        target[prop] = proxy(store, value, deep, depth, seen);
    });
    return target;
}

function proxyArray(store, obj, deep, depth, seen) {
    // NOTE: When proxy array elements,
    // the `depth` should always be kept the same value
    // until to proxy an object.
    return obj.map(value => proxy(store, value, deep, depth, seen));
}

function proxyPlainObject(store, obj, deep, depth, seen) {
    // NOTE: Plain object may contains other object instance.
    return proxyMerge(store, {}, obj, deep, depth + 1, seen);
}

function proxyObject(store, obj, deep, depth, seen) {
    var ctor = obj.constructor;
    var proxyCls = proxyClass(ctor);
    if (proxyCls === ctor) {
        return obj;
    }

    var proxied = instance(proxyCls);
    // NOTE: Binding store to instance, not class for global sharing proxied class.
    bindStore(store, proxied);
    // TODO Proxy the owned methods of `obj`? Maybe we should make sure the owned method invoking prototype's methods.
    return proxyMerge(store, proxied, obj, deep, depth + 1, seen);
}

export default function proxy(store, obj, deep = true, depth = 0, seen = new Map()) {
    if (!isObject(obj)
        || isPrimitive(obj)
        || isProxied(obj)
        || (!deep && depth > 0)) {
        return obj;
    }

    var proxied = seen.get(obj);
    if (proxied) {
        return proxied;
    }

    if (isArray(obj)) {
        return proxyArray(store, obj, deep, depth, seen);
    } else if (isPlainObject(obj)) {
        return proxyPlainObject(store, obj, deep, depth, seen);
    } else {
        return proxyObject(store, obj, deep, depth, seen);
    }
}
