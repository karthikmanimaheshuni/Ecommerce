import React, { useContext } from 'react'
import { ShopContext } from '../context/shopContext'
import { Link } from 'react-router-dom'

const ProductItems = ({id,image,name,price,inventory}) => {

    const {currency} = useContext(ShopContext);
    
  return (
    <div>
        <Link to={`/product/${id}`} className='text-gray-700 cursor-pointer'>
            <div className='overflow-hidden'>
                <img className='hover:scale-110 transition ease-in-out'src={image[0]} alt="image"/>
                <p className='pt-3 pb-1 text-sm'>{name}</p>
                <p className='text-sm font-medium text-gray-900'>{currency}{price}</p>
                <p className={`text-sm font-medium ${inventory > 5 ? 'text-green-600':'text-red-600'}`}>Left:{inventory}</p>
                

            </div>

        </Link>
    </div>
  )
}

export default ProductItems
