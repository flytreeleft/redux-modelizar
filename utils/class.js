import uniq from 'lodash/uniq';

export function getMethodsUntilBase(cls) {
    var proto = cls.prototype;
    var methods = [];

    while (proto && proto.constructor !== Object) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
        var names = Object.getOwnPropertyNames(proto)
                          .filter(name => proto[name] instanceof Function);
        Array.prototype.push.apply(methods, names);

        proto = Object.getPrototypeOf(proto);
    }

    return uniq(methods).filter(name => {
        return ['constructor', 'override', 'superclass',
                'supr', 'extend'
               ].indexOf(name) < 0;
    });
}
