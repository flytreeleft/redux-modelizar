import isFunction from 'lodash/isFunction';

export const OBJECT_HASH_CODE_SENTINEL = '__OBJECT_HASH_CODE__';

var gid = 101010;
/**
 * Get and set (if not exist) hash code.
 */
export function hashCode(obj) {
    var hash = getHashCode(obj);

    if (hash === undefined) {
        hash = gid++;
        setHashCode(obj, hash);
    }
    return hash;
}

export function getHashCode(obj) {
    if (!obj) {
        return 0;
    }
    else if (obj[OBJECT_HASH_CODE_SENTINEL]) {
        return obj[OBJECT_HASH_CODE_SENTINEL];
    }
    else if (isFunction(obj.withMutations)
             && obj.get(OBJECT_HASH_CODE_SENTINEL)) {
        return obj.get(OBJECT_HASH_CODE_SENTINEL);
    }
    else if (isFunction(obj.hashCode)) {
        return obj.hashCode();
    }
}

export function setHashCode(obj, hash) {
    obj && hash && (obj[OBJECT_HASH_CODE_SENTINEL] = hash);

    return obj;
}
