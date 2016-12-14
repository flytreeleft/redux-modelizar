import {
    REDUX_MODELIZAR_NAMESPACE
} from '../namespace';

export const MUTATE_STATE = REDUX_MODELIZAR_NAMESPACE + '/mapper/MUTATE_STATE';
export const REMOVE_SUB_STATE = REDUX_MODELIZAR_NAMESPACE + '/mapper/REMOVE_SUB_STATE';

export function mutateState(state, key, value) {
    return {
        type: MUTATE_STATE,
        state,
        key,
        value
    };
}

export function removeSubState(state, key) {
    return {
        type: REMOVE_SUB_STATE,
        state,
        key
    };
}
