import {expect} from 'chai';

import cloneDeep from 'lodash/cloneDeep';

import {
    applyMiddleware,
    compose
} from 'redux';

import {
    createStore,
    enableReduxDevTools
} from 'redux-modelizar';

import MyDocument from './model/MyDocument';
import MyElement from './model/MyElement';

const MUTATE_STATE_BY_PATH = '@@redux-modelizar/test/MUTATE_STATE_BY_PATH';
const mutateStateByPath = (path, value, remove) => ({type: MUTATE_STATE_BY_PATH, path, value, remove});
const Store = {
    create: (initialState, options = {}) => {
        var rootReducer = (state = {}, action) => {
            switch (action.type) {
                case MUTATE_STATE_BY_PATH:
                    if (action.remove) {
                        return state.remove(action.path);
                    } else {
                        return state.set(action.path, action.value);
                    }
                default:
                    return state;
            }
        };
        var enhancer = compose(applyMiddleware(), enableReduxDevTools());

        return createStore(rootReducer, initialState, enhancer);
    }
};

describe('Redux modelizar state mapping:', function () {
    it('Object mapping', function () {
        var obj = {
            a: {
                b: {
                    c: 'c'
                },
                e: 'e'
            }
        };
        var store = Store.create(obj);
        var target = store.mapping(false);

        expect(target).to.not.equal(obj);
        expect(target).to.have.properties(obj);
        expect(store.getState()).to.have.properties(target);
        // Mutate target
        var b = target.a.b;
        var cc = b.c = 'cc';
        expect(target.a.b.c).to.be.equal(cc);
        // Reference and value check at the same time.
        expect(target.a.b).to.be.equal(b);
        expect(target.a.b).to.have.properties(b);
        expect(store.getState()).to.have.properties(target);

        var e = target.a.e = {e: 'e'};
        expect(target.a.e).to.have.properties(e);
        expect(target.a.e).to.have.properties({e: 'e'});
        expect(store.getState()).to.have.properties(target);
    });

    it('Array mapping', function () {
        var array = [1, 2, 3];
        var store = Store.create(array);
        var target = store.mapping(false);

        expect(target).to.be.instanceof(Array);
        expect(target).to.not.equal(array);
        expect(target).to.have.members(array);
        expect(store.getState()).to.have.properties(target);

        var index_1 = target[1] = 'a';
        expect(target[1]).to.be.equal(index_1);
        expect(store.getState()).to.have.properties(target);

        var index_3 = 4;
        target.push(index_3);
        expect(target[3]).to.be.equal(index_3);
        expect(store.getState()).to.have.properties(target);

        index_3 = target[3] = 'b';
        expect(target[3]).to.be.equal(index_3);
        expect(store.getState()).to.have.properties(target);

        var len = target.length;
        target.pop();
        expect(target.length).to.be.equal(len - 1);
        expect(store.getState()).to.have.properties(target);

        len = target.length;
        target.shift();
        expect(target.length).to.be.equal(len - 1);
        expect(store.getState()).to.have.properties(target);

        var newArray = ['a', 'b', 'c'];
        target.splice.apply(target, [0, 2].concat(newArray));
        expect(target).to.have.members(newArray);
        expect(store.getState()).to.have.properties(target);

        target.reverse();
        expect(target).to.have.members(newArray.concat().reverse());
        expect(store.getState()).to.have.properties(target);

        target.sort();
        expect(target).to.have.members(newArray);
        expect(store.getState()).to.have.properties(target);

        var obj = target[0] = {a: 1, b: []};
        expect(target[0]).to.be.equal(obj);
        expect(target[0]).to.have.properties(obj);
        expect(store.getState()).to.have.properties(target);
    });

    it('Immutable mapping', function () {
        var obj = {
            a: 'a',
            b: [{
                c: {d: 'd'}
            }]
        };
        var store = Store.create(obj);
        var target = store.mapping(true);

        expect(target).to.not.equal(obj);
        expect(target).to.have.properties(obj);
        expect(store.getState()).to.have.properties(target);

        expect(() => {
            target.a = 'aa';
        }).to.throw(Error);
        expect(() => {
            target.b = [];
        }).to.throw(Error);
        expect(() => {
            target.b[0].c = [];
        }).to.throw(Error);
        expect(() => {
            target.b[0].c.d = 'dd';
        }).to.throw(Error);
        expect(store.getState()).to.have.properties(target);

        var e = {e: 'e'};
        target.b.push(e);
        expect(target.b[target.b.length - 1]).to.have.properties(e);
        expect(store.getState()).to.have.properties(target);

        expect(() => {
            target.b[1].e = 'ee';
        }).to.throw(Error);
    });

    it('Mutate state by detached mapping', function () {
        var obj = {
            a: {b: 'b'}
        };
        var store = Store.create(obj);
        var target = store.mapping(false);

        expect(target).to.not.equal(obj);
        expect(target).to.have.properties(obj);
        expect(store.getState()).to.have.properties(target);

        // Detach
        var a = target.a;
        target.a = null;
        expect(target.a).to.be.null;
        expect(store.getState()).to.have.properties(target);

        var bb = a.b = 'bb';
        expect(a.b).to.be.equal(bb);
        expect(target.a).to.be.null;
        expect(store.getState()).to.have.properties(target);

        var b = {c: 'c', d: {e: 'e'}};
        a.b = cloneDeep(b);
        expect(a.b).to.have.properties(b);
        expect(target.a).to.be.null;
        expect(store.getState()).to.have.properties(target);

        target.a = a;
        expect(target.a).to.be.equal(a);
        expect(target.a).to.have.properties({b: b});
        expect(target.a.b).to.be.equal(a.b);
        expect(target.a.b).to.have.properties(b);
        expect(target.a.b.c).to.be.equal(b.c);
        expect(target.a.b.d).to.be.equal(a.b.d);
        expect(target.a.b.d).to.have.properties(b.d);
        expect(store.getState()).to.have.properties(target);

        var ee = target.a.b.d.e = 'ee';
        expect(target.a.b.d.e).to.be.equal(ee);
        expect(store.getState()).to.have.properties(target);
    });

    it('Properties added/removed through .$set()/.$remove()', function () {
        var obj = {};
        var store = Store.create(obj);
        var target = store.mapping(false);
        var protoGet = (obj, prop) => {
            var proto = Object.getPrototypeOf(obj);
            return proto.hasOwnProperty(prop) ? proto[prop] : undefined;
        };

        var a = {b: [], c: 'c'};
        expect(protoGet(target, '$set')).to.be.instanceof(Function);
        expect(protoGet(target, '$remove')).to.be.instanceof(Function);

        target.$set('a', a);
        expect(protoGet(target.a, '$set')).to.be.instanceof(Function);
        expect(protoGet(target.a, '$remove')).to.be.instanceof(Function);
        expect(protoGet(target.a.b, '$set')).to.be.undefined;
        expect(protoGet(target.a.b, '$remove')).to.be.undefined;
        expect(target.a).to.have.properties(a);
        expect(store.getState()).to.have.properties(target);

        var b_1 = {};
        target.$set('a.b[1]', b_1);
        expect(target.a.b).to.have.lengthOf(2);
        expect(target.a.b[0]).to.be.undefined;
        expect(target.a.b[1]).to.have.properties(b_1);
        expect(store.getState().a.b[1]).to.have.properties(target.a.b[1]);

        expect(target.a.c).to.be.equal(a.c);
        target.$remove('a.c');
        expect(target.a.c).to.be.undefined;
        expect(store.getState().a.c).to.have.properties(target.a.c);

        target.$remove('a.b[1]');
        expect(target.a.b).to.have.lengthOf(1);
        expect(target.a.b[0]).to.be.undefined;
        expect(store.getState().a.b[1]).to.have.properties(target.a.b[1]);
    });

    it('Cross reference check', function () {
        var obj = {
            a: {
                b: {c: 'c'}
            },
            h: undefined,
            i: null
        };
        var store = Store.create(obj);
        var target = store.mapping(false);

        expect(target).to.not.equal(obj);
        expect(target).to.have.properties(obj);
        expect(store.getState()).to.have.properties(target);

        var b = target.a.b;
        target.h = b;
        expect(target.h).to.be.equal(target.a.b);
        expect(target.h).to.deep.equal(target.a.b);
        expect(store.getState().get('a.b')).to.have.properties(target.a.b);
        expect(store.getState().get('h').isCycleRef()).to.be.true;
        // Detach after referring
        target.a.b = null;
        expect(target.a.b).to.be.null;
        expect(target.h).to.not.be.null;
        expect(store.getState().get('a.b')).to.be.null;
        expect(store.getState().get('h').isCycleRef()).to.be.true;
        expect(target.h).to.deep.equal(b);

        target.i = b;
        expect(target.a.b).to.be.null;
        expect(target.h).to.not.be.null;
        expect(target.i).to.be.equal(b);
        expect(target.i).to.deep.equal(b);
        expect(target.i).to.be.equal(target.h);
        expect(store.getState().get('a.b')).to.be.null;
        expect(store.getState().get('h').isCycleRef()).to.be.true;
        expect(store.getState().get('i')).to.have.properties(target.i);
    });

    it('Parent and child reference check', function () {
        var child = {name: 'child', parent: null};
        var parent = {name: 'parent', children: [child]};
        child.parent = parent;

        var obj = {p: parent};
        var store = Store.create(obj);
        var target = store.mapping(false);

        expect(store.getState().p.isCycleRef()).to.be.false;
        expect(store.getState().p.children.isCycleRef()).to.be.false;
        expect(store.getState().p.children[0].isCycleRef()).to.be.false;
        expect(store.getState().p.children[0].parent.isCycleRef()).to.be.true;

        expect(target.p).to.not.equal(parent);
        expect(target.p.children).to.not.equal(parent.children);
        expect(target.p.children[0]).to.not.equal(child);
        expect(target.p.children[0]).to.not.equal(parent.children[0]);
        expect(target.p.name).to.be.equal(parent.name);
        expect(target.p.children[0]).to.not.be.null;
        expect(target.p.children[0].name).to.be.equal(child.name);
        expect(target.p.children[0].parent).to.be.equal(target.p);
        expect(target.p.children[0].parent.children).to.be.equal(target.p.children);

        target.p.children[0].parent = null;
        expect(store.getState().p.children[0].parent).to.be.null;
        expect(target.p.children[0].parent).to.be.null;
        expect(target.p.children[0].name).to.be.equal(child.name);
        expect(target.p.name).to.be.equal(parent.name);
    });

    it('Model mapping', function () {
        var doc = new MyDocument({name: 'doc1'});
        var store = Store.create(doc);
        var target = store.mapping(true);

        expect(target).to.not.equal(doc);
        expect(target).to.have.properties(doc);
        expect(target).to.be.instanceof(MyDocument);
        expect(store.getState()).to.have.properties(target);

        expect(() => {
            target.name = 'doc1*';
        }).to.throw(Error);

        var invokingNumber = 0;
        store.subscribe(() => {
            invokingNumber++;
        });

        // No mutation callback
        expect(target.rename).to.instanceof(Function);
        expect(target.rename).to.not.equal(MyDocument.prototype.rename);
        target.rename();
        expect(invokingNumber).to.be.equal(0);

        var el = new MyElement({tag: 'div', name: 'e1', title: 'el #1'});
        expect(target.body.contains(el)).to.be.false;
        expect(invokingNumber).to.be.equal(0);

        expect(() => {
            target.body.children = [el];
        }).to.throw(Error);

        expect(target.body.append).to.instanceof(Function);
        expect(target.body.append).to.not.equal(MyElement.prototype.append);
        target.body.append(el);
        expect(invokingNumber).to.be.equal(1);
        expect(target.body.children[0]).to.be.instanceof(MyElement);
        expect(target.body.children[0]).to.be.equal(el);
        expect(target.body).to.be.equal(el.parent);
        expect(store.getState().get('body.children[0].parent').isCycleRef()).to.be.true;
    });

    it('Date mapping', function () {
        var obj = {date: new Date()};
        var store = Store.create(obj);
        var target = store.mapping(true);

        expect(target).to.not.equal(obj);
        expect(target.date).to.instanceof(Date);
        expect(obj.date.getTime()).to.be.equal(target.date.getTime());
        expect(store.getState().get('date').isDate()).to.be.true;
        expect(store.getState().get('date').valueOf()).to.be.equal(obj.date.getTime());

        var invokingNumber = 0;
        store.subscribe(() => {
            invokingNumber++;
        });

        expect(target.date.getTime).to.instanceof(Function);
        expect(target.date.getTime).to.be.equal(Date.prototype.getTime);
        target.date.getTime();
        expect(invokingNumber).to.be.equal(0);

        expect(target.date.setTime).to.instanceof(Function);
        expect(target.date.setTime).to.not.equal(Date.prototype.setTime);
        target.date.setTime(0);
        expect(invokingNumber).to.be.equal(1);
        expect(target.date.getTime()).to.be.equal((new Date(0)).getTime());
    });

    it('Batch mutation check', function () {
        var obj = {
            a: 'a',
            b: {
                c: [1, 2, 3]
            },
            d: [{
                e: 'e',
                f: 'f'
            }]
        };
        var store = Store.create(obj);
        var target = store.mapping(true);

        expect(target).to.not.equal(obj);
        expect(target).to.have.properties(obj);
        expect(store.getState()).to.have.properties(target);

        var invokingNumber = 0;
        store.subscribe(() => {
            invokingNumber++;
        });

        store.doBatch(() => {
            target.a = 'aa';
            target.b.c = [];
            target.d[0] = {e: 'ee', f: 'ff'};
        });
        expect(invokingNumber).to.be.equal(1);
        expect(target).to.have.properties({
            a: 'aa',
            b: {c: []},
            d: [{e: 'ee', f: 'ff'}]
        });
        expect(store.getState()).to.have.properties(target);

        // Nested batching
        invokingNumber = 0;
        store.doBatch(() => {
            target.b.c.push('a', 'b', 'c');
            target.d.push({g: 'g', h: 'h'});
        });
        expect(invokingNumber).to.be.equal(1);
        expect(target).to.have.properties({
            a: 'aa',
            b: {c: ['a', 'b', 'c']},
            d: [{e: 'ee', f: 'ff'}, {g: 'g', h: 'h'}]
        });
        expect(store.getState()).to.have.properties(target);
    });

    it('Mutate store state by store.dispatch()', function () {
        var obj = [{a: 'a'}, {
            b: {
                c: 'd',
                d: [1, 2, 3]
            },
            e: ['a', 'b', 'c']
        }];
        var store = Store.create(obj);
        var target = store.mapping(true);

        expect(target).to.not.equal(obj);
        expect(target).to.have.properties(obj);
        expect(store.getState()).to.have.properties(target);

        store.dispatch(mutateStateByPath('0.a', (obj[0].a = 'aa')));
        expect(target).to.have.properties(obj);
        expect(store.getState()).to.have.properties(target);

        store.dispatch(mutateStateByPath('[1].b.d[0]', (obj[1].b.d[0] = 'a')));
        expect(target).to.have.properties(obj);
        expect(store.getState()).to.have.properties(target);

        var len = target[1].e.length;
        store.dispatch(mutateStateByPath('[1].e[1]', obj[1].e.splice(1, 1), true));
        expect(target[1].e).to.have.lengthOf(len - 1);
        expect(target[1].e).to.have.members(obj[1].e);

        store.dispatch(mutateStateByPath('[1].e', (obj[1].e = {a: 1, b: 2, c: 3})));
        expect(target).to.have.properties(obj);
        expect(store.getState()).to.have.properties(target);

        store.dispatch(mutateStateByPath('[1].b.d', (obj[1].b.d = undefined), true));
        expect(store.getState().get('[1].b.d')).to.be.undefined;
        expect(target[1].b.d).to.be.undefined;
        expect(obj).to.have.properties(target);
    });

    it('Root state mutation', function () {
        var store = Store.create();
        var target = store.mapping();

        expect(target).to.be.instanceof(Object);
        expect(store.getState()).to.have.properties(target);

        target = store.bind({}, {
            a: (state) => state.get('a'),
            b: (state) => state.get('b')
        });

        var obj = {a: 'a', b: [1, 2, 3]};
        store.dispatch(mutateStateByPath([], obj));

        expect(target).to.not.equal(obj);
        expect(obj).to.have.properties(target);
        expect(store.getState()).to.have.properties(target);
    });

    it('Function mapping', function () {
        var obj = {fn: null};
        var store = Store.create(obj);
        var target = store.mapping(false);

        expect(target).to.have.properties(obj);
        expect(store.getState()).to.have.properties(target);

        var val = 'a';
        var fn = () => val;
        store.dispatch(mutateStateByPath(['fn'], fn));

        expect(target.fn).to.be.instanceof(Function);
        expect(target.fn).to.be.equal(fn);
        expect(target.fn()).to.be.equal(fn());

        val = 'b';
        target.fn = fn = () => val;
        expect(target.fn).to.be.instanceof(Function);
        expect(target.fn).to.be.equal(fn);
        expect(target.fn()).to.be.equal(fn());

        var Cls = function () {
            this.name = 'Class';
        };
        Cls.prototype.getName = function () {
            return this.name;
        };
        store.dispatch(mutateStateByPath('cls', Cls));
        expect(target.cls).to.be.equal(Cls);
    });

    it('', function () {
        // TODO [{A}]变更为[{A'}, {B}]时，State里的{A}应该为更新后的A'，而不是一个引用对象
        // TODO [{A}, {B}, {C}]变更为[{A}, {C}]时，{C}应该不是引用对象
        // TODO P: {children: [{A}]} => P: {children: [{A}, {B}]} && A与B的parent引用到P，则A与B的parent应该均为指向P的引用对象
        // TODO [{A}, {B}] => [{A}, {C}, {B}]，则A、B、C均不为引用对象
    });

    it('', function () {
        // TODO 先被新属性引用再删除原引用，新引用应该为一个对象
    });
});
