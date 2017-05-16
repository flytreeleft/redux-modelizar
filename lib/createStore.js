'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (reducer, preloadedState, enhancer, options) {
    if ((0, _immutableJs.isFunction)(preloadedState)) {
        options = enhancer;
        enhancer = preloadedState;
        preloadedState = undefined;
    }

    var globalOpts = options || {};
    var undoable = globalOpts.undoable;
    globalOpts.debug = globalOpts.debug === true;
    globalOpts.undoable = function (state) {
        return !!undoable && undoable(state, (0, _toPlain.extractFunctionFrom)(state));
    };

    reducer = immutable((0, _modelizar2.default)(reducer, globalOpts));

    var store = (0, _redux.createStore)(reducer, preloadedState, enhancer);
    var batching = false;
    var actions = [];
    var _dispatch = store.dispatch,
        getState = store.getState;


    function startBatch() {
        actions = [];
        batching = true;
    }

    function _doBatch(meta) {
        var savedActions = actions.concat();

        batching = false;
        actions = [];
        // Do mutation even if error happened.
        if (savedActions.length > 0) {
            _dispatch((0, _actions.batchMutateState)(savedActions, meta));
        }
    }

    return _extends({}, store, {
        configure: globalOpts,
        registerFunction: _functions.registerFunction,
        dispatch: function dispatch(action) {
            if (batching) {
                actions.push(action);
                return action;
            } else {
                return _dispatch(action);
            }
        },
        /**
         * @param {Immutable} [state] If no specified, map the root state.
         * @param {Boolean} [immutable=true]
         * @return {*} Type depends on `state`.
         */
        mapping: function mapping(state) {
            var _this = this;

            var immutable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if ((0, _immutableJs.isBoolean)(state)) {
                immutable = state;
                state = getState();
            }
            (0, _invariant2.default)(_immutableJs2.default.isImmutable(state), 'Expected the parameter "state" is an Immutable or primitive object. But, received \'' + state + '\'.');

            var currentState = state;
            var target = (0, _mapState2.default)(_extends({}, this), currentState, null, immutable);

            if ((0, _immutableJs.isObject)(target)) {
                this.subscribe(function () {
                    var previousState = currentState;
                    currentState = getState().get(getState().path(state));

                    // NOTE: If the mapped state doesn't exist, no need to update the mapping object.
                    if (currentState && !_immutableJs2.default.equals(currentState, previousState)) {
                        (0, _mapState2.default)(_extends({}, _this), currentState, previousState, target, immutable);
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
        bind: function bind(target) {
            var _this2 = this;

            var mapping = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var immutable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var currentState;
            var bind = function bind() {
                var previousState = currentState;
                currentState = getState();

                (0, _forEach2.default)(mapping, function (getter, prop) {
                    var previous = previousState && getter(previousState);
                    var current = currentState && getter(currentState);
                    if (_immutableJs2.default.equals(current, previous)) {
                        return;
                    }

                    if (current) {
                        target[prop] = (0, _mapState2.default)(_extends({}, _this2), current, previous, target[prop], immutable);
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
        isBatching: function isBatching() {
            return batching;
        },
        /**
         * @param {Function} batch The scope function to do batching mutations.
         * @param {Object} [meta={}] The extra information of triggering the batch.
         *          e.g. `{method: 'ClassName$methodName'}`
         */
        doBatch: function doBatch(batch) {
            var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
                _doBatch(meta);
            }
        }
    });
};

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _redux = require('redux');

var _immutableJs = require('immutable-js');

var _immutableJs2 = _interopRequireDefault(_immutableJs);

var _forEach = require('./utils/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _functions = require('./utils/functions');

var _toPlain = require('./utils/toPlain');

var _toPlain2 = _interopRequireDefault(_toPlain);

var _mapState = require('./mapper/mapState');

var _mapState2 = _interopRequireDefault(_mapState);

var _modelizar = require('./modelizar');

var _modelizar2 = _interopRequireDefault(_modelizar);

var _actions = require('./modelizar/actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function immutable(reducer) {
    var immutableOptions = {
        toPlain: _toPlain2.default
    };

    return function (state, action) {
        state = _immutableJs2.default.create(state, immutableOptions);

        state = reducer(state, action);

        return _immutableJs2.default.create(state, immutableOptions);
    };
}

module.exports = exports['default'];