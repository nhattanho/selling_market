import React from 'react';
import {store, persistor} from './Redux/store/store.js';
import {Provider} from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'

import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import CheckOut from './components/CheckOut/CheckOut.jsx';
import NotFound from './components/NotFound/NotFound.jsx';
import SignIn from './components/Signin/SignIn.jsx';
import Orders from './components/Orders/Orders.jsx';
import Account from './components/Account/Account.jsx';
import Cart from './components/Cart/Cart.jsx';
import Forgot from './components/ForgotPassWord/Forgot.jsx';
import Register from './components/Register/Register.jsx';
import EmployeeSignIn from './components/Signin/EmployeeSignIn';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import ListUser from './components/Dashboard_Components/ListUser/ListUser.jsx';
import SingleUser from './components/Dashboard_Components/SingleUser/SingleUser.jsx';
import NewUser from './components/Dashboard_Components/NewUser/NewUser.jsx';
import { productInputs, userInputs } from "./formSource";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className='app'>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/signin" element={<SignIn />} />
              <Route exact path="/signinasemployee" element={<EmployeeSignIn />} />
              <Route exact path="/orders" element={<Orders />} />
              <Route exact path="/account" element={<Account />} />
              <Route exact path="/cart" element={<Cart />} />
              <Route exact path="/checkout" element={<CheckOut />} />
              <Route exact path="*" element={<NotFound />} />
              <Route exact path="/forgotPassword" element={<Forgot />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/dashboard" element={<Dashboard />} />
              
              <Route path="users">
                <Route index element={<ListUser />} />
                <Route path=":userId" element={<SingleUser />} />
                <Route path="new"
                  element={<NewUser inputs={userInputs} title="Add New User" />}
                />
              </Route>
            </Routes>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
