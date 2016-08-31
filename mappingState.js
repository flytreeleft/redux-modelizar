import forEach from './utils/forEach';
import valueOf from './utils/valueOf';

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
            if (previous === current || valueOf(previous) === valueOf(current)) {
                return;
            }

            obj[prop] = syncReal(obj[prop], valueOf(current), {
                // NOTE: No need deep proxy, `syncReal` will traverse all deeply.
                pre: (real) => proxy(store, real, false),
                post: (real) => bindHistory(store, real)
            });
        });
    };

    store.subscribe(bind);
    // Trigger first binding.
    bind();
}
