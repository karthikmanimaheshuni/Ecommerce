import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import Newsletterbox from '../components/Newsletterbox'

const Contact = () => {
  return (
    <div>
        <div className='text-center text-2xl pt-10 border-t'>
            <Title text1={'Contact' } text2={'Us'}/> 

        </div>

        <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
            <img className='w-full max-w-[450px]' src={assets.contact_img}/>
            <div className='flex flex-col justify-center items-start gap-6'>
                <p className='font-semibold text-2xl text-gray-500'>Our Store</p>
                <p className='text-gray-500'>1-8-223 K S Fashionz <br/>Opposite pochampally Co-orporation bank ,<br/> Main Road ,Bhongir,<br/> Yadadri Bhuvanagiri ,Telangana</p>
                <p className='text-gray-500'>Tel : +91-8341663XXX <br/> Email : ksfashionz@support.com</p>

                <p className='font-semibold text-xl text-gray-500'>Careers at K S Fashionz</p>
                <p className='text-gray-500'>Learn more About Our team and job openings</p>

                <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>

            </div>
           

        </div>
         <Newsletterbox/>
    </div>
  )
}

export default Contact
