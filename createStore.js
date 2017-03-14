import invariant from 'invariant';

import {
    createStore
} from 'redux';

import isBoolean from 'lodash/isBoolean';

import {
    REDUX_MODELIZAR_NAMESPACE
} from './namespace';
import forEach from './utils/forEach';
import Immutable, {
    isFunction,
    isObject
} from '../immutable';
import {
    mapper
} from './mapper/reducer';
import mapState from './mapper/mapState';
import {
    registerFunction,
    getFunctionName
} from './object/functions';

export const REDUX_MODELIZAR_MUTATION_BATCH = REDUX_MODELIZAR_NAMESPACE + '/MUTATION_BATCH';

function modelizar(reducer) {
    var immutableOptions = {
        toPlain: (obj) => {
            if (isFunction(obj)) {
                return {$fn: getFunctionName(obj)};
            } else {
                return Object.assign({$class: getFunctionName(obj.constructor)}, obj);
            }
        }
    };

    return function mutation(state, action = {}) {
        state = Immutable.create(state, immutableOptions);

        switch (action.type) {
            case REDUX_MODELIZAR_MUTATION_BATCH:
                action.actions.forEach((action) => {
                    state = mutation(state, action);
                });
                break;
            default:
                state = reducer(state, action);
        }
        return Immutable.create(state, immutableOptions);
    };
}

export default function (reducer, preloadedState, enhancer) {
    var args = [...arguments];
    args[0] = modelizar(mapper(reducer));

    var store = createStore(...args);
    var batching = false;
    var actions = [];
    var {dispatch, getState} = store;

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

    return {
        ...store,
        registerFunction: registerFunction,
        dispatch: (action) => {
            if (batching) {
                actions.push(action);
                return action;
            } else {
                return dispatch(action);
            }
        },
        /**
         * @param {Immutable} [state] If no specified, map the root state.
         * @param {Boolean} [immutable=true]
         * @return {*} Type depends on `state`.
         */
        mapping: function (state, immutable = true) {
            if (isBoolean(state)) {
                immutable = state;
                state = getState();
            }
            invariant(
                Immutable.isImmutable(state),
                `Expected the parameter "state" is an Immutable or primitive object. But, received '${state}'.`
            );

            var currentState = state;
            var target = mapState({...this}, currentState, null, immutable);

            if (isObject(target)) {
                this.subscribe(() => {
                    var previousState = currentState;
                    currentState = getState().get(getState().path(state));

                    if (currentState && !Immutable.equals(currentState, previousState)) {
                        mapState({...this}, currentState, previousState, target, immutable);
                    }
                });
            }
            return target;
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
                    if (Immutable.equals(current, previous)) {
                        return;
                    }

                    if (current) {
                        target[prop] = mapState({...this}, current, previous, target[prop], immutable);
                    } else {
                        target[prop] = current;
                    }
                });
                return bind;
            };
            // Trigger first binding.
            // NOTE: Using this.subscribe to make sure
            // the listener executing order is same as the subscribing order.
            this.subscribe(bind());

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
