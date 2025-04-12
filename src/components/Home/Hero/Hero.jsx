import React, { useState } from 'react';
import Header from '../Header/Header';
import './Hero.css';
import hero_image from '../../../assets/hero_image.png';
import hero_image_back from '../../../assets/hero_image_back.png';
import Heart from "../../../assets/heart.png";
import Calories from '../../../assets/calories.png';
import { motion } from 'framer-motion';
import AuthPopup from '../../Auth/AuthPopup'; // ✅ Import AuthPopup

const Hero = () => {
    const transition = { type: 'spring', duration: 3 };
    const mobile = window.innerWidth <= 768;

    const [showAuth, setShowAuth] = useState(false);
    const [defaultForm, setDefaultForm] = useState("login"); // ✅ Track default form

    const handleJoinClick = () => {
        setDefaultForm("register");  // Open registration first
        setShowAuth(true);
    };

    const handleSignInClick = () => {
        setDefaultForm("login");  // Open login first
        setShowAuth(true);
    };

    const handleCloseAuth = () => setShowAuth(false);

    return (
        <>
            <div className="hero">
                <div className='blur hero-blur'></div>

                {/* Left Section */}
                <div className="left-h">
                    <Header />
                    <div className="the-best-ad">
                        <motion.div
                            initial={{ left: mobile ? "160px" : "238px" }}
                            whileInView={{ left: "8px" }}
                            transition={{ ...transition, type: "tween" }}
                        />
                        <span>Top-notch gym management system</span>
                    </div>

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

                    <div className="hero-buttons">
                        <button className="btn" onClick={handleJoinClick}>Join Now</button> {/* ✅ Register First */}
                        <button className="btn" onClick={handleSignInClick}>Sign In</button> {/* ✅ Login First */}
                    </div>
                </div>

                {/* Right Section */}
                <div className="right-h">
                    <button className="btn login-btn" onClick={handleSignInClick}>Sign In</button>

                    <motion.div
                        initial={{ right: "-1rem" }}
                        whileInView={{ right: "3rem" }}
                        transition={{ ...transition, type: "tween" }}
                        className="heart-rate"
                    >
                        <img src={Heart} alt="Heart Rate" />
                        <span>Heart Rate</span>
                        <span>116 bpm</span>
                    </motion.div>

                    <img src={hero_image} alt="hero" className="hero-image" />

                    <motion.img
                        initial={{ right: "11rem" }}
                        whileInView={{ right: "23rem" }}
                        transition={{ ...transition, type: "tween" }}
                        src={hero_image_back}
                        alt="hero back"
                        className="hero-image-back"
                    />

                    <motion.div
                        initial={{ right: "33rem" }}
                        whileInView={{ right: "28rem" }}
                        transition={{ ...transition, type: "tween" }}
                        className="calories"
                    >
                        <img src={Calories} alt="calories" />
                        <div>
                            <span>Calories Burned</span>
                            <span>220 kcal</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ✅ Popup Modal with sliding auth */}
            <AuthPopup show={showAuth} closePopup={handleCloseAuth} defaultForm={defaultForm} />
        </>
    );
};

export default Hero;
