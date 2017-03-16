import {
    REDUX_MODELIZAR
} from '../namespace';

export const MODEL_STATE_MUTATE = REDUX_MODELIZAR + '/MODEL_STATE_MUTATE';
export const BATCH_MUTATE = REDUX_MODELIZAR + '/BATCH_MUTATE';

export function mutateState(target, patch, method) {
    return {
        type: MODEL_STATE_MUTATE,
        method,
        $target: target,
        $patch: patch
    };
}

export function batchMutateState(actions, meta) {
    return {
        type: BATCH_MUTATE,
        meta,
        actions
    };
}
