import isArray from 'lodash/isArray';

import isPrimitive from '../utils/isPrimitive';
import {
    isClass
} from '../utils/class';
import guid, {GUID_SENTINEL} from '../utils/guid';

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
    if (isClass(callback)) {
        return callback;
    }

    return createMappingFunction(function storeMappingBatch() {
        var mapper = getBoundMapper(this);
        var store = mapper.store;
        var args = [...arguments];

        return store.doBatch(() => {
            return callback.apply(this, args);
        }, {
            method: name
        });
    });
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
    Object.defineProperty(obj, PROP_STATE_MAPPER, {
        enumerable: false,
        configurable: false,
        value: mapper
    });

    // Record global unique id.
    Object.defineProperty(obj, GUID_SENTINEL, {
        enumerable: false,
        configurable: false,
        get: () => guid(mapper.state.valueOf()),
        set: (v) => v
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

export function shallowEqual(obj, other) {
    if (isArray(obj) && isArray(other)) {
        if (obj.length === other.length) {
            for (var i = 0, len = obj.length; i < len; i++) {
                if (obj[i] !== other[i]) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }
    return obj === other;
}
