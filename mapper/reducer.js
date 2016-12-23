import {
    MUTATE_STATE,
    REMOVE_SUB_STATE
} from './actions';

export function mapper(reducer) {
    return (state, action = {}) => {
        var path;
        switch (action.type) {
            case MUTATE_STATE:
                path = state.path(action.state);
                return path ? state.set(path.concat(action.key), action.value) : state;
            case REMOVE_SUB_STATE:
                path = state.path(action.state);
                return path ? state.remove(path.concat(action.key)) : state;
            default:
                return reducer(state, action);
        }
    };
}
