import invariant from 'invariant';

import isBoolean from 'lodash/isBoolean';

import Immutable, {
    getNodeByPath,
    isConfigurable,
    isWritable
} from '../../immutable';

import forEach from '../utils/forEach';
import instance from '../utils/instance';

import {
    getFunctionByName
} from '../object/functions';
import {
    isBoundState,
    getBoundMapper,
    reflectProto
} from './utils';
import {
    mutateState
} from './actions';

/**
 *         <------------[reflect]-------------
 * (Model)                                     (State)
 *         --[bind]--> (Mapper) --[connect]-->
 *
 * NOTE: An object only can map the different statuses of the same state.
 * Immutable state instances will have the same guid
 * if they represent the same state.
 */
function Mapper(store, state, immutable) {
    this.store = store;
    this.state = state;
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
    if (isBoundState(obj)) {
        return;
    }
    reflectProto(obj, this);

    var reservedKeys = ['$fn', '$class'];
    var state = this.state;
    state.keys()
         .filter((key) => reservedKeys.indexOf(key) < 0)
         .forEach((key) => {
             this.mapping(state, obj, key, root);
         });
};

Mapper.prototype.mapping = function (state, obj, prop, root) {
    if (!isConfigurable(obj, prop)) {
        return;
    }

    var property = Object.getOwnPropertyDescriptor(obj, prop);
    var getter = property && property.get;
    var setter = property && property.set;

    var propVal = mapStateToObj(this.store, state.get([prop]), obj[prop], root, this.immutable);

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

            if (propVal === newVal) {
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

var toMap = (result, key) => (result[key] = true) && result;
Mapper.prototype.update = function (newState, obj, root) {
    var store = this.store;
    var oldState = this.state;
    if (this.updating
        || Immutable.equals(oldState, newState)
        || !Immutable.same(oldState, newState)) {
        return;
    }
    this.connect(newState);

    var oldStateKeys = oldState.keys().reduce(toMap, {});
    var newStateKeys = newState.keys().reduce(toMap, {});
    if (newState.isArray()) {
        var oldSize = oldState.size();
        var newSize = newState.size();

        if (oldSize > newSize) {
            Array.prototype.splice.call(obj, newSize, oldSize - newSize);
        } else if (oldSize < newSize) {
            for (var i = oldSize; i < newSize; i++) {
                this.mapping(newState, obj, i, root);
            }
        }
    } else {
        // Remove redundant properties.
        forEach(oldStateKeys, (existing, key) => {
            if (!newStateKeys[key] && isConfigurable(obj, key)) {
                delete obj[key];
            }
        });
        // Bind new properties to `obj`
        forEach(newStateKeys, (existing, key) => {
            if (!oldStateKeys[key]) {
                this.mapping(newState, obj, key, root);
            }
        });
    }

    try {
        this.updating = true;
        forEach(newStateKeys, (existing, key) => {
            var oldSubState = oldState.get([key]);
            var newSubState = newState.get([key]);

            if (isWritable(obj, key) && !Immutable.equals(oldSubState, newSubState)) {
                obj[key] = mapStateToObj(store, newSubState, obj[key], root, this.immutable);
            }
        });
    } finally {
        this.updating = false;
    }
};

function parseRegExp(exp) {
    if (typeof exp === 'string' && /^\/.+\/([igm]*)$/.test(exp)) {
        // NOTE: Avoid xss attack
        return new Function(`return ${exp};`)();
    } else {
        return null;
    }
}

function createRealObj(state, realObj) {
    var obj = realObj;
    if (!Immutable.same(realObj, state)) {
        if (state.isArray()) {
            obj = new Array(state.size());
        } else if (state.isDate()) {
            obj = new Date(state.valueOf());
        } else if (state.$class) {
            var ctor = getFunctionByName(state.$class);
            invariant(
                ctor,
                `No class constructor '${state.$class}' was registered.`
            );
            obj = instance(ctor);
        } else {
            obj = {};
        }
    }
    Immutable.guid(obj, Immutable.guid(state));

    return obj;
}

function mapStateToObj(store, state, obj, rootObj, immutable) {
    if (!Immutable.isInstance(state)) {
        return state;
    } else if (state.isCycleRef()) {
        var refObjPath = store.getState().path(state.valueOf());
        var realRootPath = store.getState().path(rootObj);
        for (let i = 0; i < realRootPath; i++) {
            invariant(
                /* eslint-disable eqeqeq */
                realRootPath[i] == refObjPath[i],
                /* eslint-enable eqeqeq */
                'The cycle reference object isn\'t in the same root.'
            );
        }

        return getNodeByPath(rootObj, refObjPath.slice(realRootPath.length));
    } else if (state.isRegExp()) {
        return parseRegExp(state.valueOf());
    } else if (state.$fn) {
        return getFunctionByName(state.$fn);
    }

    obj = createRealObj(state, obj);

    var mapper = getBoundMapper(obj);
    if (!mapper) {
        mapper = new Mapper(store, state, immutable);
        mapper.bind(obj, rootObj || obj);
    } else {
        mapper.update(state, obj, rootObj || obj);
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

    return mapStateToObj(store, newState, obj, obj, immutable);
}
