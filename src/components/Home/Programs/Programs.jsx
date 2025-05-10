import React from "react";
import "./Programs.css";
import { programsData } from "../../../data/programsData";
import RightArrow from "../../../assets/rightArrow.png";
import { Link } from "react-scroll";

const Programs = () => {
  return (
    <div className="Programs" id="programs">
      {/* Header */}
      <div className="programs-header">
        <span className="stroke-text">Explore our</span>
        <span>Features</span>
        <span className="stroke-text">to shape you</span>
      </div>

      {/* Program Categories */}
      <div className="program-categories">
        {programsData.map((program, index) => (
          <Link
            to="plans"
            spy={true}
            smooth={true}
            duration={500}
            key={index}
            className="category-link-wrapper"
          >
            <div className="category">
              {program.image}
              <span>{program.heading}</span>
              <span>{program.details}</span>
              <div className="join-now">
                <span>Join Now</span>
                <img src={RightArrow} alt="Right Arrow" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Programs;
