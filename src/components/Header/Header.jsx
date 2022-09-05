import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Header = () => {
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
    </div>
  )
}

export default Header;