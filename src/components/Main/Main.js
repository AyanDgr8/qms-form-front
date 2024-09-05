// src/components/Main/Main.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Main.css';

import Landing from '../routes/Landing/Landing';

// import CreatePage from '../routes/Pages/CreatePage/CreatePage';
import ViewPage from '../routes/Pages/ViewPage/ViewPage';
import ListPage from '../routes/Pages/ListPage/ListPage';
import UsePage from '../routes/Pages/UsePage/UsePage';

export default function Main(){
    return (
    <>
        <Router>
            <div>
                <Routes>


                    {/* Route to the Landing component */}
                    <Route path = "/" element ={<Landing />} />

                    {/* Route to Form List */}
                    <Route path="/forms" element={<ListPage />} />
                    
                    {/* Route to View Form */}
                    <Route path="/forms/:id" element={<ViewPage />} />

                    {/* Route to the Use Form */}
                    <Route path="/use-form/:id" element={<UsePage />} />

                </Routes>
            </div>
        </Router>
    </>
    );
}    