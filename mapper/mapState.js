import xor from 'lodash/xor';
import isBoolean from 'lodash/isBoolean';
import isArray from 'lodash/isArray';

import {
    // IS_DATE_SENTINEL,
    createRefObj,
    isRefObj,
    isFunctionObj,
    isDateObj,
    isRegExpObj,
    parseRefKey,
    parseFunction,
    parseDate,
    parseRegExp
} from '../object/sentinels';
import {
    createRealObj
} from '../object/toReal';

import isPrimitive from '../utils/isPrimitive';
import isConfigurable from '../utils/isConfigurable';
import isNullOrUndefined from '../utils/isNullOrUndefined';
import guid, {GUID_SENTINEL} from '../utils/guid';

import {
    invokeInStoreBatch,
    isMappingState,
    isBoundState,
    getMappedState,
    getBoundMapper,
    bindMapper,
    createMappingFunction,
    isMappingFunction
} from './utils';
import {
    overwriteArray,
    overwriteObject
} from './overwrite';
import {
    mutateState
} from './actions';
import observe, {notify} from './observe';

/**
 *         <------------[reflect]-------------
 * (Model)                                     (State)
 *         --[bind]--> (Mapper) --[connect]-->
 */
function Mapper(store, state, immutable, lazy) {
    this.store = store;
    this.state = state;
    this.connected = true;
    this.immutable = immutable !== false;
    this.lazy = lazy === true;

    this._freeze();
}

Mapper.prototype._freeze = function () {
    var state = this.state;
    var store = this.store;

    Object.defineProperties(this, {
        state: {
            configurable: false,
            get: () => state,
            set: (v) => v
        },
        store: {
            configurable: false,
            get: () => store,
            set: (v) => v
        },
        connected: {
            configurable: false,
            get: () => {
                return store.getState().has(state);
            }
        },
        connect: {
            configurable: false,
            value: (newState) => {
                Mapper.prototype.connect.call(this, newState);
                state = newState;
            }
        }
    });
};

Mapper.prototype.connect = function (state) {
    if (!this.state.is(state)) {
        throw new Error('Trying to map another different state is not allowed.');
    }
    this.state = state;
};

/**
 * @param {Object} [obj]
 */
Mapper.prototype.bind = function (obj) {
    // NOTE: One mapper can map to multiple objects.
    if (isPrimitive(obj) || isBoundState(obj)) {
        return;
    }
    bindMapper(obj, this);

    var state = this.state;
    if (state.isArray()) {
        // TODO If the browser doesn't support Array.prototype.__proto__, we should transform the Observer in Vue.js
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto
        overwriteArray(obj);
    } else {
        overwriteObject(obj);
    }

    this.update(obj);
};

Mapper.prototype.subbind = function (obj, prop) {
    if (!isConfigurable(obj, prop)) {
        return;
    }

    var property = Object.getOwnPropertyDescriptor(obj, prop);
    var getter = property && property.get;
    var setter = property && property.set;
    if (isMappingFunction(setter)) {
        return;
    }

    // A flag for avoiding to invoke setter recursively.
    var invokingSetter = false;
    var propVal = mapStateToObj(this.store, this.state.get(prop), obj[prop], this.immutable, false, prop);

    Object.defineProperty(obj, prop, {
        enumerable: true,
        configurable: true,
        get: createMappingFunction(() => {
            if (invokingSetter) {
                return propVal;
            }

            var store = this.store;
            if (this.connected && !store.isBatching()) {
                var state = this.state;
                var subState = state.get(prop);
                var mappedSubState = getMappedState(propVal);

                if (!subState.same(mappedSubState)) {
                    propVal = mapStateToObj(store, subState, propVal, this.immutable, false, prop);
                }
            }
            // NOTE: Do not accept the value from the original getter,
            // just call it for some reason like observing dependencies collection.
            getter && getter.call(obj);

            return propVal;
        }),
        set: createMappingFunction((newVal) => {
            if (newVal === propVal || invokingSetter) {
                return;
            }

            var store = this.store;
            var state = this.state;
            // When current obj is immutable
            // and store doesn't process batching mutations,
            // just return.
            if (this.immutable && !store.isBatching()) {
                // TODO More details and tips
                // TODO 开发阶段抛出异常，发布阶段warning log。redux-modelizar提供全局的配置
                throw new Error('Immutable state');
            }

            propVal = newVal;
            // A nomadic mapper.
            if (!this.connected && !this.lazy) {
                return;
            }

            invokingSetter = true;
            try {
                var subState;
                // Update cross object reference.
                if (isMappingState(propVal)) {
                    subState = getMappedState(propVal);

                    var id = guid(subState.valueOf());
                    store.dispatch(mutateState(state, prop, createRefObj(id)));
                } else {
                    // Make sure the cross object reference can be processed from the root state node.
                    var path = store.getState().path(state).concat(prop);

                    subState = store.getState().set(path, propVal).get(path);
                    store.dispatch(mutateState(state, prop, subState));

                    // NOTE: Mutation can be lazy, the property state maybe hasn't mutated,
                    // so create a mapper to accept the following mutations.
                    if (store.isBatching()) {
                        propVal = mapStateToObj(store, subState, propVal, this.immutable, true, prop);
                    }
                }
                setter && setter.call(obj, propVal);
            } finally {
                invokingSetter = false;
            }
        })
    });
};

