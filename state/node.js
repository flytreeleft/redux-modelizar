import isArray from 'lodash/isArray';
import mergeWith from 'lodash/mergeWith';

import {
    GUID_SENTINEL,
    default as guid
} from '../utils/guid';
import isPrimitive from '../utils/isPrimitive';
import toPlain from '../object/toPlain';
import traverse from '../object/traverse';
import {
    isRefObj,
    createRefObj
} from '../object/sentinels';

export function cloneNode(node) {
    if (isPrimitive(node)) {
        return node;
    }

    var nodeId = guid(node);
    var newNode = isArray(node) ? [...node] : {...node};
    guid(newNode, nodeId);

    return newNode;
}

/**
 * Traverse the specified node and update path to `pathLink`.
 *
 * @param {*} node
 * @param {PathLink} pathLink
 * @param {Object/Array} [topNode] Pass `null` if no top node.
 * @param {String/Number/Symbol} [path] The reference property name of `topNode`.
 */
export function initNode(node, pathLink, topNode = null, path = null) {
    var isRefTopNode = (node, topNode) => {
        var nodeId = guid(node);
        var isTopRef = false;
        // Check from the mount point `topNode`
        if (nodeId && topNode) {
            pathLink.walk(topNode, (topNodeId) => {
                if (topNodeId === nodeId) {
                    isTopRef = true;
                }
            });
        }
        return isTopRef;
    };

    var newNode;
    if (Object.isFrozen(node)) {
        newNode = traverse(node, (node, topNode, path) => {
            if (!isPrimitive(node)) {
                pathLink.add(node, topNode, path);
            }
        });
    } else {
        newNode = toPlain(node, {
            pre: (node, topNode, path) => {
                // Check if the sub node tree
                // contains top node references or not.
                if (!isRefObj(node) && isRefTopNode(node, topNode)) {
                    node = createRefObj(guid(node));
                }
                pathLink.add(node, topNode, path);
                return node;
            },
            post: (node) => Object.freeze(node)
        });
    }
    pathLink.add(newNode, topNode, path);

    return newNode;
}

const UnreachableNode = {};
/**
 * @param {*} root The start node to search.
 * @param {Array} paths An array of path from start node to target node.
 * @return {*} If the `paths` is unreachable, return {@link UnreachableNode}.
 *          Return `root` if `paths` is empty.
 */
export function getNodeByPath(root, paths) {
    if (!paths || (paths.length !== 0 && isPrimitive(root))) {
        return UnreachableNode;
    }

    var node = root;
    for (var i = 0; i < paths.length && !isPrimitive(node); i++) {
        var path = paths[i];
        node = node[path];
    }
    return i !== paths.length ? UnreachableNode : node;
}

/**
 * Check if the specified node can be reached
 * following `paths` or not from `root`.
 *
 * @see {@link #getNodeByPath}
 * @param {*} root The start node to search.
 * @param {Array} paths An array of path from start node to target node.
 */
export function isReachablePaths(root, paths) {
    var node = getNodeByPath(root, paths);
    return !isUnreachableNode(node);
}

/**
 * Check if the specified node is unreachable node or not.
 *
 * @see {@link #getNodeByPath}
 * @param {*} node
 */
export function isUnreachableNode(node) {
    return node === UnreachableNode;
}

const ShouldBeRemovedNode = {};
function shouldBeDelete(node) {
    return node === ShouldBeRemovedNode;
}

export function removeTheNode(node) {
    return ShouldBeRemovedNode;
}

/**
 * Make a copy following the `paths` from root,
 * and return the new copy of root if some changes happened.
 *
 * The `targetNodeProcessor` and `pathNodeProcessor` can return
 * a new node which is different from the passed on.
 * If no need to change the passed node, the processor function
 * can just return `undefined`.
 *
 * NOTE:
 * - If the target node isn't mutated, the `pathNodeProcessor`
 *   will not be called and the `root` will be returned;
 * - If the `paths` is unreachable, `root` will be returned;
 * - The `pathLink` will be updated when some changes happened;
 *
 * @param {*} root The start node to search.
 * @param {PathLink} pathLink
 * @param {Array} paths An array of path from root to target node.
 * @param {Function} [targetNodeProcessor]
 *          The function to process the target node.
 * @param {Function} [pathNodeProcessor]
 *          The function to process the path node(including target).
 */
