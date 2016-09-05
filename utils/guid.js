import isPrimitive from './isPrimitive';

const seed = Math.random() * 1000000000000000 - Date.now();
var gid = Math.floor(seed);
function next() {
    return ('' + gid++)/*.toString(16).replace('.', '')*/;
}

export const GUID_SENTINEL = '__[GLOBAL_UNIQUE_ID]__';

function bind(obj, id) {
    if (isPrimitive(obj)) {
        return obj;
    }

    obj[GUID_SENTINEL] = id;

    return obj;
}

/**
 * Get or bind a global unique id.
 *
 * @param {*} obj
 * @param {String} [id] A custom id which will be bound to `obj`.
 * @return {String} The id which is bound to `obj`.
 *          If `obj` is a primitive object, return itself as id.
 */
export default function guid(obj, id) {
    if (isPrimitive(obj)) {
        return obj;
    }

    var value = obj.valueOf();
    if (!obj[GUID_SENTINEL] || !value[GUID_SENTINEL] || id) {
        bind(obj, id || next());
    }

    return obj[GUID_SENTINEL] || value[GUID_SENTINEL];
}
