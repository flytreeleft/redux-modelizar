import forEach from 'lodash/forEach';
import assignWith from 'lodash/assignWith';

function MyElement(options = {}) {
    this.tag = options.tag || '';
    this.name = options.name || '';
    this.title = options.title || '';

    this.parent = null;
    this.children = [];
}

/**
 * No mutation action
 */
MyElement.prototype.contains = function (el) {
    if (!el || !el.parent) {
        return false;
    } else if (el.parent === this) {
        return true;
    }

    var i = this.children.length;
    while (i--) {
        var child = this.children[i];
        if (child.contains(el)) {
            return true;
        }
    }
    return false;
};

MyElement.prototype.rename = function (name) {
    this.name = name;
};

/**
 * Basic properties mutation actions:
 * # `Object.assign(this, props);`
 */
MyElement.prototype.setProperties = function (props) {
    // NOTE: `parent` and `children` can not be changed by this method.
    assignWith(this, props, (objValue, srcValue, key) => {
        return ['parent', 'children'].indexOf(key) < 0 ? srcValue : objValue;
    });
};

/**
 * Reference removing mutation actions:
 * # `this.parent.children.splice();`
 * # `this.parent = null;`
 */
MyElement.prototype.detach = function () {
    this.parent && this.parent.removeChildren(this);
    return this;
};

/**
 * Reference binding mutation actions:
 * # `child.parent = this;`
 * # `this.children = [child];`
 */
MyElement.prototype.append = function (child) {
    child && this.addChildren(child);
    return this;
};

MyElement.prototype.clear = function () {
    this.children = [];
    return this;
};

/** @private */
MyElement.prototype.removeChildren = function (children) {
    children = [].concat(children || []);

    forEach(children, (child) => {
        if (child.parent === this) {
            var index = this.children.indexOf(child);
            if (index !== -1) {
                this.children.splice(index, 1);
            }
            child.parent = null;
        }
    });
};

/** @private */
MyElement.prototype.addChildren = function (children, index = Number.MAX_VALUE) {
    var len = this.children.length;

    index = Math.min(len, Math.max(0, index));
    children = [].concat(children || []);

    // Batch update
    var oldChildren = [].concat(this.children);
    forEach(children, (child, i) => {
        if (child.parent !== this) {
            child.parent && child.parent.removeChildren(child);
            child.parent = this;
        } else {
            // just chang the order
            var childIndex = oldChildren.indexOf(child);
            if (childIndex === index + i) {
                return; // no change
            } else if (childIndex >= 0) {
                oldChildren.splice(childIndex, 1);

                childIndex < index + i && (index--);
            }
        }
        oldChildren.splice(index + i, 0, child);
    });

    this.children = oldChildren;
};

export default MyElement;
