import React from 'react';

import { useSelector, useDispatch } from "react-redux";

const CustomerAccount = () => {
    const state = useSelector((state) => state.AuthReducer);
    const preData = state.hasOwnProperty('userLoginData') ? state.userLoginData : {};
    console.log("preData", preData);
    return (
        <div>CustomerAccount</div>
    )
}

export default CustomerAccount;