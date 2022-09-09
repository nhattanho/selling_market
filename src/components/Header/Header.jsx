import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector, useDispatch } from "react-redux";
import {loginAction, logoutAction} from '../../Redux/actions/auth_action';

const Header = () => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.AuthReducer);
    const isLogin = state.isLogin;
    var {username, title} = (state.hasOwnProperty('userLoginData')) ? state.userLoginData : "";
    //console.log("username", username);

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
                {title === "admin" ? 
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
                                    Admin
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

                        <Link to='/account' style={{textDecoration: 'none'}}>
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
                            onClick={() => {
                                dispatch(logoutAction());
                            }}
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