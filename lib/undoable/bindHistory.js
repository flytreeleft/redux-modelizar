'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = bindHistory;

var _immutableJs = require('immutable-js');

var _reducer = require('./reducer');

var _actions = require('./actions');

/**
 * Bind `history` to object.
 * The object can operate historic data by `history`.
 *
 * The properties of `history`:
 * ```
 * - [Number] timestamp: The latest mutation occurred time.
 * - [Function] undo: `([Number]: count = 1) => ()`, undo the specified number(>=1) of actions.
 * - [Function] redo: `([Number]: count = 1) => ()`, redo the specified number(>=1) of actions.
 * - [Function] clear: `() => ()`, clear all actions.
 * - [Function] undoable: `() => Boolean`, can be undo or not?
 * - [Function] redoable: `() => Boolean`, can be redo or not?
 * - [Function] undoes: `() => Array`, return the undo historic records.
 * - [Function] redoes: `() => Array`, return the redo historic records.
 * - [Function] startBatch: `() => ()`, start history batch recording.
 * - [Function] endBatch: `() => ()`, stop history batch recording.
 * ```
 */
function bindHistory(store, obj) {
    var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!(0, _immutableJs.isObject)(obj) || obj.history) {
        return obj;
    }

    var getLazyHistory = function getLazyHistory(obj) {
        var history = (0, _reducer.getHistory)(obj);
        if (!history) {
            store.dispatch((0, _actions.init)(obj));
            history = (0, _reducer.getHistory)(obj);
        }

        return history ? history : {
            timestamp: 0,
            undoes: [],
            redoes: [],
            batching: false
        };
    };

    // TODO 确保history是响应式的
    var history = {
        undo: function undo(count) {
            return store.dispatch((0, _actions.undo)(obj, count));
        },
        redo: function redo(count) {
            return store.dispatch((0, _actions.redo)(obj, count));
        },
        clear: function clear() {
            return store.dispatch((0, _actions.clear)(obj));
        },
        undoable: function undoable() {
            return getLazyHistory(obj).undoes.length > 0;
        },
        redoable: function redoable() {
            return getLazyHistory(obj).redoes.length > 0;
        },
        undoes: function undoes() {
            return getLazyHistory(obj).undoes;
        },
        redoes: function redoes() {
            return getLazyHistory(obj).redoes;
        },
        startBatch: function startBatch() {
            return store.dispatch((0, _actions.startBatch)(obj));
        },
        endBatch: function endBatch() {
            return store.dispatch((0, _actions.endBatch)(obj));
        }
    };
    Object.defineProperties(history, {
        timestamp: {
            get: function get() {
                return getLazyHistory(obj).timestamp;
            }
        }
    });

    Object.defineProperties(obj, {
        history: {
            writable: false,
            enumerable: false,
            configurable: true,
            value: Object.freeze(history)
        }
    });
    immediate && getLazyHistory(obj);

    return obj;
}
module.exports = exports['default'];