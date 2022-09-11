import { LOGIN, LOGOUT } from "./types_actions";
import {persistor} from '../store/store.js';

const loginAction = (userLoginData) => {
  return {
    type: LOGIN,
    payload: {
        userLoginData: userLoginData,
    }
  };
};

const logoutAction = () => {
  return {
    type: LOGOUT,
  };
};

export { loginAction, logoutAction };
