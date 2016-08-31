import find from 'lodash/find';

import {
    MODEL_STATE_MUTATE
} from './actions';
import undoable from '../undoable';

// undoable init/undo/redo/batching/clear时会指定目标，通过目标找到path并调用undoable更新该目标的状态
// undoable insert仅在有更新时发生，其仅需拦截更新path上的节点即可
function undoableMutate(state, action = {}, histories = []) {
    var history = find(histories, (history) => {
        return history.filter(state, action);
    });

    if (history) {
        return undoable((state, action) => state, history.options)(state, action);
    } else {
        return state;
    }
}

function mutate(state, action) {
    // TODO Diff merge
    return state.set(action.$state);
}

export function mutation(state, action = {}, histories = []) {
    var target = action.$state || action.$target;
    var path = state.path(target);

    switch (action.type) {
        case MODEL_STATE_MUTATE:
            return state.update(path, (state) => {
                return mutate(state, action);
            }, (state) => {
                return undoableMutate(state, action, histories);
            });
        default:
            return state.update(path, (state) => {
                return undoableMutate(state, action, histories);
            });
    }
}
