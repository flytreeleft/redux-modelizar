/**
 * Creates non-enumerable property descriptors, to be used by Object.create.
 *
 * Source: https://github.com/arqex/freezer/blob/master/src/utils.js#L58
 *
 * @param  {Object} attrs Properties to create descriptors
 * @return {Object} A hash with the descriptors.
 */
export default function createNE(attrs) {
    var ne = {};

    Object.keys(attrs).forEach((attr) => {
        ne[attr] = {
            writable: true,
            configurable: true,
            enumerable: false,
            value: attrs[attr]
        };
    });

    return ne;
}
