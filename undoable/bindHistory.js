import {
    isObject
} from '../../immutable';

import {
    getHistory
} from './reducer';
import {
    init,
    undo,
    redo,
    clear,
    startBatch,
    endBatch
} from './actions';

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
export default function bindHistory(store, obj) {
    if (!isObject(obj) || obj.history) {
        return obj;
    }

    var getLazyHistory = (obj) => {
        var history = getHistory(obj);
        if (!history) {
            store.dispatch(init(obj));
            history = getHistory(obj);
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
        undo: (count) => store.dispatch(undo(obj, count)),
        redo: (count) => store.dispatch(redo(obj, count)),
        clear: () => store.dispatch(clear(obj)),
        undoable: () => getLazyHistory(obj).undoes.length > 0,
        redoable: () => getLazyHistory(obj).redoes.length > 0,
        undoes: () => getLazyHistory(obj).undoes,
        redoes: () => getLazyHistory(obj).redoes,
        startBatch: () => store.dispatch(startBatch(obj)),
        endBatch: () => store.dispatch(endBatch(obj))
    };
    Object.defineProperties(history, {
        timestamp: {
            get: () => getLazyHistory(obj).timestamp
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
    return obj;
}
