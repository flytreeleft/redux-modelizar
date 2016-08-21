import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import cloneWith from 'lodash/cloneWith';
import find from 'lodash/find';

import {
    isImmutableMap,
    isImmutableList,
    isImmutable,
    is
} from '../utils/lang';
import {
    MODEL_STATE_MUTATE
} from './actions';
import undoable from '../undoable';

function map(obj, mapper) {
    // TODO Receive Object, Array, Immutable.Map, Immutable.List
    // TODO If no change happened, return the original reference, otherwise return a new reference.
}

function mutateByMap(state, action, histories) {
    var changed = false;
    var newState = state.map(value => {
        var newValue = mutation(value, action, histories);
        !changed && (changed = newValue !== value);

        return newValue;
    });

    return changed ? newState : state;
}

function mutateImmutableMap(state, action, histories) {
    return mutateByMap(state, action, histories);
}

function mutateImmutableList(state, action, histories) {
    return mutateByMap(state, action, histories);
}

function mutateArray(state, action, histories) {
    return mutateByMap(state, action, histories);
}

function mutateObject(state, action, histories) {
    var changed = false;
    var newState = cloneWith(state, value => {
        if (value === state) {
            return;
        }

        var newValue = mutation(value, action, histories);
        !changed && (changed = newValue !== value);

        return newValue;
    });

    return changed ? newState : state;
}

function mutate(state, action, histories) {
    switch (action.type) {
        case MODEL_STATE_MUTATE:
            var target = action.$state;
            if (!is(state, target)) {
                break;
            }
            if (state !== target && isImmutable(state)) {
                return state.constructor().mergeDeep(target);
            } else {
                return target;
            }
    }

    if (isImmutableMap(state)) {
        return mutateImmutableMap(state, action, histories);
    }
    else if (isImmutableList(state)) {
        return mutateImmutableList(state, action, histories);
    }
    else if (isArray(state)) {
        return mutateArray(state, action, histories);
    }
    else if (isPlainObject(state)) {
        return mutateObject(state, action, histories);
    }
    return state;
}

export function mutation(state, action = {}, histories) {
    var history = find(histories, history => {
        return history.filter(state, action);
    });

    if (history) {
        // Dynamically create undoable reducer wrapper.
        return undoable((state, action) => {
            return mutate(state, action, histories);
        }, history.options)(state, action);
    } else {
        return mutate(state, action, histories);
    }
}
