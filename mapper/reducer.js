import {
    MUTATE_STATE,
    REMOVE_SUB_STATE
} from './actions';

export function mapper(reducer) {
    return (state, action = {}) => {
        var path;
        switch (action.type) {
            case MUTATE_STATE:
                path = state.path(action.state).concat(action.key);
                return state.set(path, action.value);
            case REMOVE_SUB_STATE:
                path = state.path(action.state).concat(action.key);
                return state.remove(path);
            default:
                return reducer(state, action);
        }
    };
}
