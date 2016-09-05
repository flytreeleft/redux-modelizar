import {
    REDUX_MODELIZAR_NAMESPACE
} from '../namespace';

export const MODEL_STATE_MUTATE = REDUX_MODELIZAR_NAMESPACE + '/MODEL_STATE_MUTATE';

export function mutateState(target, patch, method) {
    return {
        type: MODEL_STATE_MUTATE,
        method,
        $target: target,
        $patch: patch
    };
}
