import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import forEach from 'lodash/forEach';

import createNE from '../utils/createNE';
import isNullOrUndefined from '../utils/isNullOrUndefined';
import isPrimitive from '../utils/isPrimitive';
import valueOf from '../utils/valueOf';
import map from '../utils/map';

import guid from '../utils/guid';
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
 * @return {Array} Return `undefined` if the specified node doesn't exist.
 */
function nodePath(root, pathLink, idOrNode) {
    idOrNode = valueOf(idOrNode);
    return pathLink.path(idOrNode);
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

    return copyNodeByPath(root, pathLink, paths, (node, topNode, path) => {
        return initNode(value, pathLink, topNode, path);
    });
}

var nodeUpdater = (updater, pathLink, node, topNode, path) => {
    if (!updater
        || (!isNullOrUndefined(path) && !isNullOrUndefined(topNode)
            && !(path in topNode))) {
        return;
    }

    var nodePathLink = pathLink.clone().root(node);
    var state = createState(node, nodePathLink, true);
    var newState = updater(state, path);
    var newNode = newState !== undefined ? valueOf(newState) : node;

    if (!isNullOrUndefined(newNode) && newNode !== node) {
        pathLink.mount(newState._pathLink, node);
    }
    return newNode;
};
/**
 * @param {Object} root
 * @param {PathLink} pathLink
 * @param {Array} paths
 * @param {Function} [targetNodeUpdater]
 *          The function to update the target node.
 * @param {Function} [pathNodeUpdater]
 *          The function to update the path node(including target).
 */
