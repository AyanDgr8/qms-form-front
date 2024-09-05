// src/components/routes/ListPage/ListPage.js

import React from "react";
import "./ViewPage.css"
import Header from "../../Other/Header/Header";
import Sidebar from "../../Other/Sidebar/Sidebar";
import ViewForm from "../../Forms/ViewForm/ViewForm"

const ViewPage = () =>{
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
                    <ViewForm />
                </div>
            </div>
        </div>
        </div>
    )
};

export default ViewPage;