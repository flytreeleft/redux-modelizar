import isFunction from 'lodash/isFunction';

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
    // options = {
    //     undoable: [{
    //         type: Object,
    //         filter: (state, action) => false,
    //         options: {}
    //     }]
    // };
    var histories = [].concat(options.undoable || []).map(history => {
        var filter = history.filter;

        if (!isFunction(filter)) {
            filter = (state, action) => {
                var Cls = state && getObjClass(state);
                return Cls ? new Cls() instanceof history.type : false;
            };
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
