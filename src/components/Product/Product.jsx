import React from 'react';
import './Product.css';

const Product = () => {
  return (
    <div className='product'>
        <div className='product_info'>
            <p>I am Product</p>
            <p className='product_price'>
                <small>$</small>
                <strong>20.5</strong>
            </p>
            <div className='product_rating'>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
            </div>
        </div>
        <img 
            alt=''
            src=''
        /> 
    </div>
  )
}

export default Product;