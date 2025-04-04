import React from "react";
import "./Testimonials.css";
import { testimonialsData } from "../../../data/testimonialsData";

const Testimonials = () => {
  return (
    <div className="Testimonials" id="testimonials">
      <div className="programs-header" style={{ gap: "2rem" }}>
        <span className="stroke-text">About</span>
        <span> Us</span>
      </div>
      {testimonialsData.map((testimonial, index) => (
        <div key={index} className="testimonial-item">
          <div className="left-t">
            <span className="review">"{testimonial.review}"</span>
            <span>
              <span style={{ color: "var(--orange)" }}>{testimonial.name}</span> - {testimonial.status}
            </span>
          </div>

          <div className="right-t">
            <div className="border-box"></div>
            <div className="background-box"></div>
            <img src={testimonial.image} alt={testimonial.name} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Testimonials;
