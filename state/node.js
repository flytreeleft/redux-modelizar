import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';

import {
    GUID_SENTINEL,
    default as guid
} from '../utils/guid';
import isPrimitive from '../utils/isPrimitive';
import toPlain from '../object/toPlain';
import traverse from '../object/traverse';
import {
    OBJECT_CLASS_SENTINEL,
    isRefObj,
    createRefObj
} from '../object/sentinels';

export function cloneNode(node) {
    if (isPrimitive(node)) {
        return node;
    }

    var nodeId = guid(node);
    var newNode = isArray(node) ? node.concat() : {...node};
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
    var goTop = (paths) => paths.slice(0, paths.length - 1);
    var isRefTopNode = (node, mountPaths) => {
        // Check from the mount point `topNode`
        var checkPaths = topNode && !isPrimitive(node) && pathLink.path(node, topNode);
        if (checkPaths) {
            return checkPaths.length !== mountPaths.length
                   || !isEqual(goTop(checkPaths), goTop(mountPaths));
        }
        return false;
    };

    // var tag = 'Initial node - toPlain';
    // console.profile(tag);
    // console.time(tag);
    var topPath = path;
    var newNode = toPlain(node, {
        pre: (dst, dstTop, path, src, paths) => {
            // Check if the sub node tree
            // contains top node references or not.
            var mountPaths = topPath === null ? paths : [topPath].concat(paths);
            if (!isRefObj(dst) && isRefTopNode(src, mountPaths)) {
                dst = createRefObj(guid(src));
            }
            pathLink.add(dst, dstTop, path);
            return dst;
        },
        post: (dst) => Object.freeze(dst)
    });
    // console.timeEnd(tag);
    // console.profileEnd();
    pathLink.add(newNode, topNode, topPath);

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
    var origNode = node;
    // Process the target node.
    var processedNode = targetNodeProcessor
        ? targetNodeProcessor(node, topNode, path, paths.slice())
        : undefined;
    if (processedNode !== undefined && processedNode !== node) {
        node = processedNode;
    } else { // No mutation
        return root;
    }
    // Go back to the root following paths.
    do {
        if (shouldBeDelete(node)) { // Should be cut?
            pathLink.remove(origNode);
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
            processedNode = pathNodeProcessor
                ? pathNodeProcessor(node, topNode, path, paths.slice(0, pathNodes.length))
                : undefined;
            if (processedNode !== undefined && processedNode !== node) {
                node = processedNode;
                if (shouldBeDelete(node)) {
                    continue; // Cut the node first.
                }
            }
            pathLink.remove(origNode);
            pathLink.add(node, topNode, path);
            Object.freeze(node);
            // Set the processed node to top.
            if (topNode) {
                topNode[path] = node;
                origNode = node = topNode;
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
    if (target === source) {
        return source;
    } else if (isPrimitive(target) || isPrimitive(source)
               || (isArray(target) && !isArray(source))
               || (!isArray(target) && isArray(source))) {
        return initNode(source, pathLink);
    }

    var changed = false;
    var targetCopy = cloneNode(target);
    var refs = new Map([[source, targetCopy]]);
    traverse(source, (src, top, path, srcIndex) => {
        if (top === undefined) {
            return;
        }

        var dstTop = refs.get(top);
        var dst = dstTop[path];
        if (src === dst) {
            return false;
        } else if (!deep
                   || isPrimitive(src) || isPrimitive(dst)
                   || (isArray(src) && !isArray(dst))
                   || (!isArray(src) && isArray(dst))) {
            changed = true;
            dstTop[path] = initNode(src, pathLink, dstTop, path);
            srcIndex === 0 && Object.freeze(dstTop);
            return false;
        }

        dstTop[path] = dst = cloneNode(dst);
        srcIndex === 0 && Object.freeze(dstTop);
        refs.set(src, dst);
    });

    return changed ? targetCopy : target;
}

export function isEqualNode(node, other) {
    var isEqual = true;
    var excludeKeys = [GUID_SENTINEL, OBJECT_CLASS_SENTINEL];
    var refs = new Map([[node, other]]);

    traverse(node, (left, leftTop, path) => {
        if (excludeKeys.indexOf(path) >= 0) {
            return false;
        }

        var right;
        if (leftTop === undefined) {
            right = refs.get(left);
        } else {
            right = refs.get(leftTop)[path];
        }

        if (left === right) {
            return false;
        } else if (isPrimitive(left)
                   || isPrimitive(right)
                   || (isArray(left) && !isArray(right))
                   || (!isArray(left) && isArray(right))) {
            isEqual = false;
            return false;
        } else {
            var leftKeys = Object.keys(left).filter((key) => excludeKeys.indexOf(key) < 0);
            var rightKeys = Object.keys(right).filter((key) => excludeKeys.indexOf(key) < 0);
            if (leftKeys.length !== rightKeys.length) {
                isEqual = false;
                return false;
            }
        }

        refs.set(left, right);
    });
    return isEqual;
}
