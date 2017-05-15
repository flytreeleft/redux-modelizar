import {
    createStore,
    applyMiddleware,
    compose,
    combineReducers,
    enableReduxDevTools
} from 'redux-modelizar';

import {
    documents
} from './reducers';

const Store = {
    create: (initialState, options = {}) => {
        var rootReducer = combineReducers({
            docs: documents
        });
        var enhancer = compose(applyMiddleware(), enableReduxDevTools());

        options = Object.assign({debug: true}, options);
        return createStore(rootReducer, initialState, enhancer, options);
    }
};

export default Store;
