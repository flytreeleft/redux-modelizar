import isPrimitive from '../utils/isPrimitive';

/**
 * Copy properties from `src` to `target` as unenumerable but configurable properties.
 */
export function copyAugment(target, src) {
    var keys = Object.getOwnPropertyNames(src);

    keys.forEach((key) => {
        Object.defineProperty(target, key, {
            enumerable: false,
            configurable: true,
            value: src[key]
        });
    });
    return target;
}

export function invokeInStoreBatch(name, callback) {
    var fn = (new Function(name, `
        return function storeMappingBatch() {
            return ${name}.apply(this, arguments);
        };
    `))(function () {
        var mapper = getBoundMapper(this);
        var store = mapper.store;
        var args = [...arguments];

        return store.doBatch(() => {
            return callback.apply(this, args);
        }, {
            method: name
        });
    });

    return createMappingFunction(fn);
}

const PROP_STATE_MAPPER = '__[STORE_STATE_MAPPER]__';
/**
 * Check if the specified `obj` is mapping a state or not.
 *
 * @return {Boolean} True, if the `obj` is bound to a state,
 *                      and it's mapper is connecting the state
 *                      or is a lazy mapper.
 */
export function isMappingState(obj) {
    var mapper = getBoundMapper(obj);
    return mapper && (mapper.connected || mapper.lazy);
}

export function isBoundState(obj) {
    return !!getBoundMapper(obj);
}

export function getMappedState(obj) {
    var mapper = getBoundMapper(obj);
    return mapper ? mapper.state : null;
}

export function getBoundMapper(obj) {
    return !isPrimitive(obj) ? obj[PROP_STATE_MAPPER] : null;
}

export function bindMapper(obj, mapper) {
    Object.defineProperties(obj, {
        [PROP_STATE_MAPPER]: {
            enumerable: false,
            configurable: false,
            value: mapper
        }
    });
}

const PROP_MAPPING_FUNCTION = '__[STORE_MAPPING_FUNCTION]__';
export function createMappingFunction(callback) {
    callback[PROP_MAPPING_FUNCTION] = true;
    return callback;
}

export function isMappingFunction(callback) {
    return callback instanceof Function && !!callback[PROP_MAPPING_FUNCTION];
}
