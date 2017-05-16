'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.undoableMutate = undoableMutate;
exports.mutate = mutate;

var _immutableJs = require('immutable-js');

var _undoable = require('../undoable');

var _undoable2 = _interopRequireDefault(_undoable);

var _actions = require('../undoable/actions');

var _reducer = require('../undoable/reducer');

var _actions2 = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emptyReducer = function emptyReducer(state, action) {
    return state;
};
// undoable undo/redo/batching/clear时会指定目标，通过目标找到path并调用undoable更新该目标的状态
// undoable insert仅在有更新时发生，其仅需拦截更新path上的节点即可
function pathNodeMutate(state) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
        return false;
    };
    var rootState = arguments[3];

    var target = state.valueOf();
    var opts = filter(state);

    if (opts) {
        opts = (0, _immutableJs.isObject)(opts) ? opts : {};
        // NOTE: `state` already be mutated,
        // so trigger initializing history
        // by passing the original state in `rootState`.
        if (action.type !== _actions.UNDOABLE_INIT && !(0, _reducer.getHistory)(target)) {
            var path = rootState.path(target);
            var oldState = rootState.get(path);
            (0, _undoable2.default)(emptyReducer, opts)(oldState, (0, _actions.init)(target));
        }
        return (0, _undoable2.default)(emptyReducer, opts)(state, action);
    } else {
        return state;
    }
}

function undoableMutate(state) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var rootState = state;
    var path = state.path(action.$target);

    return state.update(path, function (state) {
        return pathNodeMutate(state, action, options.undoable, rootState);
    });
}

function mutate(state) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var rootState = state;
    var path = state.path(action.$target);
    var subPath = (0, _immutableJs.extractPath)(action.key);

    return state.update(path, function (state) {
        switch (action.type) {
            case _actions2.REMOVE_SUB_STATE:
                return state.remove(subPath);
            default:
                // Make immutable value from root state to
                // make sure the cycle reference can be processed.
                return rootState.set(path.concat(subPath), action.value).get(path);
        }
    }, function (state) {
        return pathNodeMutate(state, action, options.undoable, rootState);
    });
}