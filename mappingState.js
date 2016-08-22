import forEach from './utils/forEach';

import proxy from './object/proxy';
import syncReal from './object/syncReal';
import bindHistory from './undoable/bindHistory';

export default function (store, obj, mapping) {
    var currentState;
    var bind = () => {
        var previousState = currentState;
        currentState = store.getState();

        forEach(mapping, (getter, prop) => {
            var previous = previousState ? getter(previousState) : null;
            var current = currentState ? getter(currentState) : null;
            if (previous === current) {
                return;
            }

            obj[prop] = syncReal(obj[prop], current, {
                // NOTE: No need deep proxy, `syncReal` will traverse all deeply.
                pre: obj => proxy(store, obj, false),
                post: obj => bindHistory(store, obj)
            });
        });
    };

    store.subscribe(bind);
    // Trigger first binding.
    bind();
}
