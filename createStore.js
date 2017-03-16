import invariant from 'invariant';

import {
    createStore
} from 'redux';

import isBoolean from 'lodash/isBoolean';

import forEach from './utils/forEach';
import {
    registerFunction
} from './object/functions';

import Immutable, {
    isFunction,
    isObject
} from '../immutable';
import mapState from './mapper/mapState';
import modelizar from './modelizar';
import {batchMutateState} from './modelizar/actions';

export default function (reducer, preloadedState, enhancer, options) {
    if (isFunction(preloadedState)) {
        options = enhancer;
        enhancer = preloadedState;
        preloadedState = undefined;
    }
    reducer = modelizar(reducer, options || {});

    var store = createStore(reducer, preloadedState, enhancer);
    var batching = false;
    var actions = [];
    var {dispatch, getState} = store;

    function startBatch() {
        actions = [];
        batching = true;
    }

    function doBatch(meta) {
        var savedActions = actions.concat();

        batching = false;
        actions = [];
        // Do mutation even if error happened.
        if (savedActions.length > 0) {
            dispatch(batchMutateState(savedActions, meta));
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

                    // NOTE: If the mapped state doesn't exist, no need to update the mapping object.
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
