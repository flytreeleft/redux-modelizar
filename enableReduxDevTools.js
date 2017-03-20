import Immutable from 'immutable';

// https://github.com/arqex/freezer-redux-devtools
// https://github.com/gaearon/redux-devtools
// https://github.com/zalmoxisus/redux-devtools-extension
// http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
export default function enableReduxDevTools() {
    var extension = window.__REDUX_DEVTOOLS_EXTENSION__ || window.devToolsExtension;

    return extension ? extension({
        // Adapt to Redux Dev Tools v2.12+
        serialize: {
            // Convert to JSON object
            replacer: (key, value) => value,
            // Convert to State object
            reviver: (key, value) => Immutable.isImmutable(value) ? value : Immutable.create(value)
        },
        // NOTE: In the latest version, (de)serializeState are replaced by serialize
        // See https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
        deserializeState: (state) => Immutable.isImmutable(state) ? state : Immutable.create(state),
        serializeState: (key, value) => value
    }) : (f) => f;
}
