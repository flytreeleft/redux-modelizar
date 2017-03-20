import {
    UNDOABLE_INIT,
    UNDOABLE_UNDO,
    UNDOABLE_REDO,
    UNDOABLE_CLEAR,
    UNDOABLE_START_BATCH,
    UNDOABLE_END_BATCH
} from '../undoable/actions';
import {
    startBatch,
    endBatch
} from '../undoable/reducer';

import {
    BATCH_MUTATE,
    MUTATE_STATE,
    REMOVE_SUB_STATE
} from './actions';
import {
    mutate,
    undoableMutate
} from './reducer';

function mutationWithUndoable(reducer, options) {
    return (state, action = {}) => {
        switch (action.type) {
            case BATCH_MUTATE:
                action.actions.forEach((action) => {
                    var path = state.path(action.$target);
                    do {
                        state = state.set(path, startBatch(state.get(path), action));
                        path && path.pop();
                    } while (path && path.length > 0);
                });
                action.actions.forEach((action) => {
                    state = mutationWithUndoable(reducer, options)(state, action);
                });
                action.actions.forEach((action) => {
                    var path = state.path(action.$target);
                    do {
                        state = state.set(path, endBatch(state.get(path), action));
                        path && path.pop();
                    } while (path && path.length > 0);
                });
                return state;
            case UNDOABLE_INIT:
            case UNDOABLE_UNDO:
            case UNDOABLE_REDO:
            case UNDOABLE_CLEAR:
            case UNDOABLE_START_BATCH:
            case UNDOABLE_END_BATCH:
                return undoableMutate(state, action, options);
            case MUTATE_STATE:
            case REMOVE_SUB_STATE:
                return mutate(state, action, options);
            default:
                return reducer(state, action);
        }
    };
}

function pureMutation(reducer, options) {
    return (state, action = {}) => {
        switch (action.type) {
            case BATCH_MUTATE:
                action.actions.forEach((action) => {
                    state = pureMutation(reducer, options)(state, action);
                });
                return state;
            default:
                return reducer(state, action);
        }
    };
}

export default function (reducer, options = {}) {
    if (options.undoable) {
        return mutationWithUndoable(reducer, options);
    } else {
        return pureMutation(reducer, options);
    }
}