function updateNode(root, pathLink, paths, targetNodeUpdater, pathNodeUpdater) {
    return copyNodeByPath(root, pathLink, paths, (target, topNode, path) => {
        return nodeUpdater(targetNodeUpdater, pathLink, target, topNode, path);
    }, (node, topNode, path) => {
        return nodeUpdater(pathNodeUpdater, pathLink, node, topNode, path);
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

    return copyNodeByPath(root, pathLink, paths, (node, topNode, path) => {
        return removeTheNode(node);
    });
}

function mapNode(root, pathLink, paths, mapper) {
    if (!paths || !isFunction(mapper)) {
        return root;
    }

    return copyNodeByPath(root, pathLink, paths, (mappedNode, topNode, path) => {
        return map(mappedNode, (value, key) => {
            var valuePathLink = pathLink.clone().root(value);
            var state = createState(value, valuePathLink, true);
            var newState = mapper(state, key);
            var subNode = newState !== undefined ? valueOf(newState) : value;

            if (!isNullOrUndefined(subNode) && subNode !== value) {
                pathLink.mount(newState._pathLink, value);
            }
            return subNode;
        });
    });
}

function forEachNode(root, pathLink, paths, sideEffect) {
    var node = getNodeByPath(root, paths);
    if (isUnreachableNode(node) || !isObject(node) || !isFunction(sideEffect)) {
        return;
    }

    forEach(node, (value, key) => {
        var nodePathLink = pathLink.clone().root(value);
        var state = createState(value, nodePathLink, true);

        return sideEffect(state, key);
    });
}

export default function createState(initialState, pathLink = null, inited = false) {
    const _pathLink = pathLink || new PathLink();
    var _root = inited ? valueOf(initialState) : initNode(initialState, _pathLink);
    _pathLink.root(_root);

    var doChange = (state, changer) => {
        var pathLink = _pathLink.clone();
        var node = changer(_root, pathLink);

        if (node === _root) {
            return state;
        } else {
            return createState(node, pathLink, true);
        }
    };
    var extractPath = (state, path) => {
        if (isArray(path)) {
            return path;
        } else if (isString(path)) {
            return [path];
        }
    };

    var commonMethods = {
        constructor: function ImmutableState() {
            // No codes in here, it just need a name.
        },
        toString: function () {
            return JSON.stringify(this.toJSON());
        },
        _pathLink: _pathLink, // TODO 定义接口以复制path信息
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
        equals: function (other) {
            if (this === other) {
                return true;
            } else {
                return isEqualNode(valueOf(this), valueOf(other));
            }
        },
        /** Represent the same object or not: GUID comparison */
        is: function (other) {
            if (this === other) {
                return this;
            } else {
                var thisVal = valueOf(this);
                var otherVal = valueOf(other);
                return thisVal === otherVal
                       || (isObject(thisVal) && isObject(otherVal)
                           && guid(thisVal) === guid(otherVal));
            }
        },
        path: function (idOrNode) {
            return nodePath(_root, _pathLink, idOrNode);
        },
        keys: function () {
            return Object.keys(_root);
        },
        has: function (pathOrIdOrNode) {
            if (isString(pathOrIdOrNode)) {
                if (pathOrIdOrNode in _root) {
                    return true;
                } else if (_pathLink.exist(pathOrIdOrNode)) {
                    pathOrIdOrNode = _pathLink.path(pathOrIdOrNode);
                } else {
                    pathOrIdOrNode = null;
                }
            } else if (isObject(pathOrIdOrNode) && !isArray(pathOrIdOrNode)) {
                pathOrIdOrNode = _pathLink.path(pathOrIdOrNode);
            }

            var node = getNodeByPath(_root, pathOrIdOrNode);
            return !isUnreachableNode(node);
        },
        /**
         * Example:
         * ```
         * var state = createState([{}, {a: 1, b: {c: 2}}]);
         * state.get().valueOf(); // => undefined
         * state.get([]).valueOf(); // => [{}, {a: 1, b: {c: 2}}]
         * state.get(1).valueOf(); // => {a: 1, b: {c: 2}}
         * state.get([1, b]).valueOf(); // => {c: 2}
         * state.get(3).valueOf(); // => undefined
         * state.get([1, b, d]).valueOf(); // => undefined
         * ```
         */
        get: function (path) {
            var paths = extractPath(this, path);
            var node = getNodeByPath(_root, paths);
            node = isUnreachableNode(node) ? undefined : node;

            if (node === _root) {
                return this;
            } else if (!isObject(node)) {
                return createState(node);
            } else {
                return createState(node, _pathLink.clone().root(node), true);
            }
        },
        /** Overwrite the existing */
        set: function (path, value) {
            if (arguments.length === 1) {
                value = path;
                path = [];
            }

            var paths = extractPath(this, path);
            if (isNullOrUndefined(paths)) {
                return this;
            }

            return doChange(this, (root, pathLink) => {
                return setNode(root, pathLink, paths, value);
            });
        },
        /**
         * Update the existing one, if `path` is empty or not specified,
         * the root will be updated.
         *
         * @param {String/String[]} [path]
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
        /**
         * Do map with root node or the specified node.
         *
         * @param {String/String[]} [path]
         * @param {Function} mapper Signature: `(state, path) => state`.
         */
        map: function (path, mapper) {
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
         * @param {Function} sideEffect Signature: `(state, path) => {}`.
         */
        forEach: function (path, sideEffect) {
            var paths = extractPath(this, path);

            forEachNode(_root, paths, sideEffect);

            return this;
        }
    };

    var createArrayState = function (nodes) {
        var pathLink = _pathLink.clone().root(nodes);
        if (!nodes) {
            pathLink.clear();
        } else {
            forEach(nodes, (node, index) => {
                pathLink.add(node, nodes, index);
            });
        }
        return createState(nodes, pathLink, true);
    };
    var arrayMethods = {
        push: function (...values) {
            var nodes = cloneNode(_root);
            var pathLink = _pathLink.clone().root(nodes);

            values = values.map((value) => {
                return initNode(value, pathLink);
            });
            Array.prototype.push.apply(nodes, values);
            forEach(nodes, (node, index) => {
                pathLink.add(node, nodes, index);
            });

            return createState(nodes, pathLink, true);
        },
        pop: function () {
            var nodes = cloneNode(_root);
            // TODO 删除被移除的节点path
            nodes.pop();

            return createArrayState(nodes);
        },
        unshift: function (...values) {
            var nodes = cloneNode(_root);
            var pathLink = _pathLink.clone().root(nodes);

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
            var nodes = cloneNode(_root);
            // TODO 删除被移除的节点path
            nodes.shift();

            return createArrayState(nodes);
        },
        splice: function (index, removeNum, ...values) {
            var nodes = cloneNode(_root);
            // TODO 删除被移除的节点path，初始化新增节点
            Array.prototype.splice.apply(nodes, [index, removeNum].concat(values));

            return createArrayState(nodes);
        },
        slice: function (start, end) {
            var nodes = cloneNode(_root);
            // TODO 删除被移除的节点path
            nodes.slice(start, end);

            return createArrayState(nodes);
        },
        first: function () {
            return this.at(0);
        },
        last: function () {
            return this.at(_root.length - 1);
        },
        filter: function (filter) {
            if (!isFunction(filter)) {
                return this;
            } else {
                var nodes = [];
                // TODO 删除被移除的节点path
                this.forEach([], (state, index) => {
                    var accept = filter(state, index, this);
                    if (accept !== false) {
                        nodes.push(valueOf(state));
                    }
                });
                return createArrayState(nodes);
            }
        },
        at: function (index) {
            var node = index < _root.length && index >= 0 ? _root[index] : undefined;
            return createState(node, _pathLink.clone().root(node), true);
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
        remove: function (pathOrIdOrNode) {
            var paths = this.path(pathOrIdOrNode) || extractPath(this, pathOrIdOrNode);
            if (isNullOrUndefined(paths)) {
                return this;
            }

            return doChange(this, (root, pathLink) => {
                return removeNode(root, pathLink, paths);
            });
        }
    };

    var methods = {...commonMethods};
    if (isArray(_root)) {
        methods = Object.assign(methods, objectMethods, arrayMethods);
    } else if (!isPrimitive(_root)) {
        methods = Object.assign(methods, objectMethods);
    }

    var State = Object.create(Object.prototype, createNE(methods));
    return Object.create(State);
}
