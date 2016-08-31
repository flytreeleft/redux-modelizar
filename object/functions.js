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

// TODO 可注册模型class名称，建立name和function的映射关系，且可在运行中动态注册。从而确保在任何时候均可准确还原到任意点的状态
export function registerFunction(name, fn) {
    if (name && fn instanceof Function) {
        fnMap[name] = fn;
        fnMap.set(fn, name);
    }
}
