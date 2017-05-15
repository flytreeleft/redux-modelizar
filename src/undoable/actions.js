import {
    REDUX_MODELIZAR
} from '../namespace';

export const REDUX_MODELIZAR_UNDOABLE = REDUX_MODELIZAR + '/undoable';
export const UNDOABLE_INIT = REDUX_MODELIZAR_UNDOABLE + '/INIT';
export const UNDOABLE_UNDO = REDUX_MODELIZAR_UNDOABLE + '/UNDO';
export const UNDOABLE_REDO = REDUX_MODELIZAR_UNDOABLE + '/REDO';
export const UNDOABLE_CLEAR = REDUX_MODELIZAR_UNDOABLE + '/CLEAR';
export const UNDOABLE_START_BATCH = REDUX_MODELIZAR_UNDOABLE + '/START_BATCH';
export const UNDOABLE_END_BATCH = REDUX_MODELIZAR_UNDOABLE + '/END_BATCH';

export function init(target) {
    return {
        type: UNDOABLE_INIT,
        $target: target
    };
}

export function undo(target, count) {
    return {
        type: UNDOABLE_UNDO,
        $target: target,
        count
    };
}

export function redo(target, count) {
    return {
        type: UNDOABLE_REDO,
        $target: target,
        count
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
