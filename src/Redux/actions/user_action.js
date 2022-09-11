import { GET_USERS_FROM_DB, ADMIN_LOGOUT } from "./types_actions";

/*This action will be an "action argurment" passed into user reducer*/
const getusersAction = (arrayusers) => {
  return {
    type: GET_USERS_FROM_DB,
    payload: {
        arrayusers: arrayusers,
    }
  };
};

const adminLogout = () => {
  return {
    type: ADMIN_LOGOUT,
  };
};

export { getusersAction, adminLogout };