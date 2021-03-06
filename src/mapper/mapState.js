import invariant from 'invariant';

import Immutable, {
    isBoolean,
    getNodeByPath,
    isConfigurable,
    isWritable,
    isEnumerable,
    hasOwn
} from 'immutable-js';

import instance from '../utils/instance';
import parseRegExp from '../utils/parseRegExp';
import {
    FN_SENTINEL,
    CLASS_SENTINEL,
    hasFnSentinel,
    hasClassSentinel,
    extractFunctionFrom
} from '../utils/toPlain';
import {mutateState} from '../modelizar/actions';
import bindHistory from '../undoable/bindHistory';

import {
    isBoundState,
    getBoundMapper,
    reflectProto
} from './utils';
import {notifyDep} from './observe';

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
    if (!Immutable.same(this.state, state)) {
        throw new Error('Trying to map another different state is not allowed.');
    }
    this.state = state;
};

/**
 * @param {Object} obj
 * @param {Object} root
 */
Mapper.prototype.bind = function (obj, root) {
    if (this.obj || isBoundState(obj)) {
        return;
    }
    reflectProto(obj, this);

    this.obj = obj;

    var reservedKeys = [FN_SENTINEL, CLASS_SENTINEL];
    var state = this.state;
    state.keys()
         .filter((key) => reservedKeys.indexOf(key) < 0)
         .forEach((key) => {
             this.mapping(state, key, root);
         });
};

Mapper.prototype.mapping = function (state, prop, root) {
    var obj = this.obj;
    if (!isConfigurable(obj, prop) || !isEnumerable(obj, prop)) {
        return;
    }

    var property = Object.getOwnPropertyDescriptor(obj, prop);
    var getter = property && property.get;
    var setter = property && property.set;

    var isWritableProp = isWritable(obj, prop);
    var propVal = mapStateToObj(this.store, state.get([prop]), obj[prop], root, this.immutable, (val) => {
        obj[prop] = val;
    });

    Object.defineProperty(obj, prop, {
        enumerable: true,
        configurable: true,
        get: () => {
            // NOTE: Do not accept the value from the original getter,
            // just call it for some reason like observing dependencies collection.
            getter && getter.call(obj);
            return propVal;
        },
        set: (newVal) => {
            if (!this.updating && this.immutable && !this.store.isBatching()) {
                // TODO 开发阶段抛出异常，发布阶段log warning。redux-modelizar提供全局的配置
                throw new Error('Immutable state mapping:'
                                + ' object property assignment is not allowed,'
                                + ' please do this in it\'s prototype methods.');
            }

            if (!isWritableProp || propVal === newVal) {
                return;
            }

            propVal = newVal;
            setter && setter.call(obj, propVal);

            if (!this.updating) {
                this.store.dispatch(mutateState(obj, [prop], propVal));
            }
        }
    });
};

Mapper.prototype.update = function (newState, root) {
    var store = this.store;
    var oldState = this.state;
    if (this.updating
        || Immutable.equals(oldState, newState)
        || !Immutable.same(oldState, newState)) {
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
                if (hasOwn(newState, i)) {
                    this.mapping(newState, i, root);
                }
            }
        }
    } else {
        // Remove redundant properties.
        oldStateKeys.forEach((key) => {
            if (!hasOwn(newState, key) && isConfigurable(obj, key)) {
                delete obj[key];
            }
        });
        // Bind new properties to `obj`
        newStateKeys.forEach((key) => {
            if (!hasOwn(oldState, key)) {
                this.mapping(newState, key, root);
            }
        });
    }

    this.updating = true;
    try {
        newStateKeys.forEach((key) => {
            var oldSubState = oldState.get([key]);
            var newSubState = newState.get([key]);

            if (isWritable(obj, key) && !Immutable.equals(oldSubState, newSubState)) {
                obj[key] = mapStateToObj(store, newSubState, obj[key], root, this.immutable, (sub) => {
                    obj[key] = sub;
                });
            }
        });
        notifyDep(obj);
    } finally {
        this.updating = false;
    }
};

function createRealObj(state, realObj) {
    var obj = realObj;
    if (!Immutable.same(realObj, state)) {
        if (state.isArray()) {
            obj = new Array(state.size());
        } else if (state.isDate()) {
            obj = new Date(state.valueOf());
        } else if (hasClassSentinel(state)) {
            var ctor = extractFunctionFrom(state);
            invariant(
                ctor,
                `No class constructor '${state[CLASS_SENTINEL]}' was registered.`
            );
            obj = instance(ctor);
        } else {
            obj = {};
        }
    }
    Immutable.guid(obj, Immutable.guid(state));

    return obj;
}

function mapStateToObj(store, state, obj, rootObj, immutable, cb) {
    if (!Immutable.isInstance(state)) {
        return state;
    } else if (state.isCycleRef()) {
        var subPath = store.getState().subPath(rootObj, state.valueOf());
        invariant(
            subPath,
            'The cycle reference object isn\'t sub node of the root object.'
        );

        return getNodeByPath(rootObj, subPath);
    } else if (state.isRegExp()) {
        return parseRegExp(state.valueOf());
    } else if (hasFnSentinel(state)) {
        return extractFunctionFrom(state);
    }

    obj = createRealObj(state, obj);
    // Do something (e.g. assignment `obj` to top object)
    // before mapping `state` to `obj` deeply.
    cb && cb(obj);

    var root = rootObj || obj;
    var mapper = getBoundMapper(obj);
    if (!mapper) {
        mapper = new Mapper(store, state, immutable);
        mapper.bind(obj, root);
    } else {
        mapper.update(state, root);
    }

    // Bind history
    if (store.configure.undoable(state)) {
        bindHistory(store, obj, true);
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
export default function (store, newState, oldState, obj, immutable = true) {
    if (isBoolean(obj)) {
        immutable = obj;
        obj = undefined;
    } else if (isBoolean(newState)) {
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
}
