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

/**
 * Reference:
 * - [Redux undo](https://github.com/omnidan/redux-undo);
 */
export default function undoable(reducer, options = {}) {
    options = Object.assign({}, {
        // Only add to history if return `true`
        filter: (action, currentState, previousHistory) => true,
        debug: false,
        // Whether or not add all deep state tree to history,
        // if `false`, only the shallow state will be add to history
        deep: true,
        // Set to a number to turn on a limit for the history:
        // * -1: unlimited;
        // * 0: no history;
        // * [1,): limit number;
        limit: -1,
        // Keep the `history` to be redo/undo independently,
        // the top state's history will not change
        // the independent history's present state.
        // NOTE: The top history should always keep `independent` to `false`.
        independent: false
    }, options);

    return (state, action = {}) => {
        switch (action.type) {
            case UNDOABLE_INIT:
                // NOTE: Dispatch `UNDOABLE_INIT` when binding history to object.
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
                // - 状态变更（部分/全部）：传入的state和reducer返回的state
                //   必然为完整的model state，故，action无需指定target；
                // - 多级undoable：insert中会检查状态是否真的发生变化，
                //   在下级发生变化且`deep==true`时，上级也需同样记录变化；
                var newState = reducer(state, action);
                return insert(newState, action);
        }
    };
}
