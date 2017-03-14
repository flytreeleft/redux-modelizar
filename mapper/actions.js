import Immutable from '../../immutable';

import {
    REDUX_MODELIZAR_NAMESPACE
} from '../namespace';

export const MUTATE_STATE = REDUX_MODELIZAR_NAMESPACE + '/mapper/MUTATE_STATE';
export const REMOVE_SUB_STATE = REDUX_MODELIZAR_NAMESPACE + '/mapper/REMOVE_SUB_STATE';

/**
 * Add value to new property or set new value to existing property.
 *
 * @param {Object/String} state {@link Immutable} object or GUID of object.
 * @param {String[]} key
 * @param {*} value
 */
export function mutateState(state, key, value) {
    return {
        type: MUTATE_STATE,
        state: Immutable.guid(state),
        key,
        value
    };
}

/**
 * Remove the existing property.
 *
 * @param {Object/String} state {@link Immutable} object or GUID of object.
 * @param {String[]} key
 */
export function removeSubState(state, key) {
    return {
        type: REMOVE_SUB_STATE,
        state: Immutable.guid(state),
        key
    };
}
