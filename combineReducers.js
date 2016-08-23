import {
    combineReducers
} from 'redux';
import {
    ActionTypes
} from 'redux/lib/createStore';

import toPlain from './object/toPlain';
import map from './utils/map';

export default function (reducers, options = {}) {
    var combinedReducer = combineReducers(reducers);

    options.refProps = [].concat(options.refProps || []);

    return (state = {}, action) => {
        var newState;

        switch (action.type) {
            case ActionTypes.INIT:
                newState = map(state, (value) => toPlain(value, options.refProps));
                break;
            default:
                newState = state;
                action = toPlain(action, options.refProps);
        }

        return combinedReducer(newState, action);
    };
}
