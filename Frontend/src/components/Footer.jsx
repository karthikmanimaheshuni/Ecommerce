import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
       <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-15 mt-40 text-sm'>
            <div>
                <img className='mb-5 w-32' src={assets.logo} alt="logo"/>
                <p className='w-full md:w-2/3 text-gray-600'>
                    Unleash your style with outfits crafted for confidence, comfort, and sophistication.
                    Discover premium clothing that blends elegance, comfort, and confidence at K S Fashionz
                </p>
            </div>
            <div>
                <p className='text-xl font-bold  mb-15 '> 
                    Company
                </p>
                <ul className='flex flex-col gap-1 text-gray-600 '>
                        <li>Home</li>
                        <li>About</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                </ul>
            </div>
            <div>
                <p className='text-xl font-medium mb-15'>
                    Get in touch 
                </p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>+91-8341663XXX</li>
                    <li>ksfashionz@support.com</li>

                </ul>
            </div>
            

       </div>
            <div>
                <hr/>
                <p className='py-5 text-sm text-center '> copy right 2025@ ksfashionz.com - All Rights Reserverd</p>
                
            </div>
    </div>
  )
}

export default Footer
