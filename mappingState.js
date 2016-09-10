import forEach from './utils/forEach';

import proxy from './object/proxy';
import diffReal from './object/diffReal';
import bindHistory from './undoable/bindHistory';

export default function (store, target, mapping = {}) {
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

            var tag = 'Mapping state - diffReal';
            console.time(tag);
            // console.profile(tag);
            target[prop] = diffReal(target[prop], current, previous, {
                // NOTE: No need deep proxy or proxy plain Object/Array,
                // `diffReal` will traverse all deeply.
                pre: (obj) => {
                    return proxy(store, obj, false);
                },
                post: (obj) => bindHistory(store, obj)
            });
            // console.profileEnd();
            console.timeEnd(tag);
        });
    };

    store.subscribe(bind);
    // Trigger first binding.
    bind();
}
