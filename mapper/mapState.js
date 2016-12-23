import isBoolean from 'lodash/isBoolean';
import isArray from 'lodash/isArray';

import {
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
    isMappingFunction
} from './utils';
import {
    overwriteArray,
    overwriteObject
} from './overwrite';
import {
    mutateState
} from './actions';
import {
    notifyDep
} from './observe';

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
    this.connected = true;
    this.immutable = immutable !== false;
    this.updating = false;

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
    var propVal = mapStateToObj(this.store, state.get(prop), obj[prop], this.immutable, prop);

    Object.defineProperty(obj, prop, {
        enumerable: true,
        configurable: true,
        get: createMappingFunction(() => {
            // NOTE: Do not accept the value from the original getter,
            // just call it for some reason like observing dependencies collection.
            getter && getter.call(obj);

            if (!this.updating || invokingSetter) {
                return propVal;
            }

            // Return the old mapping value when updating mapping.
            var store = this.store;
            var subState = this.state.get(prop);
            if (subState.isObject()) {
                var id = guid(subState);
                // If old value was removed from store cache,
                // the `propVal` means old value.
                return store.cache.has(id) ? store.cache.get(id) : propVal;
            } else {
                return subState.valueOf();
            }
        }),
        set: createMappingFunction((newVal) => {
            if (!this.updating && this.immutable && !this.store.isBatching()) {
                // TODO 开发阶段抛出异常，发布阶段log warning。redux-modelizar提供全局的配置
                throw new Error('Immutable state mapping:'
                                + ' object property assignment is not allowed,'
                                + ' please do this in it\'s prototype methods.');
            }

            if (invokingSetter || propVal === newVal) {
                // NOTE: `store.dispatch` will trigger mapping update immediately,
                // so the setter will be nested invoking.
                this.updating && (propVal = newVal);
                return;
            }

            propVal = newVal;
            // A nomadic mapper should not do any mutations.
            if (this.updating || !this.connected) {
                setter && setter.call(obj, propVal);
                return;
            }

            invokingSetter = true;
            try {
                this.store.dispatch(mutateState(this.state, prop, propVal));
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
        if (!this.connected) {
            store.cache.remove(obj);
            this.unsubscribe();
            this.unsubscribe = null;
        } else {
            this.update(newState, obj);
            // Mutation notify for Vue.js
            notifyDep(obj);
        }
    });
};

var toMap = (result, key) => (result[key] = true) && result;
Mapper.prototype.update = function (newState, obj) {
    if (this.updating) {
        return;
    }

    var store = this.store;
    var oldState = this.state;

    var oldStateKeys = oldState.keys().reduce(toMap, {});
    var newStateKeys = newState.keys().reduce(toMap, {});
    if (newState.isArray()) {
        var oldSize = oldState.size();
        var newSize = newState.size();

        if (oldSize > newSize) {
            Array.prototype.splice.call(obj, newSize, oldSize - newSize);
        } else if (oldSize < newSize) {
            for (var i = oldSize; i < newSize; i++) {
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
            if (newState.get(key).same(oldState.get(key))) {
                return;
            }
            obj[key] = mapStateToObj(store, newState.get(key), obj[key], this.immutable, key);
        });
    } finally {
        this.updating = false;
        this.connect(newState);
    }
};

function mapStateToObj(store, state, obj, immutable, topProp) {
    var stateVal = state.valueOf();
    var stateId = guid(stateVal);

    if (isPrimitive(stateVal)) {
        return stateVal;
    }
    else if (isRefObj(stateVal)) {
        // TODO 若先映射引用，则被引用对象可能会不存在
        var refId = parseRefKey(stateVal);
        return store.cache.get(refId);
    }
    else if (isFunctionObj(stateVal)) {
        var fn = parseFunction(stateVal);
        if (!isNullOrUndefined(topProp) && !isMappingFunction(fn)) {
            fn = invokeInStoreBatch(`this$${topProp}`, fn);
        }
        return fn;
    }
    else if (isRegExpObj(stateVal)) {
        return parseRegExp(stateVal);
    }
    else if (isDateObj(stateVal)) {
        // TODO Create a readonly date
        return parseDate(stateVal);
    }

    if (store.cache.has(stateId)) {
        // Share state mapping instance always.
        return store.cache.get(stateId);
    }

    if (isPrimitive(obj)
        || (isArray(stateVal) && !isArray(obj))
        || (!isArray(stateVal) && isArray(obj))
        || (isBoundState(obj) && stateId !== guid(obj))) {
        obj = createRealObj(stateVal);
    }

    var mapper = getBoundMapper(obj);
    if (!mapper) {
        mapper = new Mapper(store, state, immutable);
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
