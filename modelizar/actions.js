import {
    REDUX_MODELIZAR_NAMESPACE
} from '../namespace';

export const MODEL_STATE_MUTATE = REDUX_MODELIZAR_NAMESPACE + '/MODEL_STATE_MUTATE';

export function mutateState(state, method) {
    return {
        type: MODEL_STATE_MUTATE,
        method,
        state
    };
}
