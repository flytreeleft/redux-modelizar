import forEach from './utils/forEach';

import proxy from './object/proxy';
import syncReal from './object/syncReal';
import bindHistory from './undoable/bindHistory';

export default function mappingState(store, obj, mapping) {
    var currentState;
    store.subscribe(() => {
        var previousState = currentState;
        currentState = store.getState();

        forEach(mapping, (getter, prop) => {
            var previous = previousState ? getter(previousState) : null;
            var current = getter(currentState);
            if (previous === current) {
                return;
            }

            var start = new Date();
            obj[prop] = syncReal(obj[prop], current, {
                // NOTE: No need deep proxy, `syncReal` will traverse all deeply.
                pre: obj => proxy(store, obj, false),
                post: obj => bindHistory(store, obj)
            });
            var end = new Date();
            console.log('[Modelizar]: sync real %fms.', end.getTime() - start.getTime());
        });
    });
}
