// src/components/routes/FormList/FormList.js

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./FormList.css";

const FormList = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const hasFetched = useRef(false);

    useEffect(() => {
    if (!hasFetched.current) {
        console.log("Fetching form data...");
        axios.get('http://localhost:3005/forms')  
        .then(response => {
            console.log("Fetched forms:", response.data);
            setForms(response.data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching forms:", err);
            setError("Error fetching forms");
            setLoading(false);
        });
        hasFetched.current = true;
    }
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="form-list">
            <h3 className="form-tiel">All Forms</h3>
            {forms.length > 0 ? (
                <table className="form-table">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Form Name</th>
                            <th>Department</th>
                            <th>Created By</th>
                            <th>Created Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forms.map((form, index) => (
                            <tr key={form.id}>
                                <td>{index + 1}</td> 
                                <td>
                                    <Link to={`/forms/${form.id}`}>{form.title}</Link>
                                </td>
                                <td>{/* Department will go here */}</td>
                                <td>{/* Created By will go here */}</td>
                                <td>{/* Created Date will go here */}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No forms available</p>
            )}
        </div>
    );
};

export default FormList;
