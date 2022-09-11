import { combineReducers } from "redux";
import AuthReducer from "./auth_reducer";
import UserReducer from "./user_reducer";

export default combineReducers({
    AuthReducer,
    UserReducer,
});
