export default function (obj, prop) {
    if (!obj || !prop || !(prop in obj)) {
        return true;
    }

    var des = Object.getOwnPropertyDescriptor(obj, prop);
    return !des || des.writable;
}
