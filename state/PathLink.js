import isString from 'lodash/isString';

import guid from '../utils/guid';
import isNullOrUndefined from '../utils/isNullOrUndefined';
import isPrimitive from '../utils/isPrimitive';
import traverse from '../object/traverse';

function extractId(nodeOrId) {
    if (isString(nodeOrId)) {
        return nodeOrId;
    } else if (!isNullOrUndefined(nodeOrId)) {
        return guid(nodeOrId);
    }
}

function PathLink(parent) {
    this._parent = parent;
    this._link = {};
    this._root = null;
}

PathLink.prototype.add = function (node, topNode, path) {
    if (isPrimitive(node)) {
        return this;
    }

    var nodeId = guid(node);
    var topNodeId = guid(topNode);
    this._link[nodeId] = {
        top: topNodeId,
        path: path,
        refs: []
    };

    return this;
};

/**
 * @param {Object} oldNode
 * @param {*} newNode
 */
PathLink.prototype.replace = function (oldNode, newNode) {
    if (isPrimitive(oldNode) || guid(oldNode) === guid(newNode)) {
        return this;
    }

    var lnk = this.get(oldNode);
    this.remove(oldNode);

    if (!isPrimitive(newNode)) {
        var newNodeId = guid(newNode);
        this._link[newNodeId] = {...lnk, refs: []};
    }

    return this;
};

PathLink.prototype.remove = function (node) {
    if (isPrimitive(node)) {
        return this;
    }

    var nodeId = guid(node);
    // Make node as a leaf
    this._link[nodeId] = {
        top: null,
        path: null,
        refs: []
    };

    return this;
};

/**
 * Record the reference from `node` to `target`.
 *
 * @param {Object} node The referring node.
 * @param {Object/String} target The referred node or it's guid.
 */
PathLink.prototype.ref = function (node, target) {
    var referringId = extractId(node);
    var referredId = extractId(target);
    if (isPrimitive(node) || referringId === referredId) {
        return this;
    }

    var lnk = this.get(referredId);
    if (lnk && (lnk.path || referredId === this._root)) {
        if (lnk.refs.indexOf(referringId) < 0) {
            lnk.refs.push(referringId);
        }
    }

    return this;
};

/**
 * Return the nodes which refer to the specified node.
 *
 * @return {String[]}
 */
PathLink.prototype.getRefs = function (node) {
    var lnk = this.get(node);

    return lnk ? lnk.refs.slice() : [];
};

PathLink.prototype.root = function (root) {
    if (!isPrimitive(root)) {
        this._root = guid(root);
    } else {
        this._link = {};
    }

    return this;
};

PathLink.prototype.get = function (nodeOrId) {
    var nodeId = extractId(nodeOrId);

    return this._link[nodeId]
           || (this._parent
               && this._parent.get(this._root)
               && this._parent.get(nodeId));
};

PathLink.prototype.has = function (nodeOrId) {
    return !!this.path(nodeOrId);
};

/**
 * @return {Array/null} The path from root to the specified node.
 *          If node doesn't exist, return `null`.
 */
PathLink.prototype.path = function (start, end = this._root) {
    var lnk = this.get(start);
    if (!lnk) {
        return null;
    }

    var endLnk = this.get(end);
    var paths = [];
    while (lnk && lnk !== endLnk) {
        var path = lnk.path;
        // If it's a broken path or can not reach to current root,
        // return `null`.
        if (isNullOrUndefined(path)) {
            return null;
        }

        paths.unshift(path);
        lnk = this.get(lnk.top);
    }
    return paths;
};

PathLink.prototype.clear = function () {
    this._root = null;
    this._parent = null;
    this._link = {};

    return this;
};

PathLink.prototype.branch = function (node = this._root) {
    var branch = new PathLink(this);

    if (node === this._root) {
        branch._root = node;
    } else if (!isPrimitive(node)
               && !this.get(node)) {
        // New node as root
        branch.add(node, null, null);
    } else {
        branch.root(node);
    }

    return branch;
};

PathLink.prototype.isBranchOf = function (pathLink) {
    var parent = this._parent;
    while (parent) {
        if (parent === pathLink) {
            return true;
        }
        parent = parent._parent;
    }
    return false;
};

/**
 * Mount the specified tree to current path link.
 *
 * @param {PathLink} sourcePathLink The path link of the mounted tree.
 * @param {*} sourceRoot The root node of mounted tree.
 * @param {Object} mountNode The mounted point node of current tree.
 */
PathLink.prototype.mount = function (sourcePathLink, sourceRoot, mountNode) {
    if (isPrimitive(sourceRoot)) {
        // For leaf node, no need to update path link.
        return this;
    } else if (sourcePathLink._parent === this/*sourcePathLink.isBranchOf(this)*/) {
        sourcePathLink._link.forEach((lnk, nodeId) => {
            this._link[nodeId] = {...lnk, refs: lnk.refs.slice()};
        });
    } else {
        traverse(sourceRoot, (src, top, path) => {
            if (top !== undefined) {
                this.add(src, top, path);
            }
        });
    }
    this.replace(mountNode, sourceRoot);

    return this;
};

export default PathLink;
