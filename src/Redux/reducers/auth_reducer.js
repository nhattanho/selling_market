import {LOGIN, LOGOUT} from '../actions/types_actions.js';
import {persistor} from '../store/store.js';

const initialState = {
    isLogin: false,
    userLoginData: {},
};

const AuthReducer = (state = initialState, action) => {
    const {payload, type} = action;
    switch (type) {
      case LOGIN:
        return {
          isLogin: true,
          userLoginData: payload.userLoginData,
        };
  
      case LOGOUT:
        return {
          ...state,
          isLogin: false,
        };

      default:
        return state;
    }
  };

export default AuthReducer;