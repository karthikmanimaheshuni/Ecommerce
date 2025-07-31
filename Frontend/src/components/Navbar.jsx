import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/shopContext';

const Navbar = () => {

    const [visible,setvisible] = useState(false);
    const {setShowSearch,getCartCount,navigate,token,setToken,logoutUser} = useContext(ShopContext);
   
  return (
    <div className='flex items-center justify-between py-5  font-medium'>
        <Link to={'/'}>
            <img src={assets.logo} className='w-36' atl = "K S Fashionz"/>
        
        </Link>
        <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>

            <NavLink to={'/'}className='flex flex-col items-center gap-1'>
                <p> Home</p>
                <hr className='w-2/4 border-name h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            <NavLink to={'/collection'}className='flex flex-col items-center gap-1'>
                <p> Collection</p>
                <hr className='w-2/4 border-name h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            <NavLink to={'/contact'}className='flex flex-col items-center gap-1'>
                <p> Contact</p>
                <hr className='w-2/4 border-name h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            <NavLink to={'/about'}className='flex flex-col items-center gap-1'>
                <p> About</p>
                <hr className='w-2/4 border-name h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
        </ul>

        <div className='flex items-center gap-6'>
                <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="search"/>
                <div className='group relative'>
                       <img onClick={()=>token ? null : navigate('/login')} src={assets.profile_icon} className='w-5  cursor-pointer' alt="user" />
                       {/** drop menu  */}
                        {token && 
                        <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                                <p  className='cursor-pointer hover:text-black'>My profile</p>
                                <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                                <p onClick={logoutUser}  className='cursor-pointer hover:text-black'>Logout</p>
                        

                            </div>

                        </div>}
                </div>
                
                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5 cursor-pointer min-w-5 ' alt="cart"/>
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </Link>
                <img onClick={()=>setvisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="menu"/>
        </div>
 
        {/* sidebar menu for small screen  */}

        <div className={`absolute top-0 bottom-0 right-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600 '>
                    <div onClick={()=>setvisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img className='h-4 rotate-90' src={assets.dropdown} alt="dropdown"/>
                            <p>Back</p>

                    </div>

                    <NavLink onClick={()=>setvisible(false)} className='py-2 pl-6 border cursor-pointer' to='/'>Home</NavLink>
                    <NavLink  onClick={()=>setvisible(false)} className='py-2 pl-6 border cursor-pointer' to='/collection'>Collection</NavLink>
                    <NavLink onClick={()=>setvisible(false)} className='py-2 pl-6 border cursor-pointer' to='/contact'>Contact</NavLink>
                    <NavLink onClick={()=>setvisible(false)} className='py-2 pl-6 border cursor-pointer' to='/about'>About</NavLink>






                </div>
        </div>

        
    </div>
  )
}

export default Navbar
