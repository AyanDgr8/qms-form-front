// src/components/routes/Other/Header/Header/Header.js


import React from "react";
import { Link } from 'react-router-dom';
import "./Header.css";

const Header = ({ onFilterChange }) => {
    // Function to handle dropdown selection
    const handleDropdownSelect = (selectedOption) => {
        onFilterChange(selectedOption);
    };

    return (
        <div>
            <div className="header-container">
                <Link to="/" className="header-left">
                    <img 
                        src="/uploads/logoo.png"
                        className="logo"
                        alt="logo"
                    />
                </Link>
                <div className="header-right">
                    <div className="three-names">
                        <h2 className="three-things">Welcome <span className="name-user">Ayan</span></h2>
                        <h2 className="three-things special-thing">About</h2>
                        <h2 className="three-things">Logout</h2>
                    </div>
                    <div className="three-buttons">
                        <button type="button" className="btn btn-primary btnss" >
                            <a href="/" className="home-btn"> Home</a>
                        </button>
                        <button type="button" className="btn btn-primary btnss">
                            Admin
                        </button>

                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle btnss" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                                Search
                            </button>
                            <ul className="dropdown-menu">
                                <li>
                                    <a 
                                        className="dropdown-item" 
                                        href="#" 
                                        onClick={() => handleDropdownSelect("ReportData")}
                                    >
                                        Report Data
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        className="dropdown-item" 
                                        href="#" 
                                        onClick={() => handleDropdownSelect("Normal")}
                                    >
                                        Normal
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        className="dropdown-item disabled" 
                                        href="#" 
                                        tabIndex="-1" 
                                        aria-disabled="true"
                                    >
                                        FCR
                                    </a>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
