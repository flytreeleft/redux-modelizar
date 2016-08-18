export const IS_UNDOABLE_SENTINEL = '__IS_UNDOABLE__';

export default function isUndoableState(obj) {
    return obj && obj[IS_UNDOABLE_SENTINEL];
}
