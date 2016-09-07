var gid = 1;
const fnMap = new Map();

export function getFunctionName(fn) {
    var fnName = fnMap.get(fn);

    if (!fnName) {
        fnName = (fn.name || 'Anonymous') + `@${gid++}`;
        fnMap[fnName] = fn;
        fnMap.set(fn, fnName);
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
    if (name && fn instanceof Function) {
        fnMap[name] = fn;
        fnMap.set(fn, name);
    }
}
