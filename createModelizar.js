import invariant from 'invariant';

import defaults from 'lodash/defaults';
import isPlainObject from 'lodash/isPlainObject';

import forEach from './utils/forEach';

import modelizar from './modelizar';
import proxy from './object/proxy';
import syncReal from './object/syncReal';
import toPlain from './object/toPlain';
import {
    isImmutableMap
} from './utils/lang';

function validateNextState(nextState, reducerName, action = {}) {
    // eslint-disable-next-line no-undefined
    if (nextState === undefined) {
        throw new Error('Reducer "'
                        + reducerName
                        + '" returned undefined when handling "'
                        + action.type
                        + '" action.'
                        + ' To ignore an action, you must explicitly return the previous state.');
    }

    return null;
}

function doReducers(reducers, action, getter, setter) {
    forEach(reducers, (reducer, reducerName) => {
        var currentState = getter(reducerName);
        var nextState = reducer(currentState, action);

        validateNextState(nextState, reducerName, action);

        setter(reducerName, nextState);
    });
}

export default function createModelizar(options = {}) {
    options = defaults(options, {
        debug: false,
        // Throw error when trying to mutate the properties of model directly.
        strict: false,
        refProps: [],
        // The property name of root state which will be excluded when applying modelizar.
        excludes: []
    });
    options.refProps = [].concat(options.refProps || []);

    // TODO 可注册模型class名称，建立name和function的映射关系，且可在运行中动态注册。从而确保在任何时候均可准确还原到任意点的状态
    // TODO 对于组件库的组件class名称，需通过组件库code与class name组合构成唯一的名称
    // TODO 按照undoable的方式仅拦截指定的reducer，并在处理后，将state转换为model并保存二者之间的关系，在映射回model时，再通过state取model，从而避免重复遍历

    // NOE: Middleware can not access `store.subscribe`
    return {
        combineReducers: function (reducers = {}) {
            forEach(reducers, (reducer, reducerName) => {
                if (options.excludes.indexOf(reducerName) < 0) {
                    reducers[reducerName] = modelizar(reducer, {});
                }
            });

            return (state = {}, action = {}) => {
                invariant(isPlainObject(state) || isImmutableMap(state),
                    'Expect the parameter "state" is Plain Object or Immutable.Map.'
                    + ' But received ' + state);

                action = toPlain(action, options.refProps);

                if (isImmutableMap(state)) {
                    return state.withMutations(tempState => {
                        doReducers(reducers, action,
                            reducerName => tempState.get(reducerName),
                            (reducerName, nextState) => tempState.set(reducerName, nextState));
                    });
                } else if (isPlainObject(state)) {
                    var newState = {};
                    var changed = false;

                    doReducers(reducers, action,
                        reducerName => state[reducerName],
                        (reducerName, nextState) => {
                            newState[reducerName] = nextState;
                            changed = state[reducerName] !== nextState;
                        });
                    return changed ? newState : state;
                }
            };
        },
        bind: function (store, obj, mapping) {
            var currentState;
            store.subscribe(() => {
                var previousState = currentState;
                currentState = store.getState();

                forEach(mapping, (getter, prop) => {
                    var previous = previousState ? getter(previousState) : null;
                    var current = getter(currentState);
                    if (previous === current) {
                        return;
                    }

                    var start = new Date();
                    // NOTE: No need deep proxy, `syncReal` will traverse all deeply.
                    obj[prop] = syncReal(obj[prop], current, obj => proxy(store, obj, false));
                    var end = new Date();
                    console.log('[Modelizar]: sync real %fms.', end.getTime() - start.getTime());
                });
            });
        }
    };
}
