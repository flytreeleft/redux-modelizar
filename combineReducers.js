import {
    createState,
    isState
} from './state';
import map from './utils/map';

// NOTE: Redux Devtools supports performance monitoring
export default function (reducers, options = {}) {
    return (state = {}, action = {}) => {
        if (!isState(state)) {
            state = createState(state);
        }

        map(reducers, (reducer, key) => {
            if (!state.has(key)) { // No initial value?
                var stateForKey = reducer(undefined, action);
                state = state.set(key, stateForKey);
            } else {
                state = state.update(key, (state) => {
                    return reducer(state, action);
                });
            }
        });
        return state;
    };
}
