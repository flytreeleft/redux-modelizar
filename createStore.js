import {
    createStore
} from 'redux';

import isBoolean from 'lodash/isBoolean';

import {
    REDUX_MODELIZAR_NAMESPACE
} from './namespace';
import forEach from './utils/forEach';
import {
    createState,
    isState
} from './state';
import {
    mapper
} from './mapper/reducer';
import mapState from './mapper/mapState';

export const REDUX_MODELIZAR_BATCH = REDUX_MODELIZAR_NAMESPACE + '/BATCH';

function modelizar(reducer) {
    return function mutation(state, action = {}) {
        if (!isState(state)) {
            state = createState(state);
        }

        switch (action.type) {
            case REDUX_MODELIZAR_BATCH:
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
            type: REDUX_MODELIZAR_BATCH,
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

    return {
        ...store,
        dispatch: (action) => {
            if (batching) {
                actions.push(action);
                return action;
            } else {
                return dispatch(action);
            }
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

            return mapState({...this}, state, immutable);
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
                        target[prop] = mapState({...this}, current, target[prop], immutable);
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
