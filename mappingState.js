import forEach from './utils/forEach';
import changeObjectType from './utils/changeObjectType';
import {
    parseObjClass
} from './object/sentinels';

import {
    default as proxy,
    getProxiedClass,
    proxyClass
} from './object/proxy';
import diffReal from './object/diffReal';
import bindHistory from './undoable/bindHistory';

export default function (store, target, mapping = {}) {
    var currentState;
    var bind = () => {
        var previousState = currentState;
        currentState = store.getState();

        forEach(mapping, (getter, prop) => {
            var previous = previousState && getter(previousState);
            var current = currentState && getter(currentState);
            if (current && current.same(previous)) {
                return;
            }

            var tag = 'Mapping state - diffReal';
            // console.time(tag);
            // console.profile(tag);
            target[prop] = diffReal(target[prop], current, previous, {
                // NOTE: No need deep proxy or proxy plain Object/Array,
                // `diffReal` will traverse all deeply.
                pre: (ro, roTop, roTopProp, src) => {
                    var srcCls = parseObjClass(src);
                    // If the real and source objects has the same guid,
                    // but hasn't the same constructor,
                    // change prototype of the real object and remain its reference.
                    if (ro.constructor !== srcCls
                        && getProxiedClass(ro) !== srcCls) {
                        // Make sure the `ro` reference always no change.
                        ro = changeObjectType(ro, proxyClass(srcCls));
                    }
                    return proxy(store, ro, false);
                },
                post: (ro) => bindHistory(store, ro)
            });
            // console.profileEnd();
            // console.timeEnd(tag);
        });
    };

    store.subscribe(bind);
    // Trigger first binding.
    bind();
}
