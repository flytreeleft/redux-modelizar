import isArray from 'lodash/isArray';

import forEach from './utils/forEach';
import valueOf from './utils/valueOf';
import isPlainObject from './utils/isPlainObject';

import proxy from './object/proxy';
import syncReal from './object/syncReal';
import bindHistory from './undoable/bindHistory';

export default function (store, obj, mapping = {}) {
    var currentState;
    var bind = () => {
        var previousState = currentState;
        currentState = store.getState();

        forEach(mapping, (getter, prop) => {
            var previous = previousState ? getter(previousState) : null;
            var current = currentState ? getter(currentState) : null;
            if (current && current.same(previous)) {
                return;
            }

            var tag = 'Mapping state - syncReal';
            console.time(tag);
            // console.profile(tag);
            obj[prop] = syncReal(obj[prop], valueOf(current), {
                // NOTE: No need deep proxy or proxy plain Object/Array,
                // `syncReal` will traverse all deeply.
                pre: (real) => {
                    if (real instanceof Object
                        && !isArray(real)
                        && !isPlainObject(real)) {
                        return proxy(store, real, false);
                    } else {
                        return real;
                    }
                },
                post: (real) => bindHistory(store, real)
            });
            // console.profileEnd();
            console.timeEnd(tag);
        });
    };

    store.subscribe(bind);
    // Trigger first binding.
    bind();
}
