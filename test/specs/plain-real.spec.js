import {expect} from 'chai';

import isPlainObject from 'lodash/isPlainObject';

import {
    toPlain,
    toReal,
    syncReal,
    diffReal
} from 'redux-modelizar';

import prepareDocs from './prepareDocs';
import MyDocument from './model/MyDocument';
import MyElement from './model/MyElement';

const GUID_SENTINEL = '__[GLOBAL_UNIQUE_ID]__';
const REFERENCE_KEY_SENTINEL = '__REFERENCE_KEY__';

describe.skip('Object plain and real:', function () {
    it/*.skip*/('toPlain - Basic', function () {
        var docs = prepareDocs(1, 2, 2);
        var plainDocs = toPlain(docs);

        expect(plainDocs).to.have.lengthOf(1);

        var plainDoc = plainDocs[0];
        expect(isPlainObject(plainDoc)).to.be.true;
        expect(isPlainObject(plainDoc.body)).to.be.true;
        expect(isPlainObject(plainDoc.head)).to.be.true;
        expect(plainDoc.name).to.be.equal(docs[0].name);
        expect(plainDoc.body.children).to.have.lengthOf(2);
        expect(plainDoc.body.name).to.be.equal(docs[0].body.name);
        expect(plainDoc.head.name).to.be.equal(docs[0].head.name);

        expect(!!plainDoc[GUID_SENTINEL]).to.be.true;
        expect(!!plainDoc.body[GUID_SENTINEL]).to.be.true;
        expect(!!plainDoc.head[GUID_SENTINEL]).to.be.true;
        expect(plainDoc[GUID_SENTINEL]).to.not.equal(plainDoc.body[GUID_SENTINEL]);
        expect(plainDoc[GUID_SENTINEL]).to.not.equal(plainDoc.head[GUID_SENTINEL]);
        expect(plainDoc.body[GUID_SENTINEL]).to.not.equal(plainDoc.head[GUID_SENTINEL]);

        plainDoc.body.children.forEach((child, index) => {
            expect(isPlainObject(child)).to.be.true;
            expect(isPlainObject(child.parent)).to.be.true;
            expect(child.name).to.be.equal(docs[0].body.children[index].name);

            expect(child[GUID_SENTINEL]).to.not.equal(plainDoc.body[GUID_SENTINEL]);
            expect(child.parent).to.not.equal(plainDoc.body);
            expect(child.parent[GUID_SENTINEL]).to.not.equal(plainDoc.body[GUID_SENTINEL]);
            expect(child.parent[REFERENCE_KEY_SENTINEL]).to.be.equal(plainDoc.body[GUID_SENTINEL]);

            expect(child.children).to.have.lengthOf(1);
            expect(isPlainObject(child.children[0])).to.be.true;
            expect(isPlainObject(child.children[0].parent)).to.be.true;
            expect(child.children[0].name).to.be.equal(docs[0].body.children[index].children[0].name);
            expect(child.children[0].parent).to.not.equal(child);
            expect(child.children[0].parent[GUID_SENTINEL]).to.not.equal(child[GUID_SENTINEL]);
            expect(child.children[0].parent[REFERENCE_KEY_SENTINEL]).to.be.equal(child[GUID_SENTINEL]);
        });
    });

    it('toPlain - Plain more than once', function () {
        var docs = prepareDocs(1, 2, 2);
        var plainDocs = toPlain(docs);
        var plainAgainDocs = toPlain(plainDocs);

        expect(plainDocs).to.be.eql(plainAgainDocs);
    });

    it('toPlain - Special object', function () {
        function AFunction() {
        }

        var po = toPlain(AFunction);
        expect(po).to.be.an('object');
        expect(po).to.not.instanceof(Function);
        expect(po).to.not.equal(AFunction);
        expect(po.constructor).to.be.equal(Object);
        expect(po.name).to.be.equal(AFunction.name);

        var sameNameFn = new Function(`return ${AFunction.toString()};`)();
        expect(sameNameFn).to.be.instanceof(Function);
        expect(sameNameFn).to.not.equal(AFunction);
        expect(sameNameFn.name).to.be.equal(AFunction.name);
        po = toPlain(sameNameFn);
        expect(po.name).to.not.equal(AFunction.name);
        expect(/@\d+$/.test(po.name)).to.be.true;

        var date = new Date();
        po = toPlain(date);
        expect(po).to.be.an('object');
        expect(po).to.not.instanceof(Date);
        expect(po.constructor).to.be.equal(Object);
        expect(po.time).to.be.equal(date.getTime());

        var regex = /^$/gi;
        po = toPlain(regex);
        expect(po).to.be.an('object');
        expect(po).to.not.instanceof(RegExp);
        expect(po.constructor).to.be.equal(Object);
        expect(po.exp).to.be.equal(regex.toString());
    });

    it('toPlain - Processor', function () {
        var preInvokedCount = 0;
        var postInvokedCount = 0;

        toPlain({
            a: [1, 2, 3],
            b: {
                c: {},
                d: 'a'
            }
        }, {
            pre: (obj) => {
                preInvokedCount++;
                return obj;
            },
            post: (obj) => {
                postInvokedCount++;
                return obj;
            }
        });
        expect(preInvokedCount).to.be.equal(4);
        expect(postInvokedCount).to.be.equal(4);
    });

    it('toReal - Basic', function () {
        var docs = prepareDocs(1, 2, 2);
        var plainDocs = toPlain(docs);
        var realDocs = toReal(plainDocs);

        expect(realDocs).to.have.lengthOf(1);

        var realDoc = realDocs[0];
        expect(realDoc).to.be.instanceof(MyDocument);
        expect(realDoc).to.not.equal(docs[0]);
        expect(realDoc.name).to.be.equal(docs[0].name);

        expect(realDoc.body).to.be.instanceof(MyElement);
        expect(realDoc.head).to.be.instanceof(MyElement);
        expect(realDoc.body).to.not.equal(docs[0].body);
        expect(realDoc.body.name).to.be.equal(docs[0].body.name);
        expect(realDoc.head).to.not.equal(docs[0].head);
        expect(realDoc.head.name).to.be.equal(docs[0].head.name);

        expect(realDoc.body.children).to.have.lengthOf(2);
        realDoc.body.children.forEach((child, index) => {
            expect(child).to.be.instanceof(MyElement);
            expect(child).to.not.equal(docs[0].body.children[index]);
            expect(child.name).to.be.equal(docs[0].body.children[index].name);

            expect(child.parent).to.be.equal(realDoc.body);
            expect(child.children).to.have.lengthOf(1);
            expect(child.children[0].parent).to.be.equal(child);
            expect(child.children[0]).to.not.equal(docs[0].body.children[index].children[0]);
            expect(child.children[0].name).to.be.equal(docs[0].body.children[index].children[0].name);
        });
    });

    it('toReal - Processor', function () {
        var preInvokedCount = 0;
        var postInvokedCount = 0;

        toReal({
            a: [1, 2, 3],
            b: {
                c: {},
                d: 'a'
            }
        }, {
            pre: (obj) => {
                preInvokedCount++;
                return obj;
            },
            post: (obj) => {
                postInvokedCount++;
                return obj;
            }
        });
        expect(preInvokedCount).to.be.equal(4);
        expect(postInvokedCount).to.be.equal(4);
    });

    it('syncReal - Basic', function () {
        var docs = prepareDocs(1, 2, 2);
        var plainDocs = toPlain(docs);
        var realDocs = [];
        var syncRealDocs = syncReal(realDocs, plainDocs);

        expect(syncRealDocs).to.have.lengthOf(1);

        var syncRealDoc = syncRealDocs[0];
        expect(syncRealDoc).to.be.instanceof(MyDocument);
        expect(syncRealDoc.name).to.be.equal(docs[0].name);

        expect(syncRealDoc.body).to.be.instanceof(MyElement);
        expect(syncRealDoc.head).to.be.instanceof(MyElement);
        expect(syncRealDoc.body.name).to.be.equal(docs[0].body.name);
        expect(syncRealDoc.head.name).to.be.equal(docs[0].head.name);

        expect(syncRealDoc.body.children).to.have.lengthOf(2);
        syncRealDoc.body.children.forEach((child, index) => {
            expect(child).to.be.instanceof(MyElement);
            expect(child.name).to.be.equal(docs[0].body.children[index].name);

            expect(child.parent).to.be.equal(syncRealDoc.body);
            expect(child.children).to.have.lengthOf(1);
            expect(child.children[0].parent).to.be.equal(child);
            expect(child.children[0].name).to.be.equal(docs[0].body.children[index].children[0].name);
        });
    });

    it('syncReal - Processor', function () {
        var el = new MyElement();
        var plainEl = toPlain(el);
        var preInvokedCount = 0;
        var postInvokedCount = 0;

        syncReal(el, plainEl, {
            pre: (obj) => {
                preInvokedCount++;
                return obj;
            },
            post: (obj) => {
                postInvokedCount++;
                return obj;
            }
        });
        expect(el[GUID_SENTINEL]).to.be.equal(plainEl[GUID_SENTINEL]);
        expect(preInvokedCount).to.be.equal(2);
        expect(postInvokedCount).to.be.equal(2);
    });

    it('syncReal Diff - Removing node', function () {
        var docs = prepareDocs(1, 2, 2);
        var plainDocs = toPlain(docs);
        var realDocs = [];
        var syncRealDocs = syncReal(realDocs, plainDocs);

        var detachedNode = docs[0].body.children[0];
        detachedNode.detach();
        expect(docs[0].body.children).to.have.lengthOf(1);
        expect(docs[0].body.children[0].name).to.not.equal(detachedNode.name);

        var syncRealDoc = syncRealDocs[0];
        var bodyEl = syncRealDoc.body;
        var detachedEl = syncRealDocs[0].body.children[0];
        plainDocs = toPlain(docs);
        syncRealDocs = syncReal(syncRealDocs, plainDocs);

        expect(syncRealDocs[0]).to.be.equal(syncRealDoc);
        expect(syncRealDoc.body).to.be.equal(bodyEl);
        expect(syncRealDoc.body.children).to.have.lengthOf(1);
        expect(syncRealDoc.body.children[0].name).to.not.equal(detachedEl.name);
        expect(syncRealDoc.body.children[0].name).to.be.equal(docs[0].body.children[0].name);
        expect(syncRealDoc.body.children[0].parent).to.be.equal(syncRealDoc.body);
    });

    it('syncReal Diff - Adding node', function () {
        var docs = prepareDocs(1, 1, 1);
        // NOTE: toPlain will bind a guid to the object in `docs`
        var plainDocs = toPlain(docs);
        var realDocs = [];
        var syncRealDocs = syncReal(realDocs, plainDocs);

        var bodyChildNode = docs[0].body.children[0];
        var appendChildNode = new MyElement({name: 'New child element'});
        bodyChildNode.append(appendChildNode);

        var syncRealDoc = syncRealDocs[0];
        var bodyEl = syncRealDoc.body;
        var bodyChildEl = syncRealDocs[0].body.children[0];
        plainDocs = toPlain(docs);
        syncRealDocs = syncReal(syncRealDocs, plainDocs);

        expect(syncRealDocs[0]).to.be.equal(syncRealDoc);
        expect(syncRealDoc.body).to.be.equal(bodyEl);
        expect(syncRealDoc.body.children).to.have.lengthOf(1);
        expect(syncRealDoc.body.children[0]).to.be.equal(bodyChildEl);
        expect(bodyChildEl.parent).to.be.equal(syncRealDoc.body);

        expect(bodyChildEl.children).to.have.lengthOf(2);
        expect(bodyChildEl.children[1].name).to.be.equal(appendChildNode.name);
        expect(bodyChildEl.children[1].parent).to.be.equal(bodyChildEl);

        // If the new reference is pointing at top node, syncReal should work well too.
        bodyChildNode = plainDocs[0].body.children[0] = new MyElement({name: 'Another new element'});
        bodyChildNode.parent = {...plainDocs[0].body};
        bodyChildNode.children = [];
        bodyChildNode.parent.children = [];
        syncRealDocs = syncReal(syncRealDocs, plainDocs);

        expect(syncRealDocs[0]).to.be.equal(syncRealDoc);
        expect(syncRealDoc.body).to.be.equal(bodyEl);
        expect(syncRealDoc.body.children).to.have.lengthOf(1);
        expect(syncRealDoc.body.children[0]).to.not.equal(bodyChildEl);

        bodyChildEl = syncRealDoc.body.children[0];
        expect(bodyChildEl.name).to.be.equal(bodyChildNode.name);
        expect(bodyChildEl.parent).to.be.equal(syncRealDoc.body);
        expect(bodyChildEl.children).to.have.lengthOf(0);
    });

    it('diffReal - Basic', function () {
        var el = new MyElement({name: 'el'});
        var child = new MyElement({name: 'child'});
        var plainEl = toPlain(el);
        var newPlainEl = {...plainEl, children: [toPlain(child)]};

        diffReal(el, newPlainEl, plainEl);

        expect(el[GUID_SENTINEL]).to.be.equal(plainEl[GUID_SENTINEL]);
        expect(el.name).to.be.equal('el');
        expect(el.children).to.have.lengthOf(1);
        expect(el.children[0]).to.not.equal(child);
        expect(el.children[0]).to.have.properties({...child});
        expect(el.children[0]).to.be.instanceof(MyElement);

        plainEl = newPlainEl;
        newPlainEl = {...plainEl};
        var childEl = el.children[0];

        diffReal(el, newPlainEl, plainEl);
        expect(el.children).to.have.lengthOf(1);
        expect(el.children[0]).to.be.equal(childEl);

        plainEl = newPlainEl;
        newPlainEl = {...plainEl, children: []};

        diffReal(el, newPlainEl, plainEl);
        expect(el.children).to.have.lengthOf(0);
    });

    it('diffReal - Processor', function () {
        var el = new MyElement();
        var plainEl = toPlain(el);
        var preInvokedCount = 0;
        var postInvokedCount = 0;

        diffReal(el, plainEl, null, {
            pre: (obj) => {
                preInvokedCount++;
                return obj;
            },
            post: (obj) => {
                postInvokedCount++;
                return obj;
            }
        });
        expect(el[GUID_SENTINEL]).to.be.equal(plainEl[GUID_SENTINEL]);
        expect(preInvokedCount).to.be.equal(2);
        expect(postInvokedCount).to.be.equal(2);
    });
});
