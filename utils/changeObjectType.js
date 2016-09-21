import isPrimitive from './isPrimitive';

/**
 * @param {*} obj The object whose prototype will be changed.
 * @param {Function} ctor The constructor function of a new class.
 * @return {*} `obj`
 */
export default function changeObjectType(obj, ctor) {
    if (!isPrimitive(obj)
        && ctor instanceof Function
        && obj.constructor !== ctor) {
        Object.setPrototypeOf(obj, ctor.prototype);
    }
    return obj;
}
