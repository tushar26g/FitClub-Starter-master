import React from "react";
import "./Testimonials.css";
import { testimonialsData } from "../../../data/testimonialsData";

const Testimonials = () => {
  return (
    <div></div>
    // <div className="Testimonials" id="testimonials">
    //   <div className="programs-header" style={{ gap: "2rem" }}>
    //     <span className="stroke-text">About</span>
    //     <span> Us</span>
    //   </div>
    //   {testimonialsData.map((testimonial, index) => (
    //     <div key={index} className="testimonial-item">
    //       <div className="left-t">
    //         <span className="review">"{testimonial.review}"</span>
    //         <div className="name-status">
    //           <h3 style={{ color: "var(--orange)", margin: "0" }}>{testimonial.name}</h3>
    //           {/* <p style={{ margin: "0", paddingLeft: "5.5rem" }}>- {testimonial.status}</p> */}
    //         </div>
    //       </div>

    //       <div className="right-t">
    //         <div className="border-box"></div>
    //         <div className="background-box"></div>
    //         <img src={testimonial.image} alt={testimonial.name} />
    //       </div>
    //     </div>
    //   ))}
    // </div>
  );
};

export default Testimonials;