export function copyNodeByPath(root, pathLink, paths, targetNodeProcessor, pathNodeProcessor) {
    if (!paths || (paths.length !== 0 && isPrimitive(root))) {
        return root;
    }

    var pathNodes = [];
    var node = root;
    var path = null;
    var topNode = null;
    // Walk to target
    for (var i = 0; i < paths.length && !isPrimitive(node); i++) {
        pathNodes.push({
            top: topNode,
            path: path
        });
        topNode = node;
        path = paths[i];

        node = topNode[path];
    }
    // Unreachable? Return root.
    if (i < paths.length) {
        return root;
    }
    // Process the target node.
    var processedNode = targetNodeProcessor ? targetNodeProcessor(node, topNode, path) : undefined;
    if (processedNode !== undefined && processedNode !== node) {
        node = processedNode;
    } else { // No mutation
        return root;
    }
    // Go back to the root following paths.
    do {
        if (shouldBeDelete(node)) { // Should be cut?
            pathLink.remove(node);
            // Cut the node from current top
            if (topNode) {
                topNode = cloneNode(topNode);
                if (isArray(topNode)) {
                    topNode.splice(path, 1);
                } else {
                    delete topNode[path];
                }
                node = topNode;
            }
            // Already at root? Remove it.
            else {
                node = undefined;
            }
        }
        // Just update
        else {
            if (topNode) {
                topNode = cloneNode(topNode);
                topNode[path] = node;
            }
            // Process the path node.
            processedNode = pathNodeProcessor ? pathNodeProcessor(node, topNode, path) : undefined;
            pathLink.remove(node);
            if (processedNode !== undefined && processedNode !== node) {
                node = processedNode;
                if (shouldBeDelete(node)) {
                    continue; // Cut the node first.
                }
            }
            pathLink.add(node, topNode, path);
            // Set the processed node to top.
            if (topNode) {
                topNode[path] = node;
                node = topNode;
            }
        }
        // Move to the top node.
        var pathNode = pathNodes.pop();
        path = pathNode && pathNode.path;
        topNode = pathNode && pathNode.top;
    } while (topNode !== undefined);

    return shouldBeDelete(node) ? undefined : node;
}

/**
 * Copy source properties to target.
 *
 * @param {*} target
 * @param {PathLink} pathLink
 * @param {*} source
 * @param {Boolean} [deep=false]
 */
export function mergeNode(target, pathLink, source, deep = false) {
    if (target === source
        || isPrimitive(target) || isPrimitive(source)
        || (isArray(target) && !isArray(source))
        || (!isArray(target) && isArray(source))) {
        return source;
    }

    var changed = false;
    var targetCopy = cloneNode(target);

    mergeWith(targetCopy, source, (objVal, srcVal, key) => {
        if (!isEqualNode(objVal, srcVal)) {
            changed = true;

            pathLink.remove(objVal);
            if (!deep) {
                srcVal = initNode(srcVal, pathLink, targetCopy, key);
            } else {
                srcVal = mergeNode(objVal, pathLink, srcVal, deep);
                pathLink.add(srcVal, targetCopy, key);
            }
        }
        return srcVal;
    });

    return changed ? targetCopy : target;
}

export function isEqualNode(node, other) {
    if (node === other) {
        return true;
    } else if (isPrimitive(node) || isPrimitive(other)
               || (isArray(node) && !isArray(other))
               || (!isArray(node) && isArray(other))) {
        return false;
    }

    var nodeKeys = Object.keys(node).filter((key) => key !== GUID_SENTINEL);
    var otherKeys = Object.keys(other).filter((key) => key !== GUID_SENTINEL);
    if (nodeKeys.length !== otherKeys.length) {
        return false;
    }

    for (var i = 0; i < nodeKeys.length; i++) {
        var key = nodeKeys[i];
        if (!isEqualNode(node[key], other[key])) {
            return false;
        }
    }
    return true;
}
