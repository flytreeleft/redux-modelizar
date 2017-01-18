import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import forEach from 'lodash/forEach';

import createNE from '../utils/createNE';
import isNullOrUndefined from '../utils/isNullOrUndefined';
import isPrimitive from '../utils/isPrimitive';
import valueOf from '../utils/valueOf';
import map from '../utils/map';
import {
    GUID_SENTINEL,
    default as guid
} from '../utils/guid';
import {
    OBJECT_CLASS_SENTINEL
} from '../object/sentinels';

import PathLink from './PathLink';
import {
    initNode,
    getNodeByPath,
    isUnreachableNode,
    copyNodeByPath,
    removeTheNode,
    mergeNode,
    isEqualNode,
    cloneNode
} from './node';

// TODO 记录全部变更历史，从而可以获取同源状态的任意时刻变更情况的差异：
// - 增删Object属性：新增或移除path（对Primitive无记录）；
// - 增删Array元素：新增或移除path（对Primitive无记录）；
// - 移动Array元素：目标path变更（对Primitive无记录）；
// - 移动Object类型：目标path变更；
// - 修改Object属性：无记录；

/**
 * @param {Object} root
 * @param {PathLink} pathLink
 * @param {String/Object} idOrNode
 * @return {Array/null} Return `null` if the specified node doesn't exist.
 */
function nodePath(root, pathLink, idOrNode) {
    idOrNode = valueOf(idOrNode);

    var paths = pathLink.path(idOrNode);
    var node = getNodeByPath(root, paths);
    node = isUnreachableNode(node) ? null : node;

    // TODO 要确保pathLink.path的准确性，需解决PathLink在从下到上合并过程中未将砍掉的分支合并到目标tree的问题
    return guid(node) === guid(idOrNode) ? paths : null;
}

/**
 * @param {Object} root
 * @param {PathLink} pathLink
 * @param {Array} paths
 * @param {*} value
 */
function setNode(root, pathLink, paths, value) {
    if (!paths) {
        return root;
    }

    var replacedNode = null;
    var pathLinkCopy = pathLink.branch();
    var newRoot = copyNodeByPath(root, pathLink, paths, (node, topNode, path) => {
        replacedNode = topNode && path && topNode[path];
        return initNode(value, pathLink, topNode, path);
    });

    var refs = pathLinkCopy.getRefs(replacedNode);
    forEach(refs, (ref) => {
        var refPaths = pathLink.path(ref);
        if (refPaths) {
            newRoot = setNode(newRoot, pathLink, refPaths, replacedNode);
        }
        return !refPaths;
    });

    return newRoot;
}

var nodeUpdater = (updater, pathLink, node, topNode, path, createIfNotExist) => {
    if (!updater
        || (!isNullOrUndefined(path)
            && !isNullOrUndefined(topNode)
            && !(path in topNode)
            && !createIfNotExist)) {
        return;
    }

    var nodePathLink = pathLink.branch(node);
    var state = createState(node, nodePathLink, true);
    var newState = updater(state, path);

    if (newState && !state.same(newState)) {
        var newNode = valueOf(newState);
        newState._mountPathLinkAt(pathLink, newNode, node);
        return newNode;
    }
};
/**
 * @param {Object} root
 * @param {PathLink} pathLink
 * @param {Array} paths
 * @param {Function} [targetNodeUpdater]
 *          The function to update the target node.
 * @param {Function} [pathNodeUpdater]
 *          The function to update the path node(including target).
 * @param {Boolean} [createIfNotExist=false]
 *          If target node doesn't exist, create a new one or not.
 */
function updateNode(root, pathLink, paths,
                    targetNodeUpdater, pathNodeUpdater,
                    createIfNotExist = false) {
    return copyNodeByPath(root, pathLink, paths, (target, topNode, path) => {
        return nodeUpdater(targetNodeUpdater, pathLink, target, topNode, path, createIfNotExist);
    }, (node, topNode, path) => {
        return nodeUpdater(pathNodeUpdater, pathLink, node, topNode, path, createIfNotExist);
    });
}

/**
 * @param {Object} root
 * @param {PathLink} pathLink
 * @param {Array} paths
 */
