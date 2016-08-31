import isString from 'lodash/isString';

import guid from '../utils/guid';
import isNullOrUndefined from '../utils/isNullOrUndefined';
import isPrimitive from '../utils/isPrimitive';

function extractId(nodeOrId) {
    if (isString(nodeOrId)) {
        return nodeOrId;
    } else if (!isNullOrUndefined(nodeOrId)) {
        return guid(nodeOrId);
    }
}

function PathLink() {
    this.link = new Map();
    this.rootNode = null;
}

/**
 * If it's an atomic node or not.
 */
PathLink.prototype.isAtomic = function () {
    return isPrimitive(this.rootNode);
};

PathLink.prototype.add = function (node, topNode, path) {
    var nodeId = guid(node);
    var topNodeId = guid(topNode);

    if (isNullOrUndefined(topNode) && isNullOrUndefined(path)) {
        this.root(node);
    } else if (nodeId && !this.isAtomic()) {
        this.link.set(nodeId, {
            top: topNodeId,
            path: path
        });
    }
    return this;
};

/** Set root node */
PathLink.prototype.root = function (root) {
    if (isPrimitive(root)) {
        this.rootNode = root;
    } else {
        var rootId = guid(this.rootNode = {}, guid(root));
        // NOTE: Keep the existing link of root for
        // walking to the top of the original tree.
        if (!this.link.has(rootId)) {
            this.link.set(rootId, {
                top: null,
                path: null
            });
        }
    }

    return this;
};

PathLink.prototype.remove = function (nodeOrId) {
    var id = extractId(nodeOrId);

    if (id && !this.isAtomic()) {
        this.link.delete(id);
    }
    return this;
};

PathLink.prototype.get = function (nodeOrId) {
    var id = this.isAtomic() ? null : extractId(nodeOrId);

    return id && this.link.get(id);
};

PathLink.prototype.exist = function (nodeOrId) {
    return !!this.get(nodeOrId);
};

/**
 * @return {Array/undefined} The path from root to specified node.
 *          If node doesn't exist, return `undefined`.
 */
PathLink.prototype.path = function (nodeOrId) {
    var lnk = this.get(nodeOrId);
    if (!lnk) {
        return;
    }

    var rootLnk = this.get(this.rootNode);
    var paths = [];
    while (lnk && lnk !== rootLnk) {
        var path = lnk.path;
        !isNullOrUndefined(path) && paths.unshift(path);

        lnk = this.get(lnk.top);
    }

    return paths;
};

PathLink.prototype.walk = function (nodeOrId, pathWalker) {
    var lnk = this.get(nodeOrId);
    if (!lnk) {
        return;
    }

    while (lnk) {
        pathWalker && pathWalker(lnk.top, lnk.path);

        lnk = this.get(lnk.top);
    }
};

PathLink.prototype.clear = function () {
    this.link.clear();
    this.rootNode = null;

    return this;
};

PathLink.prototype.clone = function () {
    var pathLink = new PathLink();

    this.link.forEach((lnk, id) => {
        pathLink.link.set(id, lnk);
    });
    pathLink.rootNode = this.rootNode;

    return pathLink;
};

PathLink.prototype.mount = function (target, node) {
    var nodeId = extractId(node);
    var mpLnk = this.get(nodeId);
    if (!mpLnk) {
        return;
    }

    this.link.delete(nodeId);

    if (!target.isAtomic()) {
        var targetRootId = guid(target.rootNode);

        target.link.forEach((lnk, id) => {
            var paths = target.path(id);

            if (paths && id !== targetRootId) {
                this.link.set(id, lnk);
            }
        });
        this.link.set(targetRootId, mpLnk);
    }
    return this;
};

export default PathLink;
