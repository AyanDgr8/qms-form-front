// src/components/Main/Main.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Main.css';
import Home from '../routes/Home/Home';
import ViewForm from '../routes/ViewForm/ViewForm';
import FormList from '../routes/FormList/FormList';

export default function Main(){
    return (
    <>
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/forms" element={<FormList />} />
                    <Route path="/view-form/:id" element={<ViewForm />} />
                </Routes>
            </div>
        </Router>
    </>
    );
}    