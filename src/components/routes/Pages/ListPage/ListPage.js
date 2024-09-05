// src/components/routes/ListPage/ListPage.js

import React from "react";
import "./ListPage.css"
import FormList from "../../Forms/FormList/FormList";
import Header from "../../Other/Header/Header";
import Sidebar from "../../Other/Sidebar/Sidebar";

const ListPage = () =>{
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
                    <FormList />
                </div>
            </div>
        </div>
        </div>
    )
};

export default ListPage;