import {
    BATCH_MUTATE
} from './actions';
import {
    MUTATE_STATE,
    REMOVE_SUB_STATE
} from '../mapper/actions';
import {
    UNDOABLE_INIT,
    UNDOABLE_UNDO,
    UNDOABLE_REDO,
    UNDOABLE_CLEAR,
    UNDOABLE_START_BATCH,
    UNDOABLE_END_BATCH
} from '../undoable/actions';
import {
    mutation
} from './reducer';

function mutationWithUndoable(reducer, options) {
    return (state, action = {}) => {
        switch (action.type) {
            case BATCH_MUTATE:
                // TODO start batch (multiple target support)
                action.actions.forEach((action) => {
                    state = mutationWithUndoable(reducer, options)(state, action);
                });
                // TODO end batch
                return state;
            case UNDOABLE_INIT:
            case UNDOABLE_UNDO:
            case UNDOABLE_REDO:
            case UNDOABLE_CLEAR:
            case UNDOABLE_START_BATCH:
            case UNDOABLE_END_BATCH:
            case MUTATE_STATE:
            case REMOVE_SUB_STATE:
                return mutation(state, action, options);
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
