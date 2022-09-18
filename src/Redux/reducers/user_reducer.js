import {
  GET_USERS_FROM_DB, 
  ADMIN_LOGOUT,
  ADD_NEW_USER,
  DELETE_USER,
  UPDATED_SINGLE_USER,
} from '../actions/types_actions.js';

const initialState = {
    arrayusers: [],
    havegetuserfromdb: false,
};

/*Admin user should logout and login to get the latest update for user information*/
const UserReducer = (state = initialState, action) => {
    const {payload, type} = action;
    switch (type) {
      case GET_USERS_FROM_DB:
        return {
          ...state,
          arrayusers: payload.arrayusers,
          havegetuserfromdb: true,
        };
      case ADMIN_LOGOUT:
        return {
          ...state,
          arrayusers: [],
          havegetuserfromdb: false,
        };
      case ADD_NEW_USER:
        //console.log("in user reducer");
        const newArrayUsers = [...(state.arrayusers), payload.newUserData];
        return {
          ...state,
          arrayusers: newArrayUsers,
          havegetuserfromdb: true,
        }
      case DELETE_USER:
        return {
          ...state,
          arrayusers: payload.arrayusers,
          havegetuserfromdb: true,
        }
      case UPDATED_SINGLE_USER:
        var arr = [...(state.arrayusers)];
        const updatedUser = payload.updatedUser;
        arr.forEach((obj, index) =>{
          if(obj.id === updatedUser.id){
            //console.log("id", updatedUser.id);
            arr[index] = {
              ...obj,
              ...updatedUser,
            };
            //console.log("object changed", arr[index]);
          }
        })
        
        return {
          ...state,
          arrayusers: arr,
          havegetuserfromdb: true,
        }
      default:
        return state;
    }
  };

export default UserReducer;