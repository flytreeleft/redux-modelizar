import isNullOrUndefined from './isNullOrUndefined';

export default function valueOf(obj) {
    return !isNullOrUndefined(obj) && obj.valueOf ? obj.valueOf() : obj;
}
