/**
 * Try using the original `forEach` function,
 * if it doesn't exist, then trying traverse
 * every key and value by `Object.keys()`.
 */
export default function forEach(collection, iteratee) {
    if (!collection || !iteratee || !(collection instanceof Object)) {
        return;
    }

    if (typeof collection.forEach === 'function') {
        collection.forEach(iteratee);
    } else {
        Object.keys(collection).forEach(key => {
            var val = collection[key];

            return iteratee(val, key, collection);
        });
    }
}
