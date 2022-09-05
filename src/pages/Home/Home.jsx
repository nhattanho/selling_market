import React from 'react';
import './Home.css';
import Product from '../../components/Product/Product.jsx';
import Header from '../../components/Header/Header';

const Home = () => {
  return (
    <div className='home'>
        <Header/>
        <div className='home_container'>
            <img
                className='home_image'
                src='https://m.media-amazon.com/images/I/81UwfObBWFL.jpg'
                alt="" 
            />

            <div className='home_row'>
                <Product/>
                <Product/>
            </div>

            <div className='home_row'>

            </div>

            <div className='home_row'>

            </div>
        </div>
    </div>
  )
}

export default Home;
