import {
    isPrimitive,
    createNE,
    isArray,
    isDate
} from 'immutable';

import {getMethodsUntilBase} from '../utils/class';
import {
    mutateState,
    removeSubState
} from '../modelizar/actions';

const PROP_STATE_MAPPER = '[[ModelizarMapper]]';
export function reflectProto(obj, mapper) {
    var cls = obj.constructor;
    var methods = {};

    if (isArray(obj)) {
        ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
            var original = obj[method];
            methods[method] = function batchMutate() {
                var mapper = getBoundMapper(this);
                var store = mapper.store;
                var state = mapper.state;

                var args = [...arguments];
                return store.doBatch(() => {
                    var result = original.apply(this, args);
                    var newState = state[method].apply(state, args);
                    store.dispatch(mutateState(state, [], newState));

                    return result;
                }, {
                    method: `Array$${method}`
                });
            };
        });
    } else if (isDate(obj)) {
        Object.getOwnPropertyNames(Date.prototype)
              .filter((method) => method.startsWith('set'))
              .forEach((method) => {
                  var original = obj[method];
                  methods[method] = function batchMutate() {
                      var mapper = getBoundMapper(this);
                      var store = mapper.store;
                      var state = mapper.state;

                      var args = [...arguments];
                      return store.doBatch(() => {
                          var result = original.apply(this, args);
                          store.dispatch(mutateState(state, [], this));

                          return result;
                      }, {
                          method: `Date${method}`
                      });
                  };
              });
    } else {
        methods = getMethodsUntilBase(cls);
        Object.keys(methods).forEach((method) => {
            var original = obj[method];
            methods[method] = function batchMutate() {
                var mapper = getBoundMapper(this);
                var store = mapper.store;
                var args = [...arguments];

                return store.doBatch(() => {
                    return original.apply(this, args);
                }, {
                    method: `${cls.name}$${method}`
                });
            };
        });
        Object.assign(methods, {
            /**
             * @param {String[]/String} prop e.g. `['a', 'b', '1']` or `'a.b[1]'`
             * @param {*} value
             */
            $set: function (prop, value) {
                // Trigger mapper.update() to add new property.
                mapper.store.dispatch(mutateState(obj, prop, value));
            },
            /**
             * @param {String[]/String} prop e.g. `['a', 'b', '1']` or `'a.b[1]'`
             */
            $remove: function (prop) {
                // Trigger mapper.update() to remove property.
                mapper.store.dispatch(removeSubState(obj, prop));
            }
        });
    }

    Object.assign(methods, {
        [PROP_STATE_MAPPER]: mapper
    });

    var proto = Object.create(Object.getPrototypeOf(obj), createNE(methods));
    Object.setPrototypeOf(obj, proto);

    return obj;
}

export function isBoundState(obj) {
    return !!getBoundMapper(obj);
}

export function getBoundMapper(obj) {
    return !isPrimitive(obj) ? obj[PROP_STATE_MAPPER] : null;
}
