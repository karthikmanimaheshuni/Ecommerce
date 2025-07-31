import React from 'react'

const Newsletterbox = () => {

    const onSubmitHandler=(event)=>{
            event.preventDefault();
    }
  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now and get 20% offer</p>
        <p className='text-gray-500 mt-3 mb-10'>
            From casual to classy, redefine your fashion game with K S Fashionz
        </p>
        <form onSubmit={onSubmitHandler}className='w-full sm:w-1/2 flex items-center gap-4 mx-auto my-6 border pl-3 pb-0'>
            <input className ='w-full sm:flex-1 outline-none'type='email' placeholder='Enter your email ' required/>
            <button type='submit' className='bg-black text-white text-xs px-10 py-4.5 cursor-pointer'>Subscribe</button>
        </form>
    </div>
  )
}

export default Newsletterbox
