import {
    getFunctionByName,
    getFunctionName
} from './functions';

export const OBJECT_CLASS_SENTINEL = '__OBJECT_CLASS__';

export const IS_REFERENCE_SENTINEL = '__IS_REFERENCE__';
export const REFERENCE_KEY_SENTINEL = '__REFERENCE_KEY__';
export const IS_FUNCTION_SENTINEL = '__IS_FUNCTION__';
export const IS_DATE_SENTINEL = '__IS_DATE__';
export const IS_REG_EXP_SENTINEL = '__IS_REG_EXP__';

export function createRefObj(id) {
    return {
        [IS_REFERENCE_SENTINEL]: true,
        [REFERENCE_KEY_SENTINEL]: id
    };
}

export function isRefObj(obj) {
    if (!obj) {
        return false;
    }
    return obj[IS_REFERENCE_SENTINEL];
}

export function parseRefKey(obj) {
    return obj[REFERENCE_KEY_SENTINEL];
}

export function createFunctionObj(fn) {
    return {
        [IS_FUNCTION_SENTINEL]: true,
        name: getFunctionName(fn)
    };
}

export function isFunctionObj(obj) {
    if (!obj) {
        return false;
    }
    return obj[IS_FUNCTION_SENTINEL];
}

export function parseFunction(obj) {
    var fnName = obj.name;

    return getFunctionByName(fnName);
}

export function createDateObj(date) {
    return {
        [IS_DATE_SENTINEL]: true,
        time: date.getTime()
    };
}

export function isDateObj(obj) {
    if (!obj) {
        return false;
    }
    return obj[IS_DATE_SENTINEL];
}

export function parseDate(obj) {
    var time = obj.time;

    return new Date(time);
}

export function createRegExpObj(reg) {
    return {
        [IS_REG_EXP_SENTINEL]: true,
        exp: reg.toString()
    };
}

export function isRegExpObj(obj) {
    if (!obj) {
        return false;
    }
    return obj[IS_REG_EXP_SENTINEL];
}

export function parseRegExp(obj) {
    var exp = obj.exp;

    if (typeof exp === 'string' && /^\/.+\/([igm]*)$/.test(exp)) {
        // NOTE: Avoid xss attack
        return new Function(`return ${exp};`)();
    } else {
        return null;
    }
}

export function createClassObj(obj) {
    var clsName;
    if (obj.constructor === Object || obj.constructor === undefined) {
        clsName = obj[OBJECT_CLASS_SENTINEL];
    }
    if (!clsName) {
        clsName = getFunctionName(obj.constructor);
    }

    return {
        [OBJECT_CLASS_SENTINEL]: clsName
    };
}

export function parseObjClass(obj) {
    var name;

    if (OBJECT_CLASS_SENTINEL in obj) {
        name = obj[OBJECT_CLASS_SENTINEL];
        return name ? getFunctionByName(name) : undefined;
    } else {
        return obj && obj.constructor;
    }
}
