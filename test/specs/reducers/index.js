import isString from 'lodash/isString';

const OPEN_DOCUMENT = '@@redux-modelizar/test/OPEN_DOCUMENT';
const CLOSE_DOCUMENT = '@@redux-modelizar/test/CLOSE_DOCUMENT';

export function loadDocument(url) {
    return function (dispatch) {
        // TODO Fetch document from url, then dispatch openDocument
    };
}

export function openDocument(doc) {
    if (isString(doc)) {
        return loadDocument(doc);
    } else {
        return {
            type: OPEN_DOCUMENT,
            doc
        };
    }
}

export function closeDocument(doc) {
    return {
        type: CLOSE_DOCUMENT,
        doc
    };
}

export function documents(state = [], action = {}) {
    let doc = action.doc;
    switch (action.type) {
        case OPEN_DOCUMENT:
            return doc ? state.push(doc) : state;
        case CLOSE_DOCUMENT:
            return state.filter((d, index) => {
                return !d.same(doc) && index !== doc;
            });
        default:
            return state;
    }
}
