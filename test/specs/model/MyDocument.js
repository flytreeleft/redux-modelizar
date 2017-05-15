import MyElement from './MyElement';

class HeadElement extends MyElement {
    constructor(options = {}) {
        super(options);
        this.tag = 'head';
    }
}

class BodyElement extends MyElement {
    constructor(options = {}) {
        super(options);
        this.tag = 'body';
    }
}

function MyDocument(options = {}) {
    this.name = options.name || '';

    this.head = new HeadElement();
    this.body = new BodyElement();
    this.meta = {};
}

MyDocument.prototype.rename = function (name) {
    name && (this.name = name);
};

MyDocument.prototype.updateMeta = function (meta = {}) {
    Object.assign(this.meta, meta);
};

MyDocument.prototype.setHeadToNULL = function () {
    this.head = null;
};

export {
    HeadElement,
    BodyElement
};
export default MyDocument;
