// src/components/Landing/Landing.js

import React, { useState } from "react";
import './Landing.css';
import Header from '../Other/Header/Header'; 
import Sidebar from '../Other/Sidebar/Sidebar'; 
import CreateForm from '../Forms/CreateForm/CreateForm'; 
import FormList from '../Forms/FormList/FormList'; 

const Landing = () => {
    const [activeComponent, setActiveComponent] = useState(null);

    const handleComponentChange = (component) => {
        setActiveComponent(component);
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case "createForm":
                return <CreateForm onFormSubmit={handleComponentChange} />;
            case "viewForms":
                return <FormList />;
            default:
                return (
                    <div>
                        <button 
                            type="button" 
                            className="btn btn-secondary mb-3 boots"
                            onClick={() => handleComponentChange("createForm")}
                        >
                            Create Form
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary mb-3 boots"
                            onClick={() => handleComponentChange("viewForms")}
                        >
                            View Forms
                        </button>
                    </div>
                );
        }
    };

    return (
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
                    {renderComponent()} {/* Render the active component or buttons */}
                </div>
            </div>
        </div>
    );
}

export default Landing;
