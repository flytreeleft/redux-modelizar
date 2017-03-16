import {
    extractPath,
    isObject
} from '../../immutable';

import {
    MUTATE_STATE,
    REMOVE_SUB_STATE
} from '../mapper/actions';
import undoable from '../undoable';
import {
    getHistory
} from '../undoable/reducer';
import {
    init
} from '../undoable/actions';

const emptyReducer = (state, action) => state;
// undoable undo/redo/batching/clear时会指定目标，通过目标找到path并调用undoable更新该目标的状态
// undoable insert仅在有更新时发生，其仅需拦截更新path上的节点即可
// TODO 将注册函数传进来
function undoableMutate(state, action = {}, filter = () => false, rootState) {
    var target = state.valueOf();
    var opts = filter(state, action);

    if (opts) {
        opts = isObject(opts) ? opts : {};
        // NOTE: `state` already be mutated,
        // so trigger initializing history
        // by passing the original state in `rootState`.
        if (!getHistory(target)) {
            var path = rootState.path(target);
            var oldState = rootState.get(path);
            undoable(emptyReducer, opts)(oldState, init(target));
        }
        return undoable(emptyReducer, opts)(state, action);
    } else {
        return state;
    }
}

export function mutation(state, action = {}, options = {}) {
    var path = state.path(action.$target);
    if (!path) {
        return state;
    }

    var rootState = state;
    switch (action.type) {
        case REMOVE_SUB_STATE:
        case MUTATE_STATE:
            var subPath = extractPath(action.key);

            return state.update(path, (state) => {
                return action.type === REMOVE_SUB_STATE
                    ? state.remove(subPath)
                    // Make sure the cycle reference can be processed.
                    : rootState.set(path.concat(subPath), action.value).get(path.concat(subPath));
            }, (state) => {
                return undoableMutate(state, action, options.undoable, rootState);
            });
        default:
            return state.update(path, (state) => {
                return undoableMutate(state, action, options.undoable, rootState);
            });
    }
}
