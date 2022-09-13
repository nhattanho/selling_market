import { GET_USERS_FROM_DB, ADMIN_LOGOUT, ADD_NEW_USER } from "./types_actions";

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

const addNewUser = (newUserData) => {
  //console.log("newUserdata from user action", newUserData);
  return {
    type: ADD_NEW_USER,
    payload: {
      newUserData: newUserData,
    }
  }
}

export { getusersAction, adminLogout, addNewUser };