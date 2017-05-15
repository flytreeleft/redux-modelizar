import {expect} from 'chai';

import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import last from 'lodash/last';

import {
    openDocument,
    closeDocument
} from './reducers';
import Store from './Store';

import MyDocument, {
    HeadElement,
    BodyElement
} from './model/MyDocument';
import MyElement from './model/MyElement';
import DivElement from './model/DivElement';
import ImageElement from './model/ImageElement';

describe('Redux modelizar', function () {
    it/*.skip*/('Open blank document', function () {
        var store = Store.create();
        var browser = createBrowser(store);
        var doc = new MyDocument({
            name: 'Blank'
        });

        browser.openDocument(doc);

        var openDoc = browser.docs[0];
        browser.closeDocument(openDoc);
    });

    it('Close document after opening multiple documents', function () {
        var store = Store.create();
        var browser = createBrowser(store);
        var doc = new MyDocument({
            name: 'A document'
        });

        browser.openDocument(doc);

        // NOTE: A cycle reference should be created.
        var openDoc = browser.docs[0];
        var div = new DivElement();
        openDoc.body.append(div);
        expect(browser.docs[0]).to.be.equal(openDoc);

        browser.openDocument(new MyDocument({
            name: 'Another document'
        }));

        browser.closeDocument(last(browser.docs));

        // TODO 等待实现diff mapping
        // expect(openDoc).to.be.equal(browser.docs[0]);
        // expect(openDoc.body.children[0]).to.be.equal(div);
        // expect(openDoc.body).to.be.equal(div.parent);
    });

    it/*.skip*/('Rename blank document', function () {
        var store = Store.create();
        var browser = createBrowser(store);
        var doc = new MyDocument({
            name: 'Blank'
        });
        browser.openDocument(doc);

        var openDoc = browser.docs[0];
        var newName = doc.name + '#Rename';
        openDoc.rename(newName);
        expect(browser.docs[0]).to.be.equal(openDoc);

        expect(openDoc.name).to.be.equal(newName);

        doc.rename(newName);
        expect(browser.docs[0]).to.be.equal(openDoc);
        expect(doc.name).to.be.equal(newName);
        checkBlankDoc(browser.docs[0], doc);
    });

    it/*.skip*/('Append and remove element to/from body', function () {
        var store = Store.create();
        var browser = createBrowser(store);
        var doc = new MyDocument();
        browser.openDocument(doc);

        var openDoc = browser.docs[0];
        var div = new DivElement();
        openDoc.body.append(div);
        expect(browser.docs[0]).to.be.equal(openDoc);

        var appendedDiv = openDoc.body.children[0];
        checkElement(appendedDiv, div);
        expect(appendedDiv.parent).to.be.equal(openDoc.body);
        expect(appendedDiv.children).to.have.lengthOf(0);

        var image = new ImageElement();
        appendedDiv.append(image);
        expect(openDoc.body.children[0]).to.be.equal(appendedDiv);

        var appendedImage = appendedDiv.children[0];
        checkElement(appendedImage, image);
        expect(appendedImage.parent).to.be.equal(appendedDiv);
        expect(appendedImage.children).to.have.lengthOf(0);

        appendedImage.append(new ImageElement());
        expect(browser.docs[0]).to.be.equal(openDoc);
        expect(appendedImage.children).to.have.lengthOf(0);
        expect(appendedDiv.children[0]).to.be.equal(appendedImage);

        appendedImage.detach();
        expect(browser.docs[0]).to.be.equal(openDoc);
        expect(appendedDiv.children).to.have.lengthOf(0);
        expect(appendedImage.parent).to.be.null;
        expect(openDoc.body.children).to.have.lengthOf(1);
        expect(openDoc.body.children[0]).to.be.equal(appendedDiv);
        expect(appendedDiv.parent).to.be.equal(openDoc.body);

        appendedDiv.detach();
        expect(browser.docs[0]).to.be.equal(openDoc);
        expect(openDoc.body.children).to.have.lengthOf(0);
        expect(appendedDiv.parent).to.be.null;
    });

    it/*.skip*/('Mutate element\'s properties', function () {
        var store = Store.create();
        var browser = createBrowser(store);
        var doc = new MyDocument();
        browser.openDocument(doc);

        var openDoc = browser.docs[0];
        var image = new ImageElement();
        openDoc.body.append(image);
        expect(browser.docs[0]).to.be.equal(openDoc);

        var appendedImage = openDoc.body.children[0];
        checkElement(appendedImage, image);
        expect(appendedImage.parent).to.be.equal(openDoc.body);
        expect(appendedImage.children).to.have.lengthOf(0);
        expect(appendedImage.src).to.be.null;
        var src = 'http://localhost/logo.png';

        appendedImage.setProperties({
            src: src
        });
        expect(browser.docs[0]).to.be.equal(openDoc);
        expect(appendedImage.parent).to.be.equal(openDoc.body);
        expect(openDoc.body.children[0]).to.be.equal(appendedImage);
        expect(appendedImage.src).to.be.equal(src);
    });

    it/*.skip*/('Invoke method without state mutation', function () {
        var store = Store.create();
        var browser = createBrowser(store);
        var doc = new MyDocument();
        browser.openDocument(doc);

        var openDoc = browser.docs[0];
        var div = new DivElement();
        openDoc.body.append(div);
        expect(browser.docs[0]).to.be.equal(openDoc);

        var appendedDiv = openDoc.body.children[0];
        checkElement(appendedDiv, div);
        expect(appendedDiv.parent).to.be.equal(openDoc.body);
        expect(appendedDiv.children).to.have.lengthOf(0);

        openDoc.body.contains(appendedDiv);
        checkElement(appendedDiv, div);
        expect(browser.docs[0]).to.be.equal(openDoc);
        expect(openDoc.body.children[0]).to.be.equal(appendedDiv);
        expect(appendedDiv.parent).to.be.equal(openDoc.body);
        expect(appendedDiv.children).to.have.lengthOf(0);
    });

    it('Model state diff mutation store and mapping', function () {
        var store = Store.create();
        var browser = createBrowser(store);
        var doc = new MyDocument({name: 'Doc#0'});
        browser.openDocument(doc);

        // Create, update, remove object properties
        var openDoc = browser.docs[0];
        var newName = openDoc.name + '#New';
        openDoc.rename(newName);
        expect(openDoc.name).to.be.equal(newName);

        var meta = {
            host: 'http://localhost',
            cookies: ['a=b', 'c=d']
        };
        openDoc.updateMeta(meta);
        expect(openDoc.meta).to.have.properties(meta);

        openDoc.setHeadToNULL();
        expect(openDoc.head).to.be.null;

        // Insert, remove, move, change array elements
        var newEl = new MyElement({name: 'New element'});
        openDoc.body.append(newEl);
        expect(openDoc.body.children).to.have.lengthOf(1);
        expect(openDoc.body.children[0]).to.be.instanceof(MyElement);
        expect(openDoc.body.children[0].parent).to.be.equal(openDoc.body);
        expect(openDoc.body.children[0]).to.have.properties({...newEl, parent: openDoc.body});

        // Insert new element
        var oldNewEl = openDoc.body.children[0];
        var insertEl = new MyElement({name: 'Element inserted into 0'});
        openDoc.body.addChildren(insertEl, 0);
        expect(openDoc.body.children).to.have.lengthOf(2);
        expect(openDoc.body.children[0]).to.have.properties({...insertEl, parent: openDoc.body});
        expect(openDoc.body.children[0]).to.be.instanceof(MyElement);
        expect(openDoc.body.children[0].parent).to.be.equal(openDoc.body);
        expect(openDoc.body.children[1]).to.be.equal(oldNewEl);

        // Move element
        var oldInsertEl = openDoc.body.children[0];
        openDoc.body.addChildren(oldNewEl, 0);
        expect(openDoc.body.children).to.have.lengthOf(2);
        expect(openDoc.body.children[0]).to.be.equal(oldNewEl);
        expect(openDoc.body.children[1]).to.be.equal(oldInsertEl);

        var props = {
            name: 'Element - Panel',
            title: 'Panel',
            tag: 'panel'
        };
        oldInsertEl.setProperties(props);
        expect(openDoc.body.children).to.have.lengthOf(2);
        expect(openDoc.body.children[0]).to.be.equal(oldNewEl);
        expect(openDoc.body.children[1]).to.be.equal(oldInsertEl);
        expect(openDoc.body.children[1]).to.have.properties(props);
    });
});

