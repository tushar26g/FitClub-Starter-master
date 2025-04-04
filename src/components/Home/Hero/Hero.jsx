import React from 'react';
import Header from '../Header/Header';
import './Hero.css';
import hero_image from '../../../assets/hero_image.png';
import hero_image_back from '../../../assets/hero_image_back.png';
import Heart from "../../../assets/heart.png";
import Calories from '../../../assets/calories.png';
import {motion} from 'framer-motion';

const Hero = () => {
    const transition = {type: 'spring', duration: 3};
    const mobile = window.innerWidth<=768 ? true : false;
    return (
        <div className="hero">
            <div className='blur hero-blur'></div>
            {/* Left Section */}
            <div className="left-h">
                <Header />

                {/* Best Fitness Club Ad */}
                <div className="the-best-ad">
                <motion.div
    initial={{ left: mobile?"160px":"238px" }}
    whileInView={{ left: "8px" }}
    transition={{ ...transition, type: "tween" }}>
</motion.div>

                    <span>Top-notch gym management system</span>
                </div>

                {/* Hero Heading */}
                <div className="hero-text">
                    <div>
                        <span className='stroke-text'>Shape </span>
                        <span>Your</span>
                    </div>
                    <div>
                        <span>Ideal GYM</span>
                    </div>
                    <div>
                        <span>
                            In here, we will help you to manage and shape your ideal 
                            gym and live your life to the fullest.
                        </span>
                    </div>
                </div>

                {/* Hero Buttons */}
                <div className="hero-buttons">
                    <button className="btn">Join Now</button>
                    <button className="btn">Learn More</button>
                </div>
            </div>

            {/* Right Section */}
            <div className="right-h">
                <button className="btn">Login</button>

                {/* Heart Rate Display */}
                <motion.div
                initial={{ right: "-1rem" }}
                whileInView={{ right: "3rem" }}
                transition={{ ...transition, type: "tween" }}
                className="heart-rate">
                    <img src={Heart} alt="Heart Rate" />
                    <span>Heart Rate</span>
                    <span>116 bpm</span>
                </motion.div>
                <img src={hero_image} alt="" className='hero-image' />
                <motion.img 
                initial={{ right: "11rem" }}
                whileInView={{ right: "23rem" }}
                transition={{ ...transition, type: "tween" }}
                src={hero_image_back} alt="" className='hero-image-back' />

                <motion.div 
                initial={{ right: "33rem" }}
                whileInView={{ right: "28rem" }}
                transition={{ ...transition, type: "tween" }}
                className="calories">

<img src={Calories} alt="" />
<div>
<span>Calories Burned</span><span>220 kcal</span>
</div>
</motion.div>
            </div>
        </div>
    );
};

export default Hero;
