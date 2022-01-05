
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import reducer from "../reducers/index";

function configureStore() {
    const store = createStore(
        reducer,
        composeWithDevTools(
            applyMiddleware(thunk)
        )
    );
    
    return store;
}

export default configureStore;  