import React from "react";
import "./Card.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Card = ({ title, icon, color, barValue, value, unit = "", disableExpand }) => {
  return (
    <div
      className="CompactCard"
      style={{
        background: color.backGround,
        boxShadow: color.boxShadow,
      }}
    >
      <div className="radialBar">
        <CircularProgressbar value={barValue} text={`${barValue}%`} />
      </div>
      <div className="detail" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "24px", fontWeight: "600" }}>
            {unit} {value}
          </span>
          <div>{title}</div>
        </div>
      </div>
    </div>
  );
};


export default Card;
