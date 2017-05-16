'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (store, newState, oldState, obj) {
    var immutable = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

    if ((0, _immutableJs.isBoolean)(obj)) {
        immutable = obj;
        obj = undefined;
    } else if ((0, _immutableJs.isBoolean)(newState)) {
        immutable = newState;
        obj = undefined;
        newState = undefined;
        oldState = undefined;
    }

    if (!newState) {
        newState = store.getState();
    }
    // TODO Compare new and old, then update the differences.

    return mapStateToObj(store, newState, obj, null, immutable);
};

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _immutableJs = require('immutable-js');

var _immutableJs2 = _interopRequireDefault(_immutableJs);

var _instance = require('../utils/instance');

var _instance2 = _interopRequireDefault(_instance);

var _parseRegExp = require('../utils/parseRegExp');

var _parseRegExp2 = _interopRequireDefault(_parseRegExp);

var _toPlain = require('../utils/toPlain');

var _actions = require('../modelizar/actions');

var _bindHistory = require('../undoable/bindHistory');

var _bindHistory2 = _interopRequireDefault(_bindHistory);

var _utils = require('./utils');

var _observe = require('./observe');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *         <------------[reflect]-------------
 * (Model)                                     (State)
 *         --[bind]--> (Mapper) --[connect]-->
 *
 * NOTE: An object only can map the different statuses of the same state.
 * Immutable state instances will have the same GUID if they represent the same state.
 */
function Mapper(store, state, immutable) {
    this.store = store;
    this.state = state;
    this.obj = null;
    this.immutable = immutable !== false;
    this.updating = false;
}

Mapper.prototype.connect = function (state) {
    if (!_immutableJs2.default.same(this.state, state)) {
        throw new Error('Trying to map another different state is not allowed.');
    }
    this.state = state;
};

/**
 * @param {Object} obj
 * @param {Object} root
 */
Mapper.prototype.bind = function (obj, root) {
    var _this = this;

    if (this.obj || (0, _utils.isBoundState)(obj)) {
        return;
    }
    (0, _utils.reflectProto)(obj, this);

    this.obj = obj;

    var reservedKeys = [_toPlain.FN_SENTINEL, _toPlain.CLASS_SENTINEL];
    var state = this.state;
    state.keys().filter(function (key) {
        return reservedKeys.indexOf(key) < 0;
    }).forEach(function (key) {
        _this.mapping(state, key, root);
    });
};

Mapper.prototype.mapping = function (state, prop, root) {
    var _this2 = this;

    var obj = this.obj;
    if (!(0, _immutableJs.isConfigurable)(obj, prop) || !(0, _immutableJs.isEnumerable)(obj, prop)) {
        return;
    }

    var property = Object.getOwnPropertyDescriptor(obj, prop);
    var getter = property && property.get;
    var setter = property && property.set;

    var isWritableProp = (0, _immutableJs.isWritable)(obj, prop);
    var propVal = mapStateToObj(this.store, state.get([prop]), obj[prop], root, this.immutable, function (val) {
        obj[prop] = val;
    });

    Object.defineProperty(obj, prop, {
        enumerable: true,
        configurable: true,
        get: function get() {
            // NOTE: Do not accept the value from the original getter,
            // just call it for some reason like observing dependencies collection.
            getter && getter.call(obj);
            return propVal;
        },
        set: function set(newVal) {
            if (!_this2.updating && _this2.immutable && !_this2.store.isBatching()) {
                // TODO 开发阶段抛出异常，发布阶段log warning。redux-modelizar提供全局的配置
                throw new Error('Immutable state mapping:' + ' object property assignment is not allowed,' + ' please do this in it\'s prototype methods.');
            }

            if (!isWritableProp || propVal === newVal) {
                return;
            }

            propVal = newVal;
            setter && setter.call(obj, propVal);

            if (!_this2.updating) {
                _this2.store.dispatch((0, _actions.mutateState)(obj, [prop], propVal));
            }
        }
    });
};

