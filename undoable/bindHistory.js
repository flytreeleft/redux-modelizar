import isArray from 'lodash/isArray';

import isPrimitive from '../utils/isPrimitive';

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
    if (isPrimitive(obj) || isArray(obj) || obj.history) {
        return obj;
    }

    var getLazyHistory = (obj) => {
        if (!getHistory(obj)) {
            store.dispatch(init(obj));
        }
        return getHistory(obj);
    };

    Object.defineProperty(obj, 'history', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: {
            timestamp: () => getLazyHistory(obj).timestamp,
            undo: total => store.dispatch(undo(obj, total)),
            redo: total => store.dispatch(redo(obj, total)),
            clear: () => store.dispatch(clear(obj)),
            undoable: () => getLazyHistory(obj).undoes.length > 0,
            redoable: () => getLazyHistory(obj).redoes.length > 0,
            undoes: () => getLazyHistory(obj).undoes,
            redoes: () => getLazyHistory(obj).redoes,
            isBatching: () => getLazyHistory(obj).isBatching,
            startBatch: () => store.dispatch(startBatch(obj)),
            endBatch: () => store.dispatch(endBatch(obj))
        }
    });
    return obj;
}
