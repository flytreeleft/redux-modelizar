'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = enableReduxDevTools;

var _immutableJs = require('immutable-js');

var _immutableJs2 = _interopRequireDefault(_immutableJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/arqex/freezer-redux-devtools
// https://github.com/gaearon/redux-devtools
// https://github.com/zalmoxisus/redux-devtools-extension
// http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
function enableReduxDevTools() {
    var extension = window.__REDUX_DEVTOOLS_EXTENSION__ || window.devToolsExtension;

    return extension ? extension({
        // Adapt to Redux Dev Tools v2.12+
        serialize: {
            // Convert to JSON object
            replacer: function replacer(key, value) {
                return value;
            },
            // Convert to State object
            reviver: function reviver(key, value) {
                return _immutableJs2.default.isImmutable(value) ? value : _immutableJs2.default.create(value);
            }
        },
        // NOTE: In the latest version, (de)serializeState are replaced by serialize
        // See https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
        deserializeState: function deserializeState(state) {
            return _immutableJs2.default.isImmutable(state) ? state : _immutableJs2.default.create(state);
        },
        serializeState: function serializeState(key, value) {
            return value;
        }
    }) : function (f) {
        return f;
    };
}
module.exports = exports['default'];