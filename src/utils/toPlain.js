import {
    isFunction,
    isObject,
    hasOwn
} from 'immutable-js';

import {
    getFunctionName,
    getFunctionByName
} from './functions';

export const FN_SENTINEL = '[[ModelizarFunction]]';
export const CLASS_SENTINEL = '[[ModelizarClass]]';

export function hasFnSentinel(obj) {
    return !!obj && hasOwn(obj, FN_SENTINEL);
}

export function hasClassSentinel(obj) {
    return !!obj && hasOwn(obj, CLASS_SENTINEL);
}

export function extractFunctionFrom(obj) {
    return !!obj && getFunctionByName(obj[FN_SENTINEL] || obj[CLASS_SENTINEL]);
}

export default function (obj) {
    if (isFunction(obj)) {
        return {
            [FN_SENTINEL]: getFunctionName(obj)
        };
    } else if (isObject(obj)) {
        return Object.assign({
            [CLASS_SENTINEL]: getFunctionName(obj.constructor)
        }, obj);
    } else {
        return obj;
    }
}
