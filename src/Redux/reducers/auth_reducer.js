import {LOGIN, LOGOUT} from '../actions/types_actions.js';

const initialState = {
    isLogin: false,
    userLoginData: {},
};

const AuthReducer = (state = initialState, action) => {
    const {payload, type} = action;
    switch (type) {
      case LOGIN:
        return {
          ...state,
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