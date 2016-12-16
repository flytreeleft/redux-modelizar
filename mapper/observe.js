import isPrimitive from '../utils/isPrimitive';

export const PROP_OBSERVER = '__ob__';

function isObserved(obj) {
    return !isPrimitive(obj) && obj.hasOwnProperty(PROP_OBSERVER);
}

export function depNotify(obj) {
    if (isObserved(obj)) {
        obj[PROP_OBSERVER].dep.notify();
    }
}

export function observeCheck(obj) {
    if (!isObserved(obj)) {
        return;
    }

    var ob = obj[PROP_OBSERVER];
    var Observer = ob.constructor;
    Object.keys(obj).forEach((key) => {
        var val = obj[key];
        if (val instanceof Function
            || isPrimitive(val)
            || !Object.isExtensible(val)
            || isObserved(val)
            || val._isVue) {
            return;
        }

        ob = new Observer(val);
    });
}
