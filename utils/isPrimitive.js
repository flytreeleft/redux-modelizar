export default function isPrimitive(obj) {
    return !(obj instanceof Object)
           || [Boolean, Number, String].indexOf(Object.getPrototypeOf(obj)) >= 0;
}
