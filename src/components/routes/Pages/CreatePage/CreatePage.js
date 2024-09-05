// src/components/routes/CreatePage/CreatePage.js

import React from "react";
import "./CreatePage.css"
import CreateForm from "../../Forms/CreateForm/CreateForm";
import Header from "../../Other/Header/Header";
import Sidebar from "../../Other/Sidebar/Sidebar";

const CreatePage = () =>{
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
                    <CreateForm />
                </div>
            </div>
        </div>
        </div>
    )
};

export default CreatePage;