function createBrowser(store) {
    var browser = {};

    store.bind(browser, {
        docs: state => state.docs
    });
    expect(browser.docs).to.not.be.undefined;
    expect(browser.docs).to.not.be.null;
    expect(browser.docs).to.have.lengthOf(0);

    browser.openDocument = function (doc) {
        var size = (this.docs || []).length;

        store.dispatch(openDocument(doc));
        expect(this.docs).to.have.lengthOf(size + 1);
        checkBlankDoc(this.docs[size], doc);
    };

    browser.closeDocument = function (doc) {
        var size = (this.docs || []).length;

        store.dispatch(closeDocument(doc));
        expect(this.docs).to.have.lengthOf(Math.max(0, size - 1));
    };

    return browser;
}

function checkDoc(doc, origDoc) {
    expect(doc).to.not.equal(origDoc);
    expect(deepEqual(origDoc, doc)).to.be.true;

    expect(doc).to.be.instanceof(MyDocument);
    expect(doc.constructor).to.be.equal(MyDocument);

    expect(doc.head).to.be.instanceof(MyElement);
    expect(doc.head).to.be.instanceof(HeadElement);
    expect(doc.head.constructor).to.be.equal(HeadElement);
    expect(doc.body).to.be.instanceof(MyElement);
    expect(doc.body).to.be.instanceof(BodyElement);
    expect(doc.body.constructor).to.be.equal(BodyElement);
}

function checkBlankDoc(doc, origDoc) {
    checkDoc(doc, origDoc);

    expect(doc.head.children).to.have.lengthOf(0);
    expect(doc.body.children).to.have.lengthOf(0);
}

function checkElement(el, origEl) {
    expect(el).to.be.instanceof(MyElement);
    expect(el).to.be.equal(origEl);
}

function deepEqual(obj, other, seen = new Map()) {
    var equal = obj === other;
    if (equal) {
        return true;
    }

    seen.set(obj, true);

    if (isArray(obj) && isArray(other) && obj.length === other.length) {
        equal = obj.length === 0;
        obj.forEach((o, i) => {
            return seen.get(o) || (equal = deepEqual(o, other[i], seen));
        });
    } else if (isObject(obj) && isObject(other)) {
        equal = Object.keys(obj).length === Object.keys(other).length;
        if (equal) {
            Object.keys(obj).forEach(prop => {
                var val = obj[prop];
                var otherVal = other[prop];

                return seen.get(val) || (equal = deepEqual(val, otherVal, seen));
            });
        }
    }

    return equal;
}
