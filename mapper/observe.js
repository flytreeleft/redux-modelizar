import isPrimitive from '../utils/isPrimitive';

export const PROP_OBSERVER = '__ob__';

export function isObserved(obj) {
    return !isPrimitive(obj) && obj.hasOwnProperty(PROP_OBSERVER);
}

export function observeCheck(obj) {
    if (isObserved(obj)) {
        var ob = obj[PROP_OBSERVER];
        var items = Object.keys(obj).map((key) => {
            return obj[key];
        });

        ob.observeArray(items);
    }
    return obj;
}

export function notifyDep(obj) {
    if (isObserved(obj)) {
        observeCheck(obj);

        var ob = obj[PROP_OBSERVER];
        ob.dep.notify();
    }
    return obj;
}
