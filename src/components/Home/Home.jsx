import React from 'react'
import Hero from './Hero/Hero'
import Programs from './Programs/Programs'
import Reasons from './Reasons/Reasons'
import Plans from './Plans/Plans'
import Testimonials from './Testimonials/Testimonials'
import ContactUs from './ContactUs/ContactUs';
import { BrowserRouter as Router } from "react-router-dom";

const Home = () => {
  return (
    <div className='home'>
        <Hero />
        <Programs />
        <Reasons />
        <Plans />
        <ContactUs />
        <Testimonials />
    </div>
  )
}

export default Home
