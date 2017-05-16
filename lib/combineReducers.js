'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (reducers) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var action = arguments[1];

        // NOTE: The initial state will be made as an immutable in `createStore`.
        Object.keys(reducers).forEach(function (key) {
            var reducer = reducers[key];
            var path = [key];

            if (!(0, _immutableJs.hasOwn)(state, key)) {
                // No initial value?
                var stateForKey = reducer(undefined, action);

                if (_immutableJs2.default.isInstance(state)) {
                    state = state.set(path, stateForKey);
                } else {
                    state[key] = stateForKey;
                }
            } else {
                state = state.update(path, function (state) {
                    return reducer(state, action);
                });
            }
        });
        return state;
    };
};

var _immutableJs = require('immutable-js');

var _immutableJs2 = _interopRequireDefault(_immutableJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

// NOTE: Redux Devtools supports performance monitoring