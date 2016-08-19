import invariant from 'invariant';

import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';

import {
    MODEL_STATE_MUTATE
} from './actions';
import {
    mutation
} from './reducer';

export default function modelizar(reducer, options = {}) {
    return (state, action = {}) => {
        switch (action.type) {
            case MODEL_STATE_MUTATE:
                invariant(isObject(action.state) && !isArray(action.state),
                    'Expect the parameter "action.state" is Object(except Array).'
                    + ' But received ' + action.state);

                return mutation(state, action, options);
            default:
                return reducer(state, action);
        }
    };
}
