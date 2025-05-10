import React, { useState, useEffect }  from "react";
import { plansData } from "../../../data/plansData";
import "./Plans.css";
import whiteTick from "../../../assets/whiteTick.png"; // Ensure correct path
import AuthPopup from '../../Auth/AuthPopup'; 

const Plans = () => {
const [showAuth, setShowAuth] = useState(false);
    const [defaultForm, setDefaultForm] = useState("login");
    const handleCloseAuth = () => setShowAuth(false);
    
 const handleJoinClick = () => {
        setDefaultForm("register");  // Open registration first
        setShowAuth(true);
    };

  return (
    <div className="plans-container">
      <div className="blur plans-blur-1"></div>
      <div className="blur plans-blur-2"></div>
      {/* Header Section */}
      <div className="programs-header" >
        <span className="stroke-text">READY TO START</span>
        <span>YOUR JOURNEY</span>
        <span className="stroke-text">NOW WITH US</span>
      </div>

      {/* Plans Section */}
      <div className="plans">
        {plansData.map((plan, i) => (
          <div className="plan" key={i}>
            {plan.icon}
            <span>{plan.name}</span>
            <span>₹{plan.price}</span>

            {/* Features List */}
            <div className="features">
              {plan.features.map((feature, index) => (
                <div className="feature" key={index}>
                  <img src={whiteTick} alt="Feature Tick" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div>
              <span>See more benefits →</span>
            </div>

            <button className="btn" onClick={handleJoinClick}>Join now</button>
          </div>
        ))}
      </div>
      {/* ✅ Popup Modal with sliding auth */}
            <AuthPopup show={showAuth} closePopup={handleCloseAuth} defaultForm={defaultForm} />
    </div>
  );
};

export default Plans;
