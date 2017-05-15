import {
    guid,
    isPrimitive
} from 'immutable-js';

import {
    REDUX_MODELIZAR
} from '../namespace';

export const REDUX_MODELIZAR_STATE = REDUX_MODELIZAR + '/state';
export const MUTATE_STATE = REDUX_MODELIZAR_STATE + '/MUTATE_STATE';
export const REMOVE_SUB_STATE = REDUX_MODELIZAR_STATE + '/REMOVE_SUB_STATE';
export const BATCH_MUTATE = REDUX_MODELIZAR_STATE + '/BATCH_MUTATE';

/**
 * Add value to new property or set new value to existing property.
 *
 * @param {Object/String} state {@link Immutable} object or GUID of object.
 * @param {String[]/String} key Path array or string which is split by `.`.
 * @param {*} value
 */
export function mutateState(state, key, value) {
    return {
        type: MUTATE_STATE,
        $target: isPrimitive(state) ? state : guid(state),
        key,
        value
    };
}

/**
 * Remove the existing property.
 *
 * @param {Object/String} state {@link Immutable} object or GUID of object.
 * @param {String[]/String} key Path array or string which is split by `.`.
 */
export function removeSubState(state, key) {
    return {
        type: REMOVE_SUB_STATE,
        $target: isPrimitive(state) ? state : guid(state),
        key
    };
}

export function batchMutateState(actions, meta) {
    return {
        type: BATCH_MUTATE,
        meta,
        actions
    };
}
