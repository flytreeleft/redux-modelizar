import {
    createState,
    isState
} from './state';
import map from './utils/map';

export default function (reducers, options = {}) {
    return (state = {}, action) => {
        if (!isState(state)) {
            var tag = 'Initialize state';
            console.time(tag);
            // console.profile(tag);
            state = createState(state);
            // console.profileEnd();
            console.timeEnd(tag);
        }

        map(reducers, (reducer, key) => {
            var tag = 'Reduce state: ' + key + ', ' + action.type;
            console.time(tag);
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
            console.timeEnd(tag);
        });
        return state;
    };
}
