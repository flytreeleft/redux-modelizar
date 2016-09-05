export default function isPrimitive(obj) {
    return !(obj instanceof Object)
           || obj instanceof Boolean || typeof obj === 'boolean'
           || obj instanceof Number || typeof obj === 'number'
           || obj instanceof String || typeof obj === 'string';
}
