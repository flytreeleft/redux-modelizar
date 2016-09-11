import createState, {isState} from './state/createState';

// https://github.com/arqex/freezer-redux-devtools
// https://github.com/gaearon/redux-devtools
// https://github.com/zalmoxisus/redux-devtools-extension
// http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
export default function enableReduxDevTools() {
    return window.devToolsExtension ? window.devToolsExtension({
        deserializeState: (state) => isState(state) ? state : createState(state),
        serializeState: (key, value) => isState(value) ? value.valueOf() : value
    }) : (f) => f;
}
