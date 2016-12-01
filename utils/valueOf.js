import isNullOrUndefined from './isNullOrUndefined';

export default function valueOf(obj) {
    return !isNullOrUndefined(obj)
           && !(obj instanceof Date)
           && obj.valueOf instanceof Function
        ? obj.valueOf()
        : obj;
}
