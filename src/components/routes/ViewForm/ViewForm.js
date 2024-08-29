// src/components/routes/CreateForm/CreateForm.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ViewForm.css";

const ViewForm = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/forms/${id}`)
            .then(response => {
                setFormData(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching form data:", err);
                setError("Error fetching form data");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    if (!formData) return <p>No form data found</p>;

    return (
        <div className="form-view">
            <h3>{formData.form.title}</h3>
            {formData.groups.map(group => (
                <div key={group.id} className="group">
                    <h4>{group.title}</h4>
                    {group.questions.map(question => (
                        <div key={question.id} className="question">
                            <p><strong>Type:</strong> {question.question_type}</p>
                            <p><strong>Question:</strong> {question.question_text}</p>
                            <p><strong>Marks:</strong> {question.marks}</p>
                            {question.options.map(option => (
                                <div key={option.id} className="option">
                                    <p><strong>Option:</strong> {option.option_text}</p>
                                    <p><strong>Is Fatal:</strong> {option.is_fatal ? "Yes" : "No"}</p>
                                    {option.reasons.length > 0 && (
                                        <div className="reasons">
                                            <strong>Reasons:</strong>
                                            <ul>
                                                {option.reasons.map(reason => (
                                                    <li key={reason.id}>{reason.reason_text}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ViewForm;
