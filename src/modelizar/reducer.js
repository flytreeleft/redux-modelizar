import {
    extractPath,
    isObject
} from 'immutable';

import undoable from '../undoable';
import {
    init,
    UNDOABLE_INIT
} from '../undoable/actions';
import {getHistory} from '../undoable/reducer';

import {
    REMOVE_SUB_STATE
} from './actions';

const emptyReducer = (state, action) => state;
// undoable undo/redo/batching/clear时会指定目标，通过目标找到path并调用undoable更新该目标的状态
// undoable insert仅在有更新时发生，其仅需拦截更新path上的节点即可
function pathNodeMutate(state, action = {}, filter = () => false, rootState) {
    var target = state.valueOf();
    var opts = filter(state);

    if (opts) {
        opts = isObject(opts) ? opts : {};
        // NOTE: `state` already be mutated,
        // so trigger initializing history
        // by passing the original state in `rootState`.
        if (action.type !== UNDOABLE_INIT && !getHistory(target)) {
            var path = rootState.path(target);
            var oldState = rootState.get(path);
            undoable(emptyReducer, opts)(oldState, init(target));
        }
        return undoable(emptyReducer, opts)(state, action);
    } else {
        return state;
    }
}

export function undoableMutate(state, action = {}, options = {}) {
    var rootState = state;
    var path = state.path(action.$target);

    return state.update(path, (state) => {
        return pathNodeMutate(state, action, options.undoable, rootState);
    });
}

export function mutate(state, action = {}, options = {}) {
    var rootState = state;
    var path = state.path(action.$target);
    var subPath = extractPath(action.key);

    return state.update(path, (state) => {
        switch (action.type) {
            case REMOVE_SUB_STATE:
                return state.remove(subPath);
            default:
                // Make immutable value from root state to
                // make sure the cycle reference can be processed.
                return rootState.set(path.concat(subPath), action.value).get(path);
        }
    }, (state) => {
        return pathNodeMutate(state, action, options.undoable, rootState);
    });
}
