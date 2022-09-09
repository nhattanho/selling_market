import { LOGIN, LOGOUT } from "./types_actions";

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
