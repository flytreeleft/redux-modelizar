import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

import traverse from '../object/traverse';
import forEach from '../utils/forEach';
import {
    parseObjClass
} from '../object/sentinels';

import {
    MODEL_STATE_MUTATE
} from './actions';
import undoable from '../undoable';
import {
    getHistory
} from '../undoable/reducer';
import {
    init
} from '../undoable/actions';

const emptyReducer = (state, action) => state;
// undoable undo/redo/batching/clear时会指定目标，通过目标找到path并调用undoable更新该目标的状态
// undoable insert仅在有更新时发生，其仅需拦截更新path上的节点即可
function undoableMutate(state, action = {}, filter = () => false, rootState) {
    var target = state.valueOf();
    var opts = filter(state, action, parseObjClass(target));

    if (opts) {
        opts = isObject(opts) ? opts : {};
        // NOTE: `state` already be mutated,
        // so trigger initializing history
        // by passing the original state in `rootState`.
        if (!getHistory(target)) {
            var path = rootState.path(target);
            var oldState = rootState.get(path);
            undoable(emptyReducer, opts)(oldState, init(target));
        }
        return undoable(emptyReducer, opts)(state, action);
    } else {
        return state;
    }
}

const compare = {
    /** Ascending order */
    numerically: function (a, b) {
        return a - b;
    },
    /** Ascending order */
    numericallyBy: function (name) {
        return function (a, b) {
            return a[name] - b[name];
        };
    }
};
function mutate(state, action) {
    var newState = state;
    var refs = new Map([[action.$patch, []]]);
    traverse(action.$patch, (delta, deltaTop, prop) => {
        if (deltaTop === undefined || (prop === '_t' && delta === 'a')) {
            return;
        }

        var paths = refs.get(deltaTop).concat([prop]);
        if (!isArray(delta)) {
            if (delta._t === 'a') {
                var toRemove = [];
                var toInsert = [];
                forEach(delta, (delta, key) => {
                    if (key !== '_t') {
                        if (key[0] === '_') {
                            var index = parseInt(key.slice(1), 10);
                            toRemove.push(index);
                            if (delta[2] === 3) { // moving
                                toInsert.push({
                                    index: delta[1],
                                    source: index
                                });
                            }
                        } else if (delta.length === 1) { // insertion
                            toInsert.push({
                                index: parseInt(key, 10)
                            });
                        }
                        // Element changing will be processed in next traversing.
                    }
                });
                // Removing elements by descending order to avoid sawing our own floor.
                // NOTE: Using `.remove` maybe faster than using `.filter`
                // when the state contains huge number data.
                toRemove.sort(compare.numerically).reverse().forEach((index) => {
                    newState = newState.remove(paths.concat([index]));
                });
                // Inserting new elements by ascending order.
                toInsert.sort(compare.numericallyBy('index')).forEach((insertion) => {
                    var index = insertion.index;
                    var el;
                    if (insertion.source === undefined) { // insertion
                        el = delta[index][0];
                    } else { // moving
                        var srcPaths = paths.concat([insertion.source]);
                        el = state.get(srcPaths);
                    }
                    newState = newState.update(paths, (state) => {
                        return state.insert(index, [el]);
                    });
                });
            }

            refs.set(delta, paths);
            return;
        }

        // Object property removing, adding or changing.
        if (deltaTop._t !== 'a') {
            if (delta.length <= 2) {
                newState = newState.set(paths, delta[delta.length - 1]);
            } else if (delta[2] === 0) {
                newState = newState.remove(paths);
            }
        }
        return false;
    });
    return newState;
}

export function mutation(state, action = {}, options = {}) {
    var target = action.$target;
    var path = state.path(target);
    var rootState = state;

    switch (action.type) {
        case MODEL_STATE_MUTATE:
            return state.update(path, (state) => {
                return mutate(state, action);
            }, (state) => {
                return undoableMutate(state, action, options.undoable, rootState);
            });
        default:
            return state.update(path, (state) => {
                return undoableMutate(state, action, options.undoable, rootState);
            });
    }
}
