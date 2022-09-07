import React from 'react';   
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

function App() {
  return (
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
          </Routes>
        </div>
    </Router>
  );
}



export default App;
