'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BATCH_MUTATE = exports.REMOVE_SUB_STATE = exports.MUTATE_STATE = exports.REDUX_MODELIZAR_STATE = undefined;
exports.mutateState = mutateState;
exports.removeSubState = removeSubState;
exports.batchMutateState = batchMutateState;

var _immutableJs = require('immutable-js');

var _namespace = require('../namespace');

var REDUX_MODELIZAR_STATE = exports.REDUX_MODELIZAR_STATE = _namespace.REDUX_MODELIZAR + '/state';
var MUTATE_STATE = exports.MUTATE_STATE = REDUX_MODELIZAR_STATE + '/MUTATE_STATE';
var REMOVE_SUB_STATE = exports.REMOVE_SUB_STATE = REDUX_MODELIZAR_STATE + '/REMOVE_SUB_STATE';
var BATCH_MUTATE = exports.BATCH_MUTATE = REDUX_MODELIZAR_STATE + '/BATCH_MUTATE';

/**
 * Add value to new property or set new value to existing property.
 *
 * @param {Object/String} state {@link Immutable} object or GUID of object.
 * @param {String[]/String} key Path array or string which is split by `.`.
 * @param {*} value
 */
function mutateState(state, key, value) {
    return {
        type: MUTATE_STATE,
        $target: (0, _immutableJs.isPrimitive)(state) ? state : (0, _immutableJs.guid)(state),
        key: key,
        value: value
    };
}

/**
 * Remove the existing property.
 *
 * @param {Object/String} state {@link Immutable} object or GUID of object.
 * @param {String[]/String} key Path array or string which is split by `.`.
 */
function removeSubState(state, key) {
    return {
        type: REMOVE_SUB_STATE,
        $target: (0, _immutableJs.isPrimitive)(state) ? state : (0, _immutableJs.guid)(state),
        key: key
    };
}

function batchMutateState(actions, meta) {
    return {
        type: BATCH_MUTATE,
        meta: meta,
        actions: actions
    };
}