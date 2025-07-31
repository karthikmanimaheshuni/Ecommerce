import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import Newsletterbox from '../components/Newsletterbox'

const About = () => {
  return (
    <div>
        <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'About'} text2={'Us'}/>

        </div>

        <div className='my-10 flex flex-col md:flex-row gap-16'>
            <img className='w-full md:max-w-[450px]' src={assets.about_img} alt ="About" />
            <div className='flex flex-col justify-center gap-6 md:2/4 text-gray-500'>
                  <p>Unleash your style with outfits crafted for confidence, comfort, and sophistication.
                    Discover premium clothing that blends elegance, comfort, and confidence at K S Fashionz</p>
                  <p>Style that speaks for you – Discover the latest trends at K S Fashionz</p>

                  <b className='text-gray-800'> Our Mission</b>
                  <p>Unleash your style with outfits crafted for confidence, comfort, and sophistication.</p>

            </div>

        </div>

        <div className='text-3xl py-4'> 
            <Title text1={'Why'} text2={'Choose Us'} />

        </div>

        <div className='flex flex-col md:flex-row text-sm mb-20'>
            <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                <b> Quality Assurance : </b> 
                <p className='text-gray-400'> Premium fabrics, superior craftsmanship – because you deserve the best.Crafted with precision, every stitch speaks quality and comfort.Every piece undergoes rigorous quality checks for your satisfaction.Where quality meets fashion for your everyday elegance.</p>

            </div>

             <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                <b> Convenience : </b> 
                <p className='text-gray-400'> Premium fabrics, superior craftsmanship – because you deserve the best.Crafted with precision, every stitch speaks quality and comfort.Every piece undergoes rigorous quality checks for your satisfaction.Where quality meets fashion for your everyday elegance.</p>

            </div>
             <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                <b> Exceptional Customer Service: </b> 
                <p className='text-gray-400'> Premium fabrics, superior craftsmanship – because you deserve the best.Crafted with precision, every stitch speaks quality and comfort.Every piece undergoes rigorous quality checks for your satisfaction.Where quality meets fashion for your everyday elegance.</p>

            </div>

        </div>

        <Newsletterbox/>
      
    </div>
  )
}

export default About
