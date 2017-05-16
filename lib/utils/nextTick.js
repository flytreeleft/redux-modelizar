'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Source: https://github.com/arqex/freezer/blob/master/src/utils.js#L74
 */
var queue = [];
var dirty = false;
var fn;
var hasPostMessage = !!global.postMessage && typeof Window !== 'undefined' && global instanceof Window;
var messageName = 'nexttick';

var trigger;
var processQueue;
var flushQueue = function flushQueue() {
    do {
        fn = queue.shift();
        fn && fn();
    } while (fn);
    dirty = false;
};

if (hasPostMessage) {
    trigger = function trigger() {
        global.postMessage(messageName, '*');
    };
    processQueue = function processQueue(event) {
        if (event.source === global && event.data === messageName) {
            event.stopPropagation();
            flushQueue();
        }
    };
} else {
    trigger = function trigger() {
        setTimeout(function () {
            processQueue();
        }, 0);
    };
    processQueue = flushQueue;
}

var nextTick = function nextTick(fn) {
    queue.push(fn);
    if (dirty) {
        return;
    }
    dirty = true;
    trigger();
};

if (hasPostMessage) {
    global.addEventListener('message', processQueue, true);
}
nextTick.removeListener = function () {
    global.removeEventListener('message', processQueue, true);
};

exports.default = nextTick;
module.exports = exports['default'];