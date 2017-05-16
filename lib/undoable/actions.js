'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UNDOABLE_END_BATCH = exports.UNDOABLE_START_BATCH = exports.UNDOABLE_CLEAR = exports.UNDOABLE_REDO = exports.UNDOABLE_UNDO = exports.UNDOABLE_INIT = exports.REDUX_MODELIZAR_UNDOABLE = undefined;
exports.init = init;
exports.undo = undo;
exports.redo = redo;
exports.clear = clear;
exports.startBatch = startBatch;
exports.endBatch = endBatch;

var _namespace = require('../namespace');

var REDUX_MODELIZAR_UNDOABLE = exports.REDUX_MODELIZAR_UNDOABLE = _namespace.REDUX_MODELIZAR + '/undoable';
var UNDOABLE_INIT = exports.UNDOABLE_INIT = REDUX_MODELIZAR_UNDOABLE + '/INIT';
var UNDOABLE_UNDO = exports.UNDOABLE_UNDO = REDUX_MODELIZAR_UNDOABLE + '/UNDO';
var UNDOABLE_REDO = exports.UNDOABLE_REDO = REDUX_MODELIZAR_UNDOABLE + '/REDO';
var UNDOABLE_CLEAR = exports.UNDOABLE_CLEAR = REDUX_MODELIZAR_UNDOABLE + '/CLEAR';
var UNDOABLE_START_BATCH = exports.UNDOABLE_START_BATCH = REDUX_MODELIZAR_UNDOABLE + '/START_BATCH';
var UNDOABLE_END_BATCH = exports.UNDOABLE_END_BATCH = REDUX_MODELIZAR_UNDOABLE + '/END_BATCH';

function init(target) {
    return {
        type: UNDOABLE_INIT,
        $target: target
    };
}

function undo(target, count) {
    return {
        type: UNDOABLE_UNDO,
        $target: target,
        count: count
    };
}

function redo(target, count) {
    return {
        type: UNDOABLE_REDO,
        $target: target,
        count: count
    };
}

function clear(target) {
    return {
        type: UNDOABLE_CLEAR,
        $target: target
    };
}

function startBatch(target) {
    return {
        type: UNDOABLE_START_BATCH,
        $target: target
    };
}

function endBatch(target) {
    return {
        type: UNDOABLE_END_BATCH,
        $target: target
    };
}