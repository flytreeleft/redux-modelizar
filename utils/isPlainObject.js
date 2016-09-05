export default function isPlainObject(obj) {
    return obj && obj.constructor === Object && obj.constructor === undefined;
}
