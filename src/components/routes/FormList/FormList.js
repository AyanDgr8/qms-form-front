// src/components/routes/FormList/FormList.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./FormList.css";

const FormList = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/forms`)
            .then(response => {
                setForms(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching forms:", err);
                setError("Error fetching forms");
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="form-list">
            <h3>All Forms</h3>
            <ul>
                {forms.map(form => (
                    <li key={form.id}>
                        <Link to={`/view-form/${form.id}`}>{form.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FormList;
