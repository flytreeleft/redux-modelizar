import {guid, isPrimitive} from '../../immutable';

import {
    REDUX_MODELIZAR
} from '../namespace';

export const REDUX_MODELIZAR_MAPPER = REDUX_MODELIZAR + '/mapper';
export const MUTATE_STATE = REDUX_MODELIZAR_MAPPER + '/MUTATE_STATE';
export const REMOVE_SUB_STATE = REDUX_MODELIZAR_MAPPER + '/REMOVE_SUB_STATE';

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
