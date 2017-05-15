import Immutable, {hasOwn} from 'immutable';

// NOTE: Redux Devtools supports performance monitoring
export default function (reducers) {
    return (state = {}, action) => {
        // NOTE: The initial state will be made as an immutable in `createStore`.
        Object.keys(reducers).forEach((key) => {
            var reducer = reducers[key];
            var path = [key];

            if (!hasOwn(state, key)) { // No initial value?
                var stateForKey = reducer(undefined, action);

                if (Immutable.isInstance(state)) {
                    state = state.set(path, stateForKey);
                } else {
                    state[key] = stateForKey;
                }
            } else {
                state = state.update(path, (state) => reducer(state, action));
            }
        });
        return state;
    };
}
