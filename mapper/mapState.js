import isBoolean from 'lodash/isBoolean';
import isArray from 'lodash/isArray';

import {
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
import forEach from '../utils/forEach';

import {
    invokeInStoreBatch,
    isBoundState,
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

    this.store.cache.put(obj);
    if (isArray(obj)) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto
        overwriteArray(obj);
    } else {
        overwriteObject(obj);
    }

    var state = this.state;
    state.keys().forEach((key) => {
        this.mapping(state, obj, key);
    });
};

Mapper.prototype.mapping = function (state, obj, prop) {
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
    var propVal = mapStateToObj(this.store, state.get(prop), obj[prop], this.immutable, this.lazy, prop);

    Object.defineProperty(obj, prop, {
        enumerable: true,
        configurable: true,
        get: createMappingFunction(() => {
            // NOTE: Do not accept the value from the original getter,
            // just call it for some reason like observing dependencies collection.
            getter && getter.call(obj);

            if (!this.updating) {
                return propVal;
            }

            // Return the old mapping value when updating mapping.
            var store = this.store;
            var subState = this.state.get(prop);
            if (subState.isObject()) {
                var id = guid(subState);
                return store.cache.get(id);
            } else {
                return subState.valueOf();
            }
        }),
        set: createMappingFunction((newVal) => {
            // NOTE: If just the original array reference changed but no changes on it's elements,
            // do not dispatch to avoid causing empty mutation history.
            if (invokingSetter
                || shallowEqual(newVal, propVal)) {
                // NOTE: If they are equal arrays (reference is changed but all elements are equal),
                // we should change the value reference to make sure they are the same for invoker.
                !invokingSetter && (propVal = newVal);
                return;
            }

            // When current obj is immutable
            // and store doesn't process batching mutations,
            // just return.
            if (!this.updating && this.immutable && !this.store.isBatching()) {
                // TODO 开发阶段抛出异常，发布阶段log warning。redux-modelizar提供全局的配置
                throw new Error('Immutable state mapping:'
                                + ' object property assignment is not allowed,'
                                + ' please do this in it\'s prototype methods.');
            }

            propVal = newVal;
            // A nomadic mapper should not do any mutations.
            if (this.updating || (!this.connected && !this.lazy)) {
                setter && setter.call(obj, propVal);
                return;
            }

            invokingSetter = true;
            // TODO 被循环引用的对象先被引用再被初始引用方解除引用后其去留问题？
            var store = this.store;
            var state = this.state;
            var subState;
            try {
                var mapper = getBoundMapper(propVal);
                if (mapper && (mapper.connected || mapper.lazy)) {
                    // NOTE: The mapper of new value maybe is lazy,
                    // it hasn't been mounted on root state,
                    // so it's reference should be set manually.
                    subState = mapper.state;

                    var id = guid(subState.valueOf());
                    store.dispatch(mutateState(state, prop, createRefObj(id)));
                } else {
                    // NOTE: If the mapper of new value is disconnected from it's state,
                    // it's state should be recreated for processing cross reference correctly.
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

Mapper.prototype.observe = function (obj) {
    if (this.unsubscribe) {
        return;
    }

    var store = this.store;
    var state = this.state;
    this.unsubscribe = store.subscribe(state, (newState) => {
        this.lazy = false;
        if (!this.connected) {
            this.unsubscribe();
            this.unsubscribe = null;
            store.cache.remove(obj);
        } else {
            this.update(newState, obj);
        }
    });
};

var toMap = (result, key) => (result[key] = true) && result;
Mapper.prototype.update = function (newState, obj) {
    var store = this.store;
    var oldState = this.state;

    var oldStateKeys = Object.keys(obj).reduce(toMap, {});
    var newStateKeys = newState.keys().reduce(toMap, {});
    if (newState.isArray()) {
        var newSize = newState.size();

        if (obj.length > newSize) {
            Array.prototype.splice.call(obj, newSize, obj.length - newSize);
        } else if (obj.length < newSize) {
            for (var i = obj.length; i < newSize; i++) {
                this.mapping(oldState, obj, i);
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
                this.mapping(oldState, obj, key);
            }
        });
    }

    try {
        this.updating = true;
        forEach(newStateKeys, (existing, key) => {
            if (!newState.get(key).same(oldState.get(key))) {
                obj[key] = mapStateToObj(store, newState.get(key), obj[key], this.immutable, this.lazy, key);
            }
        });
    } finally {
        this.updating = false;
        this.connect(newState);
    }
};

function fillElements(state, obj, oldObj) {
    if (isArray(obj) && isArray(oldObj)) {
        var elements = oldObj.reduce((result, val) => {
            if (!isPrimitive(val)) {
                result[guid(val)] = val;
            }
            return result;
        }, {});

        state.valueOf().forEach((val, i) => {
            if (!isPrimitive(val)) {
                obj[i] = elements[guid(val)];
            }
        });
    }
}

function mapStateToObj(store, state, obj, immutable, lazy, topProp) {
    var val = state.valueOf();
    var id = guid(val);

    if (isPrimitive(val)) {
        return val;
    }
    else if (isRefObj(val)) {
        id = parseRefKey(val);
        return store.cache.get(id);
    }
    else if (isFunctionObj(val)) {
        var fn = parseFunction(val);
        if (!isNullOrUndefined(topProp) && !isMappingFunction(fn)) {
            fn = invokeInStoreBatch(`this$${topProp}`, fn);
        }
        return fn;
    }
    else if (isRegExpObj(val)) {
        return parseRegExp(val);
    }
    else if (isDateObj(val)) {
        // TODO Create a readonly date
        return parseDate(val);
    }

    if (isPrimitive(obj)
        || (isArray(val) && !isArray(obj))
        || (!isArray(val) && isArray(obj))
        || (isBoundState(obj) && id !== guid(obj))) {
        var oldObj = obj;
        obj = createRealObj(val);

        // Save the original elements for reuse when mapping state.
        fillElements(state, obj, oldObj);
    }

    var mapper = getBoundMapper(obj);
    if (!mapper) {
        mapper = new Mapper(store, state, immutable, lazy);
        mapper.bind(obj);
    } else {
        store.cache.put(obj);
        mapper.update(state, obj);
    }
    mapper.observe(obj);

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
