import {
    REDUX_MODELIZAR_UNDOABLE_NAMESPACE
} from './namespace';

export const UNDOABLE_UNDO = REDUX_MODELIZAR_UNDOABLE_NAMESPACE + '/UNDOABLE_UNDO';
export const UNDOABLE_REDO = REDUX_MODELIZAR_UNDOABLE_NAMESPACE + '/UNDOABLE_REDO';
export const UNDOABLE_CLEAR = REDUX_MODELIZAR_UNDOABLE_NAMESPACE + '/UNDOABLE_CLEAR';
export const UNDOABLE_START_BATCH = REDUX_MODELIZAR_UNDOABLE_NAMESPACE + '/UNDOABLE_START_BATCH';
export const UNDOABLE_END_BATCH = REDUX_MODELIZAR_UNDOABLE_NAMESPACE + '/UNDOABLE_END_BATCH';

export function undo(target, total) {
    return {
        type: UNDOABLE_UNDO,
        $target: target,
        total
    };
}

export function redo(target, total) {
    return {
        type: UNDOABLE_REDO,
        $target: target,
        total
    };
}

export function clear(target) {
    return {
        type: UNDOABLE_CLEAR,
        $target: target
    };
}

export function startBatch(target) {
    return {
        type: UNDOABLE_START_BATCH,
        $target: target
    };
}

export function endBatch(target) {
    return {
        type: UNDOABLE_END_BATCH,
        $target: target
    };
}
