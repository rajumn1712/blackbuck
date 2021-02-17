import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk'
import authReducer from '../reducers/auth';
import chatReducer from '../utils/chat-system/chatReducer';
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["oidc", "chatHistory"]
}
const rootReducer = combineReducers({
    oidc: authReducer,
    chatHistory: chatReducer
})
const reducer = persistReducer(persistConfig, rootReducer)
let store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunk)),
);
const persistor = persistStore(store);

export { store, persistor }