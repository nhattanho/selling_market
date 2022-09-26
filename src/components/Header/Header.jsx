import React from 'react';
import {Link} from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux";
import {logoutAction} from '../../Redux/actions/auth_action';
import {adminLogout} from '../../Redux/actions/user_action';

import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { BUYER } from '../../utils/globalVariable';

import './Header.css';

const Header = () => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.AuthReducer);
    //const userreducer = useSelector((state) => state.UserReducer);
    const isLogin = state.isLogin;
    var {username, title} = (state.hasOwnProperty('userLoginData')) ? state.userLoginData : "";
    //console.log("userreducer", userreducer);
    if(isLogin) title = title.toLowerCase();
    const handleLogout = () => {
        dispatch(logoutAction());
        if(title === "admin"|| title === "manager") dispatch(adminLogout());
        //persistor.purge();
    };

    return (
        <div className='header'>
            <Link to='/'>
                <img 
                    className='header_logo'
                    alt=''
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjbEGoAAOT2e9grED4G3hqjiM1afks8nvii7PZGDe0dJeKnmrONwswHeD_N1gbDGCHNi8&usqp=CAU'
                />
            </Link>
            
            <div className='header_search'>
                <input 
                    className='header_search_input'
                    type='text'
                />
                <SearchIcon className='header_search_icon'/>
            </div>

            <div className='header_nav'>
                {isLogin && (title.toLowerCase() === "admin" || title.toLowerCase() === "manager") ? 
                (
                    <div className='header_nav'>
                        <Link 
                            onClick={() => {
                                //dispatch(logoutAction());
                            }}
                            to = '/dashboard'
                            style={{textDecoration: 'none', }}
                        >
                            <div className='header_option'>
                                <span className='header_option_line1'>
                                    {title==="admin"?"Admin":"Manager"}
                                </span>
                                <span className='header_option_line2'>
                                    Dashboard
                                </span>
                            </div>
                        </Link>
                    </div>
                ) : null
                }
                {isLogin ? (
                    <div className='header_nav'>
                        <Link to='/orders' style={{textDecoration: 'none'}}>
                            <div className='header_option'>
                                <span className='header_option_line1'>
                                    Return
                                </span>
                                <span className='header_option_line2'>
                                    & Orders
                                </span>
                            </div>
                        </Link>

                        <Link to={title!==BUYER ?'/account':'/customeraccount'} style={{textDecoration: 'none'}}>
                            <div className='header_option'>
                                <span className='header_option_line1'>
                                    Your
                                </span>
                                <span className='header_option_line2'>
                                    Account
                                </span>
                            </div>
                        </Link>

                        <Link to='/cart' style={{textDecoration: 'none'}}>
                            <div className='header_option_cart'>
                                <ShoppingCartIcon/>
                                <span className='header_option_line2 header_cart_count'>
                                    0
                                </span>
                            </div>
                        </Link>
                    </div>
                ) : null}
                {isLogin ? 
                (
                    <div className='header_nav'>
                        <Link 
                            onClick={handleLogout}
                            to = '/'
                            style={{textDecoration: 'none', }}
                        >
                            <div className='header_option'>
                                <span className='header_option_line1'>
                                    hey { }{username}
                                </span>
                                <span className='header_option_line2'>
                                    Sign Out
                                </span>
                            </div>
                        </Link>
                    </div>
                ) : 
                (
                    <Link to='/signin' style={{textDecoration: 'none'}}>
                        <div className='header_option'>
                            <span className='header_option_line1'>
                                hello
                            </span>
                            <span className='header_option_line2'>
                                Sign In
                            </span>
                        </div>
                    </Link>
                )
                }
            </div>
        </div>
    )
}

export default Header;