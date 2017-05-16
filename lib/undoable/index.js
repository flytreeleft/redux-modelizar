'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undoable;

var _actions = require('./actions');

var _reducer = require('./reducer');

/**
 * Reference:
 * - [Redux undo](https://github.com/omnidan/redux-undo);
 */
function undoable(reducer) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    options = Object.assign({}, {
        // Only add to history if return `true`
        filter: function filter(action, currentState, previousHistory) {
            return true;
        },
        debug: false,
        // Whether or not add all deep state tree to history,
        // if `false`, only the shallow state will be add to history
        deep: true,
        // Set to a number to turn on a limit for the history:
        // * -1: unlimited;
        // * 0: no history;
        // * [1,): limit number;
        limit: -1,
        // Keep the `history` to be redo/undo independently,
        // the top state's history will not change
        // the independent history's present state.
        // NOTE: The top history should always keep `independent` to `false`.
        independent: false
    }, options);

    return function (state) {
        var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        switch (action.type) {
            case _actions.UNDOABLE_INIT:
                // NOTE: Dispatch `UNDOABLE_INIT` when binding history to object.
                // see `./bindHistory.js`.
                return (0, _reducer.init)(state, action, options);
            case _actions.UNDOABLE_UNDO:
                return (0, _reducer.undo)(state, action);
            case _actions.UNDOABLE_REDO:
                return (0, _reducer.redo)(state, action);
            case _actions.UNDOABLE_CLEAR:
                return (0, _reducer.clear)(state, action);
            case _actions.UNDOABLE_START_BATCH:
                return (0, _reducer.startBatch)(state, action);
            case _actions.UNDOABLE_END_BATCH:
                return (0, _reducer.endBatch)(state, action);
            default:
                // 注意以下情况：
                // - 状态变更（部分/全部）：传入的state和reducer返回的state
                //   必然为完整的model state，故，action无需指定target；
                // - 多级undoable：insert中会检查状态是否真的发生变化，
                //   在下级发生变化且`deep==true`时，上级也需同样记录变化；
                var newState = reducer(state, action);
                return (0, _reducer.insert)(newState, action);
        }
    };
}
module.exports = exports['default'];