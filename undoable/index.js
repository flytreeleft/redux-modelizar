import defaults from 'lodash/defaults';

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
 * 约束：
 * - `undoable`只能应用在更新某个model的reducer上，传入的`state`将被视为model的状态；
 * - 不支持集合类型；
 * Reference:
 * - [Redux undo](https://github.com/omnidan/redux-undo);
 */
export default function undoable(reducer, options = {}) {
    options = defaults(options, {
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
    });

    return (state, action = {}) => {
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
                // For initializing lazy history.
                var newState = init(state, action, options);
                newState = reducer(state, action);
                return insert(newState, action);
        }
    };
}
