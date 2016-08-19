import {
    OBJECT_HASH_CODE_SENTINEL,
    hash
} from './Hash';
import {
    isImmutable
} from './lang';

export {
    OBJECT_HASH_CODE_SENTINEL
} from './Hash';

/**
 * Get and bind (if not exist) hash code.
 */
export function hashCode(obj) {
    if (isImmutable(obj)) {
        var code = obj.get(OBJECT_HASH_CODE_SENTINEL);

        if (code !== null || code !== undefined) {
            return code;
        }
    }
    return hash(obj);
}

export function setHashCode(obj, hash) {
    if (obj instanceof Object && hash) {
        obj[OBJECT_HASH_CODE_SENTINEL] = hash;
    }
    return obj;
}
