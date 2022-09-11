import {GET_USERS_FROM_DB, ADMIN_LOGOUT} from '../actions/types_actions.js';

const initialState = {
    arrayusers: [],
    getuserfromdb: false,
};

/*Admin user should logout and login to get the latest update for user information*/
const UserReducer = (state = initialState, action) => {
    const {payload, type} = action;
    switch (type) {
      case GET_USERS_FROM_DB:
        return {
          ...state,
          arrayusers: payload.arrayusers,
          getuserfromdb: true,
        };
      case ADMIN_LOGOUT:
        return {
          ...state,
          arrayusers: [],
          getuserfromdb: false,
        };
      default:
        return state;
    }
  };

export default UserReducer;