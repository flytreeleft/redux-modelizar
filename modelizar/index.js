import {
    MODEL_STATE_MUTATE
} from './actions';
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
            case UNDOABLE_INIT:
            case UNDOABLE_UNDO:
            case UNDOABLE_REDO:
            case UNDOABLE_CLEAR:
            case UNDOABLE_START_BATCH:
            case UNDOABLE_END_BATCH:
            case MODEL_STATE_MUTATE:
                return mutation(state, action, options);
            default:
                return reducer(state, action);
        }
    };
}

function pureMutation(reducer, options) {
    return (state, action = {}) => {
        switch (action.type) {
            case MODEL_STATE_MUTATE:
                return mutation(state, action, options);
            default:
                return reducer(state, action);
        }
    };
}

export default function modelizar(reducer, options = {}) {
    if (options.undoable) {
        return mutationWithUndoable(reducer, options);
    } else {
        return pureMutation(reducer, options);
    }
}
