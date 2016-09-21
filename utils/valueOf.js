import isNullOrUndefined from './isNullOrUndefined';

export default function valueOf(obj) {
    return !isNullOrUndefined(obj)
           && !(obj instanceof Date)
           && obj.valueOf
        ? obj.valueOf()
        : obj;
}