Mapper.prototype.observe = function (obj) {
    var store = this.store;
    var unsubscribe = store.subscribe(() => {
        if (!this.connected) {
            !this.lazy && unsubscribe();
            return;
        }

        var store = this.store;
        var state = this.state;
        var path = store.getState().path(state);
        var newState = store.getState().get(path);
        // State has been mutated, update the mapping object.
        if (!newState.same(state)) {
            this.lazy = false;
            this.connect(newState);
            this.update(obj);

            notify(obj);
        }
    });
};

Mapper.prototype.update = function (obj) {
    var state = this.state;
    var stateKeys = state.keys();
    stateKeys.forEach((key) => {
        this.subbind(obj, key);
    });

    // Record global unique id.
    if (isConfigurable(obj, GUID_SENTINEL)) {
        Object.defineProperty(obj, GUID_SENTINEL, {
            enumerable: false,
            configurable: false,
            get: () => guid(this.state.valueOf()),
            set: (v) => v
        });
    }
    // delete obj[IS_DATE_SENTINEL];

    var objKeys = Object.keys(obj);
    if (state.isArray()) {
        let size = state.size();
        if (obj.length > size) {
            Array.prototype.splice.call(obj, size, obj.length - size);
        }
    } else {
        xor(stateKeys, objKeys).forEach((key) => {
            if (isConfigurable(obj, key)) {
                delete obj[key];
            }
        });
    }

    // Observing check for Vue.js
    observe(obj);
};

const cache = new Map();
function mapStateToObj(store, state, obj, immutable, lazy, prop) {
    var val = state.valueOf();
    var id = guid(val);

    if (isPrimitive(val)) {
        return val;
    } else if (isRefObj(val)) {
        id = parseRefKey(val);
        return cache.get(id);
    } else if (isFunctionObj(val)) {
        var fn = parseFunction(val);
        if (!isNullOrUndefined(prop) && !isMappingFunction(fn)) {
            fn = invokeInStoreBatch(`this$${prop}`, fn);
        }
        return fn;
    } else if (isRegExpObj(val)) {
        return parseRegExp(val);
    } else if (isDateObj(val)) {
        // TODO Create a readonly date
        return parseDate(val);
    }

    if (isPrimitive(obj)
        || (isArray(val) && !isArray(obj))
        || (!isArray(val) && isArray(obj))
        || (isBoundState(obj) && id !== guid(obj))) {
        obj = createRealObj(val);
    }
    id && cache.set(id, obj);

    var mapper = getBoundMapper(obj);
    if (!mapper) {
        mapper = new Mapper(store, state, immutable, lazy);
        mapper.bind(obj);
    }
    if (mapper.connected || mapper.lazy) {
        mapper.observe(obj);
    }

    return obj;
}

/**
 * @param {Object} store
 * @param {Object} [state] If no specified, map the root state.
 * @param {*} [obj] The target of state mapping.
 * @param {Boolean} [immutable=true]
 * @return {*} Type depends on `state`.
 */
export default function (store, state, obj, immutable = true) {
    if (isBoolean(obj)) {
        immutable = obj;
        obj = undefined;
    } else if (isBoolean(state)) {
        immutable = state;
        obj = undefined;
        state = undefined;
    }

    if (!state) {
        state = store.getState();
    }

    return mapStateToObj(store, state, obj, immutable, false);
}
