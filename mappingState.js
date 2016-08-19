import forEach from './utils/forEach';

import proxy from './object/proxy';
import syncReal from './object/syncReal';

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
            // NOTE: No need deep proxy, `syncReal` will traverse all deeply.
            obj[prop] = syncReal(obj[prop], current, obj => proxy(store, obj, false));
            var end = new Date();
            console.log('[Modelizar]: sync real %fms.', end.getTime() - start.getTime());
        });
    });
}
