import Immutable from 'immutable';
import invariant from 'invariant';

import defaults from 'lodash/defaults';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';

import {
    UNDOABLE_INIT,
    UNDOABLE_UNDO,
    UNDOABLE_REDO,
    UNDOABLE_CLEAR,
    UNDOABLE_START_BATCH,
    UNDOABLE_END_BATCH
} from './actions';
import {
    init,
    insert,
    undo,
    redo,
    clear,
    startBatch,
    endBatch
} from './reducer';

// NOTE：由于状态中不存放history相关信息，故初始化时不需要对状态树做任何调整，并且可在任何时刻使用deep immutable
/**
 * 约束：
 * - `undoable`只能应用在更新某个model的reducer上，传入的`state`将被视为model的状态；
 * - `state`需包含`equals`、`hashCode`方法，以便于等值比较和Map存储；
 * - 不支持集合类型；
 */
export default function undoable(reducer, options = {}) {
    options = defaults(options, {
        // only add to history if return `true`
        filter: (action, currentState, previousHistory) => true,
        debug: false,
        // whether or not add all deep state tree to history,
        // if `false`, only the shallow state will be add to history
        deep: true,
        // set to a number to turn on a limit for the history:
        // * -1: unlimited;
        // * 0: no history;
        // * [1,): limit number;
        limit: -1,
        // Keep the `history` to be redo/undo independently,
        // the top state's `history` will not change independent history's state.
        // NOTE: The top history should always keep `independent` to `false`.
        independent: false
    });

    return (state, action = {}) => {
        invariant(Immutable.Map.isMap(state) || (isObject(state) && !isArray(state)),
            'Expect the parameter "state" is Immutable.Map, Object(except Array).'
            + ' But received ' + state);

        switch (action.type) {
            case UNDOABLE_INIT:
                // NOTE: Dispatch `UNDOABLE_INIT` when binding history to model.
                // see `./bindHistory.js`.
                return init(state, action, options);
            case UNDOABLE_UNDO:
                return undo(state, action);
            case UNDOABLE_REDO:
                return redo(state, action);
            case UNDOABLE_CLEAR:
                return clear(state, action);
            case UNDOABLE_START_BATCH:
                return startBatch(state, action);
            case UNDOABLE_END_BATCH:
                return endBatch(state, action);
            default:
                // 注意以下情况：
                // - 状态变更（部分/全部）：reducer返回的必然为完整的model state，
                //   故，action无需指定target；
                // - 多级undoable：insert中会检查状态是否真的发生变化，
                //   在下级发生变化且`deep==true`时，上级也需同样记录变化；
                var newState = reducer(state, action);
                return insert(newState, action);
        }
    };
}
