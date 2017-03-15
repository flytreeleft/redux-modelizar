import {extractPath} from '../../immutable';

import {
    MUTATE_STATE,
    REMOVE_SUB_STATE
} from './actions';

export function mapper(reducer) {
    return (state, action = {}) => {
        switch (action.type) {
            case MUTATE_STATE:
            case REMOVE_SUB_STATE:
                var path = state.path(action.state);
                if (path) {
                    var subPath = extractPath(action.key);
                    path = path.concat(subPath);
                    state = action.type === REMOVE_SUB_STATE
                        ? state.remove(path)
                        : state.set(path, action.value);
                }
                break;
            default:
                state = reducer(state, action);
        }
        return state;
    };
}