function removeNode(root, pathLink, paths) {
    if (!paths || paths.length === 0) {
        return root;
    }

    var removedNode = null;
    var pathLinkCopy = pathLink.branch();
    var newRoot = copyNodeByPath(root, pathLink, paths, (node, topNode, path) => {
        return removeTheNode(removedNode = node);
    });

    // If the removed node is referred by other existing node,
    // mount it to the first referring node.
    var refs = pathLinkCopy.getRefs(removedNode);
    forEach(refs, (ref) => {
        var refPaths = pathLink.path(ref);
        if (refPaths) {
            newRoot = setNode(newRoot, pathLink, refPaths, removedNode);
        }
        return !refPaths;
    });

    return newRoot;
}

const excludePaths = [GUID_SENTINEL, OBJECT_CLASS_SENTINEL];
function mapNode(root, pathLink, paths, mapper) {
    if (!paths || !isFunction(mapper)) {
        return root;
    }

    return copyNodeByPath(root, pathLink, paths, (mappedNode, topNode, path) => {
        return map(mappedNode, (node, key) => {
            if (excludePaths.indexOf(key) >= 0) {
                return node;
            }

            var nodePathLink = pathLink.branch(node);
            var state = createState(node, nodePathLink, true);
            var newState = mapper(state, key);

            if (newState && !state.same(newState)) {
                var newNode = valueOf(newState);
                newState._mountPathLinkAt(pathLink, newNode, node);
                return newNode;
            } else {
                return node;
            }
        });
    });
}

function forEachNode(root, pathLink, paths, sideEffect) {
    var node = getNodeByPath(root, paths);
    if (isUnreachableNode(node) || isPrimitive(node) || !isFunction(sideEffect)) {
        return;
    }

    forEach(node, (value, key) => {
        if (excludePaths.indexOf(key) >= 0) {
            return;
        }

        var nodePathLink = pathLink.branch(value);
        var state = createState(value, nodePathLink, true);

        return sideEffect(state, key);
    });
}

const IS_IMMUTABLE_STATE_SENTINEL = '__[IS_IMMUTABLE_STATE]__';
export function isState(obj) {
    return obj && !isPrimitive(obj) && Object.getPrototypeOf(obj)[IS_IMMUTABLE_STATE_SENTINEL] === true;
}

