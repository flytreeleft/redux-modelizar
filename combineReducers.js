import {
    createState,
    isState
} from './state';
import map from './utils/map';
import valueOf from './utils/valueOf';

// TODO 提供性能监控中间件，打印每次action的时间消耗
export default function (reducers, options = {}) {
    return (state = {}, action) => {
        if (!isState(state)) {
            var tag = 'Initialize state';
            options.debug && console.time(tag);
            // options.debug && console.profile(tag);
            state = createState(state);
            // options.debug && console.profileEnd();
            options.debug && console.timeEnd(tag);
        }

        map(reducers, (reducer, key) => {
            var tag = 'Reduce state: ' + key + ', ' + action.type;
            options.debug && console.time(tag);
            // options.debug && console.profile(tag);
            if (!state.has(key)) { // No initial value?
                var stateForKey = reducer(undefined, action);
                state = state.set(key, valueOf(stateForKey));
            } else {
                state = state.update(key, (state) => {
                    return reducer(state, action);
                });
            }
            // options.debug && console.profileEnd();
            options.debug && console.timeEnd(tag);
        });
        return state;
    };
}
