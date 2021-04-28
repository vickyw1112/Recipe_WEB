import { createStore, combineReducers, applyMiddleware, compose } from "redux";

import thunk from "redux-thunk";

import ingredientReducer from "./reducers/ingredient";
import tagReducer from "./reducers/tag";
import blackListReducer from "./reducers/blackList";
import fetchSearchResultReducer from "./reducers/fetchSearchResult";
import loginReducer from "./reducers/login";

let rootReducer = combineReducers({
    ingredient: ingredientReducer,
    tag: tagReducer,
    blackList: blackListReducer,
    fetchSearchResult: fetchSearchResultReducer,
    login: loginReducer,
});

const composeEnhancers =
    typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
              // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
          })
        : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));
// export default createStore(rootReducer, enhancer);
const store = createStore(rootReducer, enhancer);
export default store;
