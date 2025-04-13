import React from "react";
import Cards from "../Cards/Cards";
import Table from "../Table/Table";
import "./MainDash.css";

const MainDash = () => {
  return (
    <div className="MainDash">
      <h1 className="dashboard-heading">Dashboard</h1>
      <div className="main-content-wrapper">
        <Cards />
        <Table />
      </div>
    </div>
  );
};

export default MainDash;
