import {
    getMethodsUntilBase
} from '../utils/class';

import {
    copyAugment,
    invokeInStoreBatch,
    getBoundMapper,
    isMappingFunction
} from './utils';
import {
    removeSubState
} from './actions';

const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
    var original = arrayProto[method];
    Object.defineProperty(arrayMethods, method, {
        enumerable: false,
        writable: true,
        configurable: true,
        value: function storeMappingBatch() {
            var mapper = getBoundMapper(this);
            var store = mapper.store;
            var state = mapper.state;

            var args = [...arguments];
            var result;
            store.doBatch(() => {
                var origSize = this.length;

                result = original.apply(this, args);
                // Remove redundant elements
                if (this.length < origSize) {
                    for (let i = origSize - 1; i >= this.length; i--) {
                        store.dispatch(removeSubState(state, i));
                    }
                }
                // Map new elements
                else if (this.length > origSize) {
                    for (let i = origSize; i < this.length; i++) {
                        var val = this[i];
                        // Trigger batching addition mutation
                        this[i] = null;
                        mapper.mapping(this, i);
                        this[i] = val;
                    }
                }
            }, {
                method: `Array$${method}`
            });

            var ob = this.__ob__;
            if (ob) {
                var inserted;
                switch (method) {
                    case 'push':
                    case 'unshift':
                        inserted = args;
                        break;
                    case 'splice':
                        inserted = args.slice(2);
                        break;
                }
                if (inserted) {
                    ob.observeArray(inserted);
                }
                ob.dep.notify();
            }

            return result;
        }
    });
});

export function overwriteArray(array) {
    // TODO 改造Vue.js让其支持定义在array对象上的Array方法调用
    return copyAugment(array, arrayMethods);
}

export function overwriteObject(obj) {
    var cls = obj.constructor;
    var methods = getMethodsUntilBase(cls).reduce((result, method) => {
        var fn = obj[method];
        if (!isMappingFunction(fn)) {
            result[method] = invokeInStoreBatch(`${cls.name}$${method}`, fn);
        }

        return result;
    }, {});

    return copyAugment(obj, methods);
}
