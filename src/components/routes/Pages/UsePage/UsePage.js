// src/components/routes/Pages/UsePage/UsePage.js

import React from "react";
import "./UsePage.css"
import Header from "../../Other/Header/Header";
import Sidebar from "../../Other/Sidebar/Sidebar";
import UseForm from "../../Forms/UseForm/UseForm";

const UsePage = () =>{
    return(
        <div>

        <div className="everything">
            <div className="main-first">
                <Header /> 
            </div>
            <div className="main-second">
                <div className="side-content"> 
                    <Sidebar /> 
                </div>
                <div className="mbody-content">
                    <h2 className="form-tile">FORM</h2>
                    <UseForm />
                </div>
            </div>
        </div>
        </div>
    )
};

export default UsePage;