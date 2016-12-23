import {
    createStore
} from 'redux';

import isBoolean from 'lodash/isBoolean';

import {
    REDUX_MODELIZAR_NAMESPACE
} from './namespace';
import forEach from './utils/forEach';
import guid from './utils/guid';
import isPrimitive from './utils/isPrimitive';
import {
    createState,
    isState
} from './state';
import {
    mapper
} from './mapper/reducer';
import mapState from './mapper/mapState';

export const REDUX_MODELIZAR_MUTATION_BATCH = REDUX_MODELIZAR_NAMESPACE + '/MUTATION_BATCH';

function modelizar(reducer) {
    return function mutation(state, action = {}) {
        if (!isState(state)) {
            state = createState(state);
        }

        switch (action.type) {
            case REDUX_MODELIZAR_MUTATION_BATCH:
                action.actions.forEach((action) => {
                    state = mutation(state, action);
                });
                return state;
            default:
                return reducer(state, action);
        }
    };
}

export default function (reducer, preloadedState, enhancer) {
    var args = [...arguments];
    args[0] = modelizar(mapper(reducer));

    var store = createStore(...args);
    var batching = false;
    var actions = [];
    var {dispatch, getState, subscribe} = store;

    function startBatch() {
        actions = [];
        batching = true;
    }

    function doBatch(meta) {
        var action = {
            type: REDUX_MODELIZAR_MUTATION_BATCH,
            meta,
            actions: [].concat(actions)
        };

        batching = false;
        actions = [];
        // Do mutation even if error happened.
        if (action.actions.length > 0) {
            dispatch(action);
        }
    }

    // NOTE: One state can be mapped to only one object.
    const mappingCache = {};
    const cache = {
        put: (obj) => {
            if (!isPrimitive(obj)) {
                mappingCache[guid(obj)] = obj;
            }
        },
        remove: (obj) => {
            if (!isPrimitive(obj)) {
                delete mappingCache[guid(obj)];
            }
        },
        get: (id) => {
            return mappingCache[id];
        },
        has: (id) => {
            return id in mappingCache;
        },
        cached: (obj) => {
            return !isPrimitive(obj) && cache.has(guid(obj));
        }
    };

    const mutationListeners = {};
    subscribe(() => {
        Object.keys(mutationListeners).map((stateId) => {
            var mutationListener = mutationListeners[stateId];
            return {
                id: stateId,
                state: mutationListener.state,
                path: getState().path(stateId),
                listeners: mutationListener.listeners.slice()
            };
        }).sort((a, b) => {
            // Descending order for triggering listeners from bottom to top.
            return a.path === null || b.path === null
                ? 1
                : b.path.length - a.path.length;
        }).forEach(({id, state, path, listeners}) => {
            var newState = getState().get(path);

            if (!newState.same(state)) {
                mutationListeners[id].state = newState;
                forEach(listeners, (listener) => {
                    listener(newState, state);
                });
            }
            // Remove all listeners if state doesn't exist already.
            if (!path) {
                delete mutationListeners[id];
            }
        });
    });

    return {
        ...store,
        dispatch: (action) => {
            return dispatch(action);
        },
        subscribe: (state, listener) => {
            if (state instanceof Function) {
                listener = state;
                state = getState();
            }
            // NOTE: This way will be faster than subscribing listener for every state.
            var stateId = guid(state.valueOf());
            if (!mutationListeners[stateId]) {
                mutationListeners[stateId] = {
                    state: state,
                    listeners: [listener]
                };
            } else {
                mutationListeners[stateId].listeners.push(listener);
            }

            return () => {
                var listeners = mutationListeners[stateId].listeners;
                var index = listeners.indexOf(listener);
                index >= 0 && listeners.splice(index, 1);
            };
        },
        /**
         * @param {Object} [state] If no specified, map the root state.
         * @param {Boolean} [immutable=true]
         * @return {*} Type depends on `state`.
         */
        mapping: function (state, immutable = true) {
            if (isBoolean(state)) {
                immutable = state;
                state = undefined;
            }

            return mapState({...this, cache}, state, immutable);
        },
        /**
         * @param {Object} target
         * @param {Object} [mapping={}] e.g. `{docs: (state) => state.get('doc')}`
         * @param {Boolean} [immutable=true] Set `true`
         *          if direct assignment mutation is not allowed.
         * @return {Object} `target`
         */
        bind: function (target, mapping = {}, immutable = true) {
            var currentState;
            var bind = () => {
                var previousState = currentState;
                currentState = getState();

                forEach(mapping, (getter, prop) => {
                    var previous = previousState && getter(previousState);
                    var current = currentState && getter(currentState);
                    if (current && current.same(previous)) {
                        return;
                    }

                    if (current) {
                        target[prop] = mapState({...this, cache}, current, target[prop], immutable);
                    } else {
                        target[prop] = current;
                    }
                });

                return bind;
            };
            // Trigger first binding.
            subscribe(bind());

            return target;
        },
        isBatching: () => batching,
        /**
         * @param {Function} batch The scope function to do batching mutations.
         * @param {Object} [meta={}] The extra information of triggering the batch.
         *          e.g. `{method: 'ClassName$methodName'}`
         */
        doBatch: (batch, meta = {}) => {
            if (!(batch instanceof Function)) {
                return;
            } else if (batching) {
                return batch();
            }

            try {
                startBatch();
                return batch();
            } finally {
                // Do mutation even if error happened.
                doBatch(meta);
            }
        }
    };
}
