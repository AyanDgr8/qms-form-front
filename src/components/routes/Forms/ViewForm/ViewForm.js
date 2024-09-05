// src/components/routes/ViewForm/ViewForm.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ViewForm.css";

const ViewForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:3005/forms/${id}`)
            .then(response => {
                console.log("Fetched form data:", response.data);
                setFormData(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching form data:", err);
                setError("Error fetching form data");
                setLoading(false);
            });
    }, [id]);

    const handleUseButtonClick = () => {
        navigate(`/use-form/${id}`);
    };

    const deleteForm = () => {
        axios.delete(`http://localhost:3005/forms/${id}`)
            .then(() => {
                navigate('/forms');
            })
            .catch(err => {
                console.error("Error deleting form:", err);
                setError("Error deleting form");
            });
    };

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const handleConfirmDelete = () => {
        deleteForm();
        setShowConfirm(false);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!formData || !formData.form || !formData.grps) return <p className="no-data">No form data found</p>;

    return (
        <div className="form-vieww">
            <h3 className="form-titlee">{formData.form.title}</h3>
            {formData.grps.map(group => (
                <div key={group.id} className="groupp">
                    <h4 className="group-titlee">{group.title}</h4>
                    {group.questions.map(question => (
                        <div key={question.id} className="questionn">
                            <span>
                                <p>{question.question_text}</p>
                            </span>
                            <span className="score-tabb">
                                <p>{question.marks}</p>
                            </span>

                            {question.question_type === 'multiple' && question.options && question.options.length > 0 && (
                                <div className="optionss">
                                    {question.options.map(option => (
                                        <div key={option.id} className="optionn d-flex align-items-center">
                                            <label>
                                                <input type="checkbox" disabled />
                                                {option.option_text}
                                            </label>
                                            {option.is_fatal && (
                                                <span className="is-fatal-badge ms-3 text-danger">isFatal</span>
                                            )}
                                            {option.is_fatal && option.reasons && option.reasons.length > 0 && (
                                                <div className="dropdown-rea ms-auto">
                                                    <button className="btn btn-secondary dropdown-toggle rea-button" type="button" id={`dropdownMenuButton-${option.id}`} data-bs-toggle="dropdown" aria-expanded="false">
                                                        View Reasons
                                                    </button>
                                                    <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${option.id}`}>
                                                        {option.reasons.map(reason => (
                                                            <li key={reason.id}><span className="dropdown-item">{reason.reason_text}</span></li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {question.question_type === 'single' && question.options && question.options.length > 0 && (
                                <div className="optionss">
                                    {question.options.map(option => (
                                        <div key={option.id} className="optionn d-flex align-items-center">
                                            <label>
                                                <input type="radio" name={`question-${question.id}`} disabled />
                                                {option.option_text}
                                            </label>
                                            {option.is_fatal && (
                                                <span className="is-fatal-badge ms-3 text-danger">isFatal</span>
                                            )}
                                            {option.is_fatal && option.reasons && option.reasons.length > 0 && (
                                                <div className="dropdown-rea ms-auto">
                                                    <button className="btn btn-secondary dropdown-toggle rea-button" type="button" id={`dropdownMenuButton-${option.id}`} data-bs-toggle="dropdown" aria-expanded="false">
                                                        View Reasons
                                                    </button>
                                                    <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${option.id}`}>
                                                        {option.reasons.map(reason => (
                                                            <li key={reason.id}><span className="dropdown-item">{reason.reason_text}</span></li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {question.question_type === 'freeform' && (
                                <input type="text" className="text-input" placeholder="Your answer" disabled />
                            )}
                        </div>
                    ))}
                </div>
            ))}

            <div className="button-cont">
                <button type="button" className="btn btn-primary btn-usee" onClick={handleUseButtonClick}>
                    Use
                </button>
                <button type="button" className="btn btn-danger btn-delete" onClick={handleDeleteClick}>
                    Delete
                </button>
            </div>

            {showConfirm && (
                <div className="modall">
                    <div className="modal-contentt">
                        <p>Do you want to delete this form?</p>
                        <button className="btn btn-primary yes-no" onClick={handleConfirmDelete}>Yes</button>
                        <button className="btn btn-primary yes-no" onClick={handleCancelDelete}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewForm;
