import { applyMiddleware } from "redux";

/*If it is an object of slice reducers, like 
{users : usersReducer, posts : postsReducer}, 
configureStore will automatically create the 
root reducer by passing this object to the Redux 
combineReducers utility.*/
import { configureStore} from '@reduxjs/toolkit'

import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import combineReducers from "../reducers/combine_reducer";

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

/*If this option is provided, it should contain all the middleware 
functions you want added to the store. configureStore will 
automatically pass those to applyMiddleware.
If not provided, configureStore will call getDefaultMiddleware 
and use the array of middleware functions it returns.*/
const middleware = [thunk];

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, combineReducers)

export const store = configureStore ({
        reducer: persistedReducer,
        middleware: getDefaultMiddleware =>
                            getDefaultMiddleware({
                                serializableCheck: false,
                            }),
});
export const persistor = persistStore(store);
export default {store, persistor};


