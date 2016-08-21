import isFunction from 'lodash/isFunction';

import isUndoableState from '../undoable/isUndoableState';
import {
    getFunctionByName
} from './functions';

export const OBJECT_CLASS_SENTINEL = '__OBJECT_CLASS__';

export const IS_REFERENCE_SENTINEL = '__IS_REFERENCE__';
export const IS_FUNCTION_SENTINEL = '__IS_FUNCTION__';
export const IS_DATE_SENTINEL = '__IS_DATE__';
export const IS_REG_EXP_SENTINEL = '__IS_REG_EXP__';

export const isUndoableObj = isUndoableState;

export function isRefObj(obj) {
    if (!obj) {
        return false;
    }
    return obj[IS_REFERENCE_SENTINEL]
           || (isFunction(obj.withMutations)
               && obj.get(IS_REFERENCE_SENTINEL));
}

export function isFunctionObj(obj) {
    if (!obj) {
        return false;
    }
    return obj[IS_FUNCTION_SENTINEL]
           || (isFunction(obj.withMutations)
               && obj.get(IS_FUNCTION_SENTINEL));
}

export function isDateObj(obj) {
    if (!obj) {
        return false;
    }
    return obj[IS_DATE_SENTINEL]
           || (isFunction(obj.withMutations)
               && obj.get(IS_DATE_SENTINEL));
}

export function isRegExpObj(obj) {
    if (!obj) {
        return false;
    }
    return obj[IS_REG_EXP_SENTINEL]
           || (isFunction(obj.withMutations)
               && obj.get(IS_REG_EXP_SENTINEL));
}

export function getObjClass(obj) {
    var name;

    if (obj[OBJECT_CLASS_SENTINEL]) {
        name = obj[OBJECT_CLASS_SENTINEL];
    }
    else if (isFunction(obj.withMutations)) {
        name = obj.get(OBJECT_CLASS_SENTINEL);
    }
    return name ? getFunctionByName(name) : undefined;
}
