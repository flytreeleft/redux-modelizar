var gid = 1;
const fnMap = new Map();

export function getFunctionName(fn) {
    var fnName = fnMap.get(fn);

    if (!fnName && fn !== Object) {
        registerFunction(fn.name, fn);

        fnName = fnMap.get(fn);
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
    if (fn instanceof Function && !fnMap.has(fn)) {
        name = name || 'Anonymous';
        if (fnMap[name] && fnMap[name] !== fn) {
            name = `${name}@${gid++}`;
        }

        fnMap[name] = fn;
        fnMap.set(fn, name);
    }
}
