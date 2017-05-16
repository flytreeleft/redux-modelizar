'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (reducer) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (options.undoable) {
        return mutationWithUndoable(reducer, options);
    } else {
        return pureMutation(reducer, options);
    }
};

var _actions = require('../undoable/actions');

var _reducer = require('../undoable/reducer');

var _actions2 = require('./actions');

var _reducer2 = require('./reducer');

function mutationWithUndoable(reducer, options) {
    return function (state) {
        var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        switch (action.type) {
            case _actions2.BATCH_MUTATE:
                action.actions.forEach(function (action) {
                    var path = state.path(action.$target);
                    do {
                        state = state.set(path, (0, _reducer.startBatch)(state.get(path), action));
                        path && path.pop();
                    } while (path && path.length > 0);
                });
                action.actions.forEach(function (action) {
                    state = mutationWithUndoable(reducer, options)(state, action);
                });
                action.actions.forEach(function (action) {
                    var path = state.path(action.$target);
                    do {
                        state = state.set(path, (0, _reducer.endBatch)(state.get(path), action));
                        path && path.pop();
                    } while (path && path.length > 0);
                });
                return state;
            case _actions.UNDOABLE_INIT:
            case _actions.UNDOABLE_UNDO:
            case _actions.UNDOABLE_REDO:
            case _actions.UNDOABLE_CLEAR:
            case _actions.UNDOABLE_START_BATCH:
            case _actions.UNDOABLE_END_BATCH:
                return (0, _reducer2.undoableMutate)(state, action, options);
            case _actions2.MUTATE_STATE:
            case _actions2.REMOVE_SUB_STATE:
                return (0, _reducer2.mutate)(state, action, options);
            default:
                return reducer(state, action);
        }
    };
}

function pureMutation(reducer, options) {
    return function (state) {
        var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        switch (action.type) {
            case _actions2.BATCH_MUTATE:
                action.actions.forEach(function (action) {
                    state = pureMutation(reducer, options)(state, action);
                });
                return state;
            default:
                return reducer(state, action);
        }
    };
}

module.exports = exports['default'];