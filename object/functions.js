import find from 'lodash/find';
import isFunction from 'lodash/isFunction';

var gid = 1;
const fnMap = {};

export function getFunctionName(fn) {
    var fnName = find(Object.keys(fnMap), name => fn === fnMap[name]);

    if (!fnName) {
        fnName = (fn.name || 'Anonymous') + `@${gid++}`;
        fnMap[fnName] = fn;
    }
    return fnName;
}

export function getFunctionByName(fnName) {
    var fn = fnMap[fnName];

    if (!fn) {
        var actualName = fnName.replace(/@\d+$/g, '');
        try {
            fn = (new Function(`return ${actualName};`))();
        } catch (ignore) {
        }
    }
    return fn;
}

export function registerFunction(name, fn) {
    name && isFunction(fn) && (fnMap[name] = fn);
}
