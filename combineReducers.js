import Immutable, {
    hasOwn,
    isFunction
} from '../immutable';
import {
    getFunctionName
} from './object/functions';

// NOTE: Redux Devtools supports performance monitoring
export default function (reducers, options = {}) {
    var immutableOptions = {
        toPlain: (obj) => {
            if (isFunction(obj)) {
                return {$fn: getFunctionName(obj)};
            } else {
                return Object.assign({$class: getFunctionName(obj.constructor)}, obj);
            }
        }
    };

    return (state = {}, action) => {
        state = Immutable.create(state, immutableOptions);

        Object.keys(reducers).forEach((key) => {
            var reducer = reducers[key];
            var path = [key];

            if (!hasOwn(state, key)) { // No initial value?
                var stateForKey = reducer(undefined, action);
                state = state.set(path, stateForKey);
            } else {
                state = state.update(path, (state) => reducer(state, action));
            }
        });
        return Immutable.create(state, immutableOptions);
    };
}
