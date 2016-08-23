import isFunction from 'lodash/isFunction';
import defaults from 'lodash/defaults';

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
import {
    getObjClass
} from '../object/sentinels';

export default function modelizar(reducer, options = {}) {
    options = defaults(options, {
        // The condition and options for the matched state.
        // Every element can contains following properties:
        // - {Function} [type] The constructor function of model.
        // - {Function} [filter=(state, action)=>false] The custom filter function.
        // - {Object} [options] The options of `undoable`, see `../undoable/index`.
        undoable: []
    });

    var histories = [].concat(options.undoable || []).map(history => {
        var filter = history.filter;

        if (!isFunction(filter) && isFunction(history.type)) {
            filter = (state, action) => {
                var Cls = getObjClass(state);
                return Cls ? new Cls() instanceof history.type : false;
            };
        } else {
            filter = () => false;
        }
        return {
            filter: filter,
            options: history.options || {}
        };
    });

    return (state, action = {}) => {
        if (histories.length > 0) {
            // NOTE: Only one of custom and modelizar undoable
            // can be chosen in the same state tree.
            switch (action.type) {
                case UNDOABLE_INIT:
                case UNDOABLE_UNDO:
                case UNDOABLE_REDO:
                case UNDOABLE_CLEAR:
                case UNDOABLE_START_BATCH:
                case UNDOABLE_END_BATCH:
                case MODEL_STATE_MUTATE:
                    return mutation(state, action, histories);
            }
        } else {
            switch (action.type) {
                case MODEL_STATE_MUTATE:
                    return mutation(state, action, histories);
            }
        }
        return reducer(state, action);
    };
}
