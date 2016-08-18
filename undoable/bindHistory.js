import isObject from 'lodash/isObject';

import {
    getHistory
} from './reducer';
import {
    undo,
    redo,
    clear,
    startBatch,
    endBatch
} from './actions';

export default function bindHistory(store, obj) {
    if (!isObject(obj) || obj.history) {
        return obj;
    }

    Object.defineProperty(obj, 'history', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: {
            undo: total => getHistory(obj) && store.dispatch(undo(obj, total)),
            redo: total => getHistory(obj) && store.dispatch(redo(obj, total)),
            clear: () => getHistory(obj) && store.dispatch(clear(obj)),
            undoable: () => getHistory(obj) && getHistory(obj).undoes.length > 0,
            redoable: () => getHistory(obj) && getHistory(obj).redoes.length > 0,
            undoes: () => getHistory(obj) && getHistory(obj).undoes,
            redoes: () => getHistory(obj) && getHistory(obj).redoes,
            isBatching: () => getHistory(obj) && getHistory(obj).isBatching,
            startBatch: () => getHistory(obj) && store.dispatch(startBatch(obj)),
            endBatch: () => getHistory(obj) && store.dispatch(endBatch(obj))
        }
    });
    return obj;
}
