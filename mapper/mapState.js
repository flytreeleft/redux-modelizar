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
import guid from '../utils/guid';

import {
    invokeInStoreBatch,
    isMappingState,
    isBoundState,
    getMappedState,
    getBoundMapper,
    bindMapper,
    createMappingFunction,
    isMappingFunction,
    shallowEqual
} from './utils';
import {
    overwriteArray,
    overwriteObject
} from './overwrite';
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
    if (isPrimitive(obj) || isBoundState(obj)) {
        return;
    }
    bindMapper(obj, this);

    if (isArray(obj)) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto
        overwriteArray(obj);
    } else {
        overwriteObject(obj);
    }
    this.cache(obj);

    var state = this.state;
    state.keys().forEach((key) => {
        this.mapping(obj, key);
    });
};

Mapper.prototype.mapping = function (obj, prop) {
    if (!isConfigurable(obj, prop)) {
        return;
    }

    var property = Object.getOwnPropertyDescriptor(obj, prop);
    var getter = property && property.get;
    var setter = property && property.set;
    if (isMappingFunction(setter)) {
        return;
    }

    var invokingSetter = false;
    var propVal = mapStateToObj(this.store, this.state.get(prop), obj[prop], this.immutable, false, prop);
    Object.defineProperty(obj, prop, {
        enumerable: true,
        configurable: true,
        get: createMappingFunction(() => {
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
            if (invokingSetter
                || shallowEqual(newVal, propVal)) {
                // NOTE: If they are equal arrays (reference is changed but all elements are equal),
                // we should change the value reference to make sure they are the same for invoker.
                !invokingSetter && (propVal = newVal);
                return;
            }

            var store = this.store;
            var state = this.state;
            // When current obj is immutable
            // and store doesn't process batching mutations,
            // just return.
            if (this.immutable && !store.isBatching()) {
                // TODO 开发阶段抛出异常，发布阶段log warning。redux-modelizar提供全局的配置
                throw new Error('Immutable state mapping,'
                                + ' object property assignment is not allowed,'
                                + ' please do this in it\'s prototype methods.');
            }

            propVal = newVal;
            // A nomadic mapper should not do any mutations.
            if (!this.connected && !this.lazy) {
                return;
            }

            invokingSetter = true;
            // TODO 被循环引用的对象先被引用再被初始引用方解除引用后其去留问题？
            var subState;
            try {
                if (isMappingState(propVal)) {
                    // NOTE: The mapper of new value maybe is lazy,
                    // it hasn't been mounted on root state,
                    // so it's reference should be set manually.
                    subState = getMappedState(propVal);

                    var id = guid(subState.valueOf());
                    store.dispatch(mutateState(state, prop, createRefObj(id)));
                } else {
                    // NOTE: If the mapper of new value is disconnected from it's state,
                    // it's state should be recreated.
                    var path = store.getState().path(state).concat(prop);
                    subState = store.getState().set(path, propVal).get(path);

                    store.dispatch(mutateState(state, prop, subState));
                    // NOTE: Mutation can be lazy, the property state maybe hasn't mutated,
                    // so create a mapper to accept the following mutations.
                    if (store.isBatching()) {
                        propVal = mapStateToObj(store, subState, propVal, this.immutable, true, prop);
                    }
                }

                // Trigger mutation notify of Vue.js
                setter && setter.call(obj, propVal);
            } finally {
                invokingSetter = false;
            }
        })
    });
};

const cache = new Map();
Mapper.prototype.cache = function (obj) {
    cache.set(guid(obj), obj);
};

Mapper.prototype.discache = function (obj) {
    cache.delete(guid(obj));
};

Mapper.prototype.observe = function (obj) {
    var store = this.store;
    var state = this.state;

    var unsubscribe = store.subscribe(state, (newState) => {
        if (!this.connected) {
            unsubscribe();
        } else {
            this.lazy = false;
            this.connect(newState);
            this.update(obj);
        }
    });
};

Mapper.prototype.update = function (obj) {
    var state = this.state;
    if (state.isArray()) {
        var size = state.size();

        if (obj.length > size) {
            Array.prototype.splice.call(obj, size, obj.length - size);
        }
    }

    var objKeys = Object.keys(obj);
    var stateKeys = state.keys();
    // Remove redundant properties.
    objKeys.filter((key) => stateKeys.indexOf(key) < 0).forEach((key) => {
        if (isConfigurable(obj, key)) {
            delete obj[key];
        }
    });
    // delete obj[IS_DATE_SENTINEL];

    // Bind new properties to `obj`
    stateKeys.filter((key) => objKeys.indexOf(key) < 0).forEach((key) => {
        this.mapping(obj, key);
    });
};

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

    var mapper = getBoundMapper(obj);
    if (!mapper) {
        mapper = new Mapper(store, state, immutable, lazy);
        mapper.bind(obj);
    } else {
        mapper.connect(state);
        mapper.update(obj);
        mapper.cache(obj);
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

    var mapper = getBoundMapper(obj);
    // NOTE: If `obj` is bound to the same state (has the same guid with the specified),
    // just return, the properties of `obj` will be updated in mapper's subscription callback.
    // Otherwise, bind the specified state to a new object.
    if (mapper && mapper.state.is(state)) {
        return obj;
    } else {
        return mapStateToObj(store, state, obj, immutable, false);
    }
}
