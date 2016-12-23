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
    mutateState
} from './actions';

const arrayProto = Array.prototype;
const slice = arrayProto.slice;
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
            return store.doBatch(() => {
                var copy = slice.apply(this);
                var newState = state[method].apply(state, args);
                store.dispatch(mutateState(state, [], newState.valueOf()));

                var result;
                switch (method) {
                    case 'sort':
                    case 'reverse':
                        result = this;
                        break;
                    case 'push':
                    case 'unshift':
                        result = this.length;
                        break;
                    case 'splice':
                        if (args.length > 0) {
                            result = slice.call(this, args[0], args[0] + args[1]);
                        }
                        break;
                    default:
                        result = original.apply(copy, args);
                }
                return result;
            }, {
                method: `Array$${method}`
            });
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