export default function createState(initialState, pathLink = null, inited = false) {
    const _pathLink = pathLink || new PathLink();
    var _root = inited ? valueOf(initialState) : initNode(initialState, _pathLink);
    _pathLink.root(_root);

    var doChange = (state, changer) => {
        var pathLink = _pathLink.branch();
        var node = changer(_root, pathLink);

        pathLink.replace(_root, node);
        if (node === _root) {
            return state;
        } else {
            return createState(node, pathLink, true);
        }
    };
    var extractPath = (state, path) => {
        if (path === null) {
            return null;
        } else if (isArray(path)) {
            return path;
        }

        if (isString(path)) {
            return path.replace(/\[([^\[\]]+)\]/g, '.$1')
                       .replace(/(^\.+)|(\.+$)/g, '')
                       .split(/\./);
        } else if (isNumber(path)) {
            return [path];
        } else {
            throw new Error('Expected parameter "path" is'
                            + ' an Array or String. But received '
                            + path);
        }
    };

    var privateMethods = {
        [IS_IMMUTABLE_STATE_SENTINEL]: true,
        _mountPathLinkAt: function (targetPathLink, rootNode, mountNode) {
            targetPathLink.mount(_pathLink, rootNode, mountNode);
        }
    };
    var commonMethods = {
        constructor: function ImmutableState() {
            // No codes in here, it just need a name.
        },
        valueOf: function () {
            return _root;
        },
        toJS: function () {
            return this.valueOf();
        },
        toJSON: function () {
            return this.toJS();
        },
        isObject: function () {
            return !isPrimitive(_root);
        },
        isArray: function () {
            return isArray(_root);
        },
        /** Value comparison, excludes GUID property. */
        equals: function (obj) {
            if (this === obj) {
                return true;
            } else {
                return isEqualNode(valueOf(this), valueOf(obj));
            }
        },
        /** Is the same object tree or not? Root reference comparision */
        same: function (other) {
            return this === other || valueOf(this) === valueOf(other);
        },
        /** Is presenting the same object or not? GUID of object tree comparison */
        is: function (obj) {
            return this.same(obj) || guid(valueOf(this)) === guid(valueOf(obj));
        },
        /**
         * @param {*} idOrNodeOrState The node object, or the id of node, or a {@link State}.
         * @return {Array/null} Return `null` if cannot reach the target.
         */
        path: function (idOrNodeOrState) {
            if (isState(idOrNodeOrState)) {
                idOrNodeOrState = guid(idOrNodeOrState);
            }

            return nodePath(_root, _pathLink, idOrNodeOrState);
        },
        keys: function () {
            var excludeKeys = [GUID_SENTINEL, OBJECT_CLASS_SENTINEL];
            return Object.keys(_root).filter((key) => excludeKeys.indexOf(key) < 0);
        },
        /**
         * Check if the specified value is in the state tree or not.
         *
         * @param {*} pathOrIdOrNodeOrState The node object, or the id, path of node, or a {@link State}.
         */
        has: function (pathOrIdOrNodeOrState) {
            if (isPrimitive(_root)) {
                return false;
            } else if (isPrimitive(pathOrIdOrNodeOrState)) {
                if (_pathLink.get(pathOrIdOrNodeOrState)) {
                    return !!this.path(pathOrIdOrNodeOrState);
                } else {
                    pathOrIdOrNodeOrState = [pathOrIdOrNodeOrState];
                }
            }

            if (isArray(pathOrIdOrNodeOrState)) {
                var paths = extractPath(this, pathOrIdOrNodeOrState);
                var node = _root;
                for (var i = 0; i < paths.length && !isPrimitive(node); i++) {
                    var path = paths[i];
                    if (!(path in node)) {
                        return false;
                    }
                    node = node[path];
                }
                return i === paths.length;
            } else { // Check object
                return !!this.path(pathOrIdOrNodeOrState);
            }
        },
        /**
         * Example:
         * ```
         * var state = createState([{}, {a: 1, b: {c: 2}}]);
         * state.val(); // === state.valueOf(), state.val([])
         * state.val([]); // => [{}, {a: 1, b: {c: 2}}]
         * ```
         *
         * @param {String/Array} [path]
         *          e.g. `['a', 'b', 0]`, `'a.b[0]'`, `[1][2][0].c`.
         * @return {*}
         */
        val: function (path) {
            return this.get(path).valueOf();
        },
        /**
         * Example:
         * ```
         * var state = createState([{}, {a: 1, b: {c: 2}}]);
         * state.get(); // === state.get([])
         * state.get([]); // => createState([{}, {a: 1, b: {c: 2}}])
         * state.get(1); // => createState({a: 1, b: {c: 2}})
         * state.get([1, b]); // => createState({c: 2})
         * state.get('[1].b'); // => createState(({c: 2})
         * state.get(3); // => createState(undefined)
         * state.get([1, b, d]); // => createState(undefined)
         * state.get('[1].b.d'); // => createState(undefined)
         * state.get(null); // => createState(undefined)
         * ```
         *
         * @param {String/Array/null} [path]
         *          e.g. `['a', 'b', 0]`, `'a.b[0]'`, `[1][2][0].c`.
         * @return {State}
         */
        get: function (path) {
            var paths = path !== undefined ? extractPath(this, path) : [];
            var node = getNodeByPath(_root, paths);
            node = isUnreachableNode(node) ? undefined : node;

            if (node === _root) {
                return this;
            } else if (isPrimitive(node)) {
                return createState(node);
            } else {
                return createState(node, _pathLink.branch(node), true);
            }
        },
        /**
         * Overwrite the existing or create a new one.
         *
         * @param {String/Array} path
         *          e.g. `['a', 'b', 0]`, `'a.b[0]'`, `[1][2][0].c`.
         * @param {*} valueOrState General value or a {@link State}.
         */
        set: function (path, valueOrState) {
            if (arguments.length === 1) {
                valueOrState = path;
                path = [];
            }
            if (valueOrState === this) {
                return this;
            }

            var paths = extractPath(this, path);
            if (isNullOrUndefined(paths)) {
                return this;
            }

            return doChange(this, (root, pathLink) => {
                // TODO 不同的Path link在合并时会出现干扰，故需寻找更稳定的方法以提高大数据的更新速度
                // `update` will be faster than `set` when value is a big data.
                // if (isState(valueOrState)) {
                //     return updateNode(root, pathLink, paths, () => valueOrState, null, true);
                // } else {
                return setNode(root, pathLink, paths, valueOf(valueOrState));
                // }
            });
        },
        /**
         * Update the existing one, if `path` is empty or not specified,
         * the root will be updated.
         *
         * NOTE: For non-existing node, this function will do nothing.
         *
         * @param {String/String[]} [path]
         *          e.g. `['a', 'b', 0]`, `'a.b[0]'`, `[1][2][0].c`.
         * @param {Function/*} targetNodeUpdater Signature: `(state, path) => state`.
         *          Literal value is accepted.
         * @param {Function} [pathNodeUpdater] Default `(state, path) => state`.
         */
        update: function (path, targetNodeUpdater, pathNodeUpdater) {
            if (isFunction(path)) {
                pathNodeUpdater = targetNodeUpdater;
                targetNodeUpdater = path;
                path = [];
            }
            if (targetNodeUpdater !== undefined && !isFunction(targetNodeUpdater)) {
                var literal = targetNodeUpdater;
                targetNodeUpdater = (state) => state.set([], literal);
            }

            var paths = extractPath(this, path);
            if (isNullOrUndefined(paths)) {
                return this;
            }

            return doChange(this, (root, pathLink) => {
                return updateNode(root, pathLink, paths, targetNodeUpdater, pathNodeUpdater);
            });
        },
        merge: function (valueOrState, deep = false) {
            var value = valueOf(valueOrState);
            // NOTE: First reference checking, then value.
            if (valueOrState === this || !value) {
                return this;
            }

            return doChange(this, (root, pathLink) => {
                return mergeNode(root, pathLink, value, deep);
            });
        },
        mergeDeep: function (valueOrState) {
            return this.merge(valueOrState, true);
        },
        remove: function (pathOrIdOrNode) {
            var paths = this.path(pathOrIdOrNode) || extractPath(this, pathOrIdOrNode);
            if (isNullOrUndefined(paths)) {
                return this;
            }

            return doChange(this, (root, pathLink) => {
                return removeNode(root, pathLink, paths);
            });
        },
        /**
         * Do map with root node or the specified node.
         *
         * @param {String/String[]} [path]
         *          e.g. `['a', 'b', 0]`, `'a.b[0]'`, `[1][2][0].c`.
         * @param {Function} mapper `(state, path) => state`.
         *          If return null or undefined,
         *          the original will not be changed.
         */
        map: function (path, mapper) {
            if (isFunction(path)) {
                mapper = path;
                path = [];
            }
            if (!mapper) {
                return this;
            }

            var paths = extractPath(this, path);
            if (isNullOrUndefined(paths)) {
                return this;
            }

            return doChange(this, (root, pathLink) => {
                return mapNode(root, pathLink, paths, mapper);
            });
        },
        /**
         * @param {String/String[]} [path]
         *          e.g. `['a', 'b', 0]`, `'a.b[0]'`, `[1][2][0].c`.
         * @param {Function} sideEffect `(state, path) => Boolean`.
         */
        forEach: function (path, sideEffect) {
            if (isFunction(path)) {
                sideEffect = path;
                path = [];
            }
            if (!sideEffect) {
                return this;
            }

            var paths = extractPath(this, path);
            forEachNode(_root, _pathLink, paths, sideEffect);

            return this;
        },
        /**
         * Examples:
         * ```
         * // Primitive state root
         * createState('a string').find(() => true) => createState(undefined);
         * // Array state root
         * createState([1, 2, 3]).find() => createState(undefined);
         * createState([1, 2, 3]).find(() => false) => createState(null);
         * createState([1, 2, 3]).find(() => true) => createState(1);
         * // Object state root
         * createState({a: 1, b: 2, c: 3}).find() => createState(undefined);
         * createState({a: 1, b: 2, c: 3}).find(() => false) => createState(null);
         * createState({a: 1, b: 2, c: 3}).find((state, path) => path === 'b') => createState(2);
         * ```
         *
         * @param {Function} predicate `(state, path, searchState) => Boolean`
         * @return {State} The state whose `_root` is the matched value.
         */
        find: function (predicate) {
            if (!isFunction(predicate) || isPrimitive(_root)) {
                return createState(undefined);
            }

            var expectedNode = null;
            this.forEach((state, path) => {
                var accept = predicate(state, path, this);

                if (accept) {
                    expectedNode = valueOf(state);
                    return false;
                }
            });

            if (isPrimitive(expectedNode)) {
                return createState(expectedNode);
            } else {
                return createState(expectedNode, _pathLink.branch(expectedNode), true);
            }
        },
        /**
         * Examples:
         * ```
         * // Primitive state root
         * createState('a string').filter(() => true) => createState(undefined);
         * // Array state root
         * createState([1, 2, 3]).filter() => createState([]);
         * createState([1, 2, 3]).filter(() => false) => createState([]);
         * createState([1, 2, 3]).filter((state, path) => path === 1) => createState([2]);
         * // Object state root
         * createState({a: 1, b: 2, c: 3}).filter() => createState({});
         * createState({a: 1, b: 2, c: 3}).filter(() => false) => createState({});
         * createState({a: 1, b: 2, c: 3}).filter((state, path) => path === 'b') => createState({b: 2});
         * ```
         *
         * @param {Function} predicate `(state, path, searchState) => Boolean`
         * @return {State} The state whose `_root` is the matched `key:value`.
         */
        filter: function (predicate) {
            if (!isFunction(predicate) || isPrimitive(_root)) {
                return createState(
                    isArray(_root)
                        ? []
                        : (isPrimitive(_root) ? undefined : {})
                );
            }

            var nodes = isArray(_root) ? [] : {};
            var pathLink = _pathLink.branch(nodes);
            this.forEach((state, path) => {
                var accept = predicate(state, path, this);
                if (!accept) {
                    return;
                }

                var prop = isArray(nodes) ? nodes.length : path;
                nodes[prop] = valueOf(state);
                pathLink.add(nodes[prop], nodes, prop);
            });

            return createState(nodes, pathLink, true);
        }
    };

    var arrayMethods = {
        /**
         * NOTE: If need push some big arrays, using {@link #concat} instead.
         */
        push: function (...values) {
            if (values.length === 0) {
                return this;
            }

            var nodes = cloneNode(_root);
            var pathLink = _pathLink.branch(nodes);

            values.forEach((value, index) => {
                var node = initNode(value, pathLink, nodes, nodes.length + index);
                nodes.push(node);
            });

            return createState(nodes, pathLink, true);
        },
        pop: function () {
            if (_root.length === 0) {
                return this;
            }

            var nodes = cloneNode(_root);
            var pathLink = _pathLink.branch(nodes);
            var node = nodes.pop();
            pathLink.remove(node);

            return createState(nodes, pathLink, true);
        },
        unshift: function (...values) {
            if (values.length === 0) {
                return this;
            }

            var nodes = cloneNode(_root);
            var pathLink = _pathLink.branch(nodes);

            values = values.map((value) => {
                return initNode(value, pathLink);
            });
            Array.prototype.unshift.apply(nodes, values);
            forEach(nodes, (node, index) => {
                pathLink.add(node, nodes, index);
            });

            return createState(nodes, pathLink, true);
        },
        shift: function () {
            if (_root.length === 0) {
                return this;
            }

            var nodes = cloneNode(_root);
            var pathLink = _pathLink.branch(nodes);
            var node = nodes.shift();
            pathLink.remove(node);

            return createState(nodes, pathLink, true);
        },
        /**
         * NOTE: If need insert a big array, using {@link #insert} instead.
         */
        splice: function (start, removeNum, ...values) {
            if (removeNum === 0 && values.length === 0) {
                return this;
            }

            var nodes = cloneNode(_root);
            var pathLink = _pathLink.branch(nodes);
            var i;
            var removed;
            var node;

            for (i = 0; i < removeNum; i++) {
                removed = nodes.splice(start, 1);
                pathLink.remove(removed);
            }
            for (i = 0; i < values.length; i++) {
                let index = start + i;
                node = initNode(values[i], pathLink, nodes, index);
                nodes.splice(index, 0, node);
            }
            // Update the rest elements.
            for (i = start + values.length; i < nodes.length; i++) {
                pathLink.add(nodes[i], nodes, i);
            }

            return createState(nodes, pathLink, true);
        },
        slice: function (start, end) {
            if ((start === 0 && end === _root.length)
                || _root.length === 0) {
                return this;
            }

            // Slice doesn't change the original array,
            // so a new root should be created.
            var nodes = _root.slice(start, end);
            var pathLink = _pathLink.branch(nodes);
            nodes.forEach((node, index) => {
                pathLink.add(node, nodes, index - start);
            });

            return createState(nodes, pathLink, true);
        },
        concat: function (...arrays) {
            if (arrays.length === 0) {
                return this;
            }

            var nodes = cloneNode(_root);
            var pathLink = _pathLink.branch(nodes);
            var values = Array.prototype.concat.apply([], arrays);

            values.forEach((value, index) => {
                var node = initNode(value, pathLink, nodes, nodes.length + index);
                nodes.push(node);
            });

            return createState(nodes, pathLink, true);
        },
        /**
         * @param {Number} index
         * @param {Array} values
         */
        insert: function (index, values) {
            if (values.length === 0) {
                return this;
            }

            var nodes = cloneNode(_root);
            var pathLink = _pathLink.branch(nodes);
            var start = index;

            values.forEach((value, index) => {
                var i = start + index;
                var node = initNode(value, pathLink, nodes, i);
                nodes.splice(i, 0, node);
            });
            // Update the rest elements.
            for (var i = start + values.length; i < nodes.length; i++) {
                pathLink.add(nodes[i], nodes, i);
            }

            return createState(nodes, pathLink, true);
        },
        sort: function (cb) {
            var nodes = cloneNode(_root);
            var pathLink = _pathLink.branch(nodes);

            nodes.sort(cb);
            for (var i = 0; i < nodes.length; i++) {
                pathLink.add(nodes[i], nodes, i);
            }

            return createState(nodes, pathLink, true);
        },
        reverse: function () {
            var nodes = cloneNode(_root);
            var pathLink = _pathLink.branch(nodes);

            nodes.reverse();
            for (var i = 0; i < nodes.length; i++) {
                pathLink.add(nodes[i], nodes, i);
            }

            return createState(nodes, pathLink, true);
        },
        first: function () {
            return this.at(0);
        },
        last: function () {
            return this.at(_root.length - 1);
        },
        at: function (index) {
            var node = index < _root.length && index >= 0 ? _root[index] : undefined;
            return createState(node, _pathLink.branch(node), true);
        },
        /**
         * @param {Function} predicate `(state, index, searchState) => Boolean`
         */
        findIndex: function (predicate) {
            var expectedIndex = -1;

            if (isFunction(predicate)) {
                this.forEach((state, index) => {
                    var accept = predicate(state, index, this);

                    if (accept) {
                        expectedIndex = index;
                        return false;
                    }
                });
            }

            return expectedIndex;
        },
        clear: function () {
            return createState([]);
        },
        size: function () {
            return _root.length;
        },
        isEmpty: function () {
            return this.size() === 0;
        }
    };
    var objectMethods = {
        /**
         * @param {Function} predicate `(state, key, searchState) => Boolean`
         */
        findKey: function (predicate) {
            var expectedKey = null;

            if (isFunction(predicate)) {
                this.forEach((state, key) => {
                    var accept = predicate(state, key, this);

                    if (accept) {
                        expectedKey = key;
                        return false;
                    }
                });
            }

            return expectedKey;
        }
    };

    var methods = {...privateMethods, ...commonMethods};
    if (isArray(_root)) {
        methods = Object.assign(methods, objectMethods, arrayMethods);
    } else if (!isPrimitive(_root)) {
        methods = Object.assign(methods, objectMethods);
    }

    var State = Object.create(Object.prototype, createNE(methods));
    return Object.create(State);
}
