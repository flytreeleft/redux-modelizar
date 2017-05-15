import {expect} from 'chai';

import last from 'lodash/last';

import {guid} from 'immutable-js';
import {
    createStore,
    combineReducers,
    compose,
    applyMiddleware,
    enableReduxDevTools
} from 'redux-modelizar';
import {
    documents
} from './reducers';

import MyDocument from './model/MyDocument';
import MyElement from './model/MyElement';
import DivElement from './model/DivElement';

const Store = {
    create: (initialState, options = {}) => {
        var rootReducer = combineReducers({
            docs: documents
        });
        var enhancer = compose(applyMiddleware(), enableReduxDevTools());

        options = Object.assign({
            debug: true,
            undoable: (state, cls) => {
                if (cls === MyDocument) {
                    return {
                        deep: true,
                        limit: -1
                    };
                }
            }
        }, options);
        return createStore(rootReducer, initialState, enhancer, options);
    }
};

describe('History redo/undo', function () {
    this.timeout(60 * 1000);

    it('Document redo/undo', function () {
        var store = Store.create();
        var browser = createBrowser(store);

        var doc = new MyDocument({
            name: 'Undoable document'
        });
        browser.openDocument(doc);

        var openDoc = browser.docs[0];
        var total = 100;
        var div;
        var i = total;
        var tag = 'Add nodes';

        console.time(tag);
        while (i--) {
            div = new DivElement({
                name: `Div#${i}`
            });
            openDoc.body.append(div);

            let appendedDiv = last(openDoc.body.children);
            checkElement(appendedDiv, div);
            expect(appendedDiv.parent).to.be.equal(openDoc.body);
            expect(appendedDiv.children).to.have.lengthOf(0);

            let bodyChildrenState = store.getState().docs[0].body.children;
            expect(guid(bodyChildrenState)).to.be.equal(guid(openDoc.body.children));
            expect(bodyChildrenState.size()).to.be.equal(openDoc.body.children.length);

            let appendedDivState = bodyChildrenState[bodyChildrenState.size() - 1];
            expect(guid(appendedDivState)).to.be.equal(guid(appendedDiv));
            expect(appendedDivState.name).to.be.equal(appendedDiv.name);
            expect(appendedDivState.parent.isCycleRef()).to.be.true;
            expect(appendedDivState.parent.valueOf()).to.be.equal(guid(appendedDiv.parent));
        }
        console.timeEnd(tag);
        // Undo
        i = total;
        tag = 'Undo document';
        console.time(tag);
        while (i--) {
            openDoc.history.undo();

            let bodyChildrenState = store.getState().docs[0].body.children;
            expect(openDoc.body.children).to.have.lengthOf(i);
            expect(guid(bodyChildrenState)).to.be.equal(guid(openDoc.body.children));
            expect(bodyChildrenState.size()).to.be.equal(openDoc.body.children.length);

            if (i > 0) {
                let appendedDiv = last(openDoc.body.children);
                let appendedDivState = bodyChildrenState[bodyChildrenState.size() - 1];
                expect(appendedDiv.name).to.be.equal(`Div#${total - i}`);
                expect(guid(appendedDivState)).to.be.equal(guid(appendedDiv));
                expect(appendedDivState.name).to.be.equal(appendedDiv.name);
                expect(appendedDivState.parent.isCycleRef()).to.be.true;
                expect(appendedDivState.parent.valueOf()).to.be.equal(guid(appendedDiv.parent));
            }
        }
        console.timeEnd(tag);
        // Redo
        i = total;
        tag = 'Redo document';
        console.time(tag);
        while (i--) {
            openDoc.history.redo();

            let bodyChildrenState = store.getState().docs[0].body.children;
            expect(openDoc.body.children).to.have.lengthOf(total - i);
            expect(guid(bodyChildrenState)).to.be.equal(guid(openDoc.body.children));
            expect(bodyChildrenState.size()).to.be.equal(openDoc.body.children.length);

            let appendedDiv = last(openDoc.body.children);
            let appendedDivState = bodyChildrenState[bodyChildrenState.size() - 1];
            expect(appendedDiv.name).to.be.equal(`Div#${i}`);
            expect(guid(appendedDivState)).to.be.equal(guid(appendedDiv));
            expect(appendedDivState.name).to.be.equal(appendedDiv.name);
            expect(appendedDivState.parent.isCycleRef()).to.be.true;
            expect(appendedDivState.parent.valueOf()).to.be.equal(guid(appendedDiv.parent));
        }
        console.timeEnd(tag);
    });
});

function createBrowser(store) {
    var browser = {};

    store.bind(browser, {
        docs: state => state.docs
    });

    browser.openDocument = function (doc) {
        this.docs.push(doc);

        var openDoc = last(browser.docs);
        expect(openDoc).to.be.equal(doc);

        expect(openDoc.history).to.not.be.null;
        expect(openDoc.history).to.not.be.undefined;
        expect(openDoc.history.undo).to.be.instanceof(Function);
        expect(openDoc.history.redo).to.be.instanceof(Function);
    };

    return browser;
}

function checkElement(el, origEl) {
    expect(el).to.be.instanceof(MyElement);
    expect(el).to.be.equal(origEl);
}
