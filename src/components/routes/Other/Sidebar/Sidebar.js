// src/components/routes/Other/Sidebar/Sidebar/Sidebar.js

import React, { useState } from "react";
import "./Sidebar.css";
import Calendar from "react-calendar";

const Sidebar = () => {
  const [showCalendar, setShowCalendar] = useState({
    start: false,
    end: false,
  });

  const toggleCalendar = (type) => {
    setShowCalendar((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };

  return (
    <div>
      <div className="sidebar-container">
        <div className="sidebar-heading">Search by Session</div>
        <div className="sidebar-search-containers">
          <div className="input-group input-group-sm mb-3 sedi">
            <span className="input-group-text inpu" id="inputGroup-sizing-sm">
              Start Date
            </span>
            <input
              type="text"
              className="form-control inp"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
            <img
              src="/uploads/cali.png"
              className="cali"
              alt="cali"
              onClick={() => toggleCalendar("start")}
            />
            {showCalendar.start && <Calendar />}
          </div>

          <div className="input-group input-group-sm mb-3 sedi endi">
            <span className="input-group-text inpu " id="inputGroup-sizing-sm">
              End Date
            </span>
            <input
              type="text"
              className="form-control inp"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
            <img
              src="/uploads/cali.png"
              className="cali"
              alt="cali"
              onClick={() => toggleCalendar("end")}
            />
            {showCalendar.end && <Calendar />}
          </div>

          <button type="button" className="btn btn-primary btns si-srch">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
