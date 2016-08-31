import {
    ActionTypes
} from 'redux/lib/createStore';

import {
    createState
} from './state';
import map from './utils/map';

// TODO 提供连接Redux Devtools的中间件。参考： https://github.com/arqex/freezer-redux-devtools

export default function (reducers, options = {}) {
    return (state = {}, action) => {
        switch (action.type) {
            case ActionTypes.INIT:
                var tag = 'Initial state: createState';
                // console.time(tag);
                // console.profile(tag);
                state = createState(state);
                // console.profileEnd();
                // console.timeEnd(tag);
                break;
        }

        map(reducers, (reducer, key) => {
            var tag = 'Reduce state: ' + key + ', ' + action.type;
            // console.time(tag);
            // console.profile(tag);
            if (!state.has(key)) { // No initial value?
                var stateForKey = reducer(undefined, action);
                state = state.set(key, stateForKey);
            } else {
                state = state.update(key, (state) => {
                    return reducer(state, action);
                });
            }
            // console.profileEnd();
            // console.timeEnd(tag);
        });
        return state;
    };
}
