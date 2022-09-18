import { 
  GET_USERS_FROM_DB, 
  ADMIN_LOGOUT, 
  ADD_NEW_USER,
  DELETE_USER,
  UPDATED_SINGLE_USER,
 } from "./types_actions";

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
};

const deleteUserForAdmin = (newarrayusers) => {
  //console.log("newUserdata from user action", newUserData);
  return {
    type: DELETE_USER,
    payload: {
      arrayusers: newarrayusers,
  }
  }
}

const updateSingleUser = (updatedUser) => {
  //console.log("newUserdata from user action", newUserData);
  return {
    type: UPDATED_SINGLE_USER,
    payload: {
      updatedUser: updatedUser,
  }
  }
}
export { getusersAction, adminLogout, 
  addNewUser, deleteUserForAdmin,
  updateSingleUser };