import isPrimitive from '../utils/isPrimitive';

export const PROP_OBSERVER = '__ob__';

function isObserved(obj) {
    return !isPrimitive(obj) && !!obj[PROP_OBSERVER];
}

export function notify(obj) {
    if (isObserved(obj)) {
        obj[PROP_OBSERVER].dep.notify();
    }
}

export default function (obj) {
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
            || (val.hasOwnProperty(PROP_OBSERVER) && val[PROP_OBSERVER] instanceof Observer)
            || val._isVue) {
            return;
        }

        ob = new Observer(val);
    });
}
