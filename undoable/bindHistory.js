import isObject from 'lodash/isObject';

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

export default function bindHistory(store, obj) {
    if (!isObject(obj) || obj.history) {
        return obj;
    }

    store.dispatch(init(obj));
    if (!getHistory(obj)) {
        return obj;
    }

    Object.defineProperty(obj, 'history', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: {
            undo: total => store.dispatch(undo(obj, total)),
            redo: total => store.dispatch(redo(obj, total)),
            clear: () => store.dispatch(clear(obj)),
            undoable: () => getHistory(obj).undoes.length > 0,
            redoable: () => getHistory(obj).redoes.length > 0,
            undoes: () => getHistory(obj).undoes,
            redoes: () => getHistory(obj).redoes,
            isBatching: () => getHistory(obj).isBatching,
            startBatch: () => store.dispatch(startBatch(obj)),
            endBatch: () => store.dispatch(endBatch(obj))
        }
    });
    return obj;
}