Mapper.prototype.update = function (newState, root) {
    var _this3 = this;

    var store = this.store;
    var oldState = this.state;
    if (this.updating || _immutableJs2.default.equals(oldState, newState) || !_immutableJs2.default.same(oldState, newState)) {
        return;
    }
    this.connect(newState);

    var obj = this.obj;

    var oldStateKeys = oldState.keys().sort();
    var newStateKeys = newState.keys().sort();
    if (newState.isArray()) {
        var oldSize = oldState.size();
        var newSize = newState.size();

        if (oldSize > newSize) {
            Array.prototype.splice.call(obj, newSize, oldSize - newSize);
        } else if (oldSize < newSize) {
            for (var i = oldSize; i < newSize; i++) {
                if ((0, _immutableJs.hasOwn)(newState, i)) {
                    this.mapping(newState, i, root);
                }
            }
        }
    } else {
        // Remove redundant properties.
        oldStateKeys.forEach(function (key) {
            if (!(0, _immutableJs.hasOwn)(newState, key) && (0, _immutableJs.isConfigurable)(obj, key)) {
                delete obj[key];
            }
        });
        // Bind new properties to `obj`
        newStateKeys.forEach(function (key) {
            if (!(0, _immutableJs.hasOwn)(oldState, key)) {
                _this3.mapping(newState, key, root);
            }
        });
    }

    this.updating = true;
    try {
        newStateKeys.forEach(function (key) {
            var oldSubState = oldState.get([key]);
            var newSubState = newState.get([key]);

            if ((0, _immutableJs.isWritable)(obj, key) && !_immutableJs2.default.equals(oldSubState, newSubState)) {
                obj[key] = mapStateToObj(store, newSubState, obj[key], root, _this3.immutable, function (sub) {
                    obj[key] = sub;
                });
            }
        });
        (0, _observe.notifyDep)(obj);
    } finally {
        this.updating = false;
    }
};

function createRealObj(state, realObj) {
    var obj = realObj;
    if (!_immutableJs2.default.same(realObj, state)) {
        if (state.isArray()) {
            obj = new Array(state.size());
        } else if (state.isDate()) {
            obj = new Date(state.valueOf());
        } else if ((0, _toPlain.hasClassSentinel)(state)) {
            var ctor = (0, _toPlain.extractFunctionFrom)(state);
            (0, _invariant2.default)(ctor, 'No class constructor \'' + state[_toPlain.CLASS_SENTINEL] + '\' was registered.');
            obj = (0, _instance2.default)(ctor);
        } else {
            obj = {};
        }
    }
    _immutableJs2.default.guid(obj, _immutableJs2.default.guid(state));

    return obj;
}

function mapStateToObj(store, state, obj, rootObj, immutable, cb) {
    if (!_immutableJs2.default.isInstance(state)) {
        return state;
    } else if (state.isCycleRef()) {
        var subPath = store.getState().subPath(rootObj, state.valueOf());
        (0, _invariant2.default)(subPath, 'The cycle reference object isn\'t sub node of the root object.');

        return (0, _immutableJs.getNodeByPath)(rootObj, subPath);
    } else if (state.isRegExp()) {
        return (0, _parseRegExp2.default)(state.valueOf());
    } else if ((0, _toPlain.hasFnSentinel)(state)) {
        return (0, _toPlain.extractFunctionFrom)(state);
    }

    obj = createRealObj(state, obj);
    // Do something (e.g. assignment `obj` to top object)
    // before mapping `state` to `obj` deeply.
    cb && cb(obj);

    var root = rootObj || obj;
    var mapper = (0, _utils.getBoundMapper)(obj);
    if (!mapper) {
        mapper = new Mapper(store, state, immutable);
        mapper.bind(obj, root);
    } else {
        mapper.update(state, root);
    }

    // Bind history
    if (store.configure.undoable(state)) {
        (0, _bindHistory2.default)(store, obj, true);
    }
    return obj;
}

/**
 * @param {Object} store
 * @param {Immutable} [newState]
 * @param {Immutable} [oldState]
 * @param {*} [obj] The target of state mapping.
 * @param {Boolean} [immutable=true]
 * @return {*} Type depends on `state`.
 */
module.exports = exports['default'];