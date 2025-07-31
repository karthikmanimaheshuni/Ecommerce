import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/shopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
    const {search,setSearch,showSearch,setShowSearch} = useContext(ShopContext);
    const [visible,setvisible] = useState(false);
    const location = useLocation();

    useEffect(()=>{
        if(location.pathname.includes('collection')){
            setvisible(true);
        }else{
            setvisible(false);
        }
    },[location])
  return showSearch && visible ?(
    <div className='border-t border-b bg-gray-30 text-center'>
        <div className='inline-flex items-center justify-center border border-gray-300 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2  '>
                <input value={search} onChange={(e)=>setSearch(e.target.value)} type='text' placeholder='text search' className='flex-1 outline-none bg-inherit text-sm'/>
                <img src ={assets.search_icon} className='w-4' alt = "search"/>
        </div>
         <img onClick={()=>setShowSearch(false)}  src={assets.cross_icon} alt="Cross" className='inline w-3 cursor-pointer'/>

      
    </div>
  ): null
}

export default SearchBar;
