import React ,{ useContext, useState ,useEffect} from 'react'
import { ShopContext } from '../context/shopContext.jsx'
import Title from './Title.jsx';
import ProductItems from './ProductItems.jsx';

const LatestCollection = () => {

  const {products} = useContext(ShopContext);

  console.log(products);

  const [latestProducts,setLatestProducts]=useState([]);

  useEffect(()=>{
    setLatestProducts(products.slice(0,10));
  },[products]);

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'Latest'} text2 = {'Collection'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Where fashion meets trust – Premium quality clothing for every occasion, every style
        </p>
      </div>

      {/* rendering products */}

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
              latestProducts.map((item,index)=>(
                  <ProductItems key={index} id={item._id} image={item.image} name={item.name} price ={item.price}/>
              ))
            }
      </div>
      
    </div>
  )
}

export default LatestCollection;
