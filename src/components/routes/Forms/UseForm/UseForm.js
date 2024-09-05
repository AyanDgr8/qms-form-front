// src/components/routes/Forms/UseForm/UseForm.js

import "./UseForm.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UseForm = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3005/forms/${id}`)
            .then(response => {
                console.log("Fetched form data:", response.data);
                setFormData(response.data);
                initializeUserAnswers(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching form data:", err);
                setError("Error fetching form data");
                setLoading(false);
            });
    }, [id]);

    const initializeUserAnswers = (data) => {
        const answers = {};
        data.grps.forEach(group => {
            group.questions.forEach(question => {
                answers[question.id] = {
                    selectedOptions: question.options?.reduce((acc, option) => {
                        acc[option.id] = false;
                        return acc;
                    }, {}) || {},
                    selectedReasons: question.options?.reduce((acc, option) => {
                        acc[option.id] = [];
                        return acc;
                    }, {}) || {},
                    answer: ''
                };
            });
        });
        setUserAnswers(answers);
    };

    const handleInputChange = (questionId, optionId, event) => {
        const { type, checked, value } = event.target;
        setUserAnswers(prevAnswers => {
            const updatedAnswers = { ...prevAnswers };

            if (type === 'checkbox') {
                updatedAnswers[questionId].selectedOptions[optionId] = checked;
            } else if (type === 'radio') {
                Object.keys(updatedAnswers[questionId].selectedOptions).forEach(key => {
                    updatedAnswers[questionId].selectedOptions[key] = false;
                });
                updatedAnswers[questionId].selectedOptions[optionId] = true;
            } else if (type === 'text' || type === 'textarea') {
                updatedAnswers[questionId].answer = value;
            }

            return updatedAnswers;
        });
    };

    const handleReasonChange = (questionId, optionId, event) => {
        const { checked, value } = event.target;
        setUserAnswers(prevAnswers => {
            const updatedAnswers = { ...prevAnswers };

            if (checked) {
                updatedAnswers[questionId].selectedReasons[optionId] = [
                    ...updatedAnswers[questionId].selectedReasons[optionId],
                    value
                ];
            } else {
                updatedAnswers[questionId].selectedReasons[optionId] = updatedAnswers[questionId].selectedReasons[optionId].filter(reason => reason !== value);
            }

            return updatedAnswers;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const userData = {
            formId: id,
            grps: formData.grps,
            answers: userAnswers
        };
  
        try {
            await axios.post(`http://localhost:3005/use-form/${id}`,userData);
            alert("Form submitted successfully!");
            navigate('/forms');

        } catch (error) {
            console.error("Error submitting form:", error);
            setError("An error occurred while submitting the form. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!formData || !formData.grps) return <p className="no-data">No form data found</p>;

    return (
        <div className="form-view">
            <h3 className="form-title">{formData.form.title}</h3>
            <form onSubmit={handleSubmit}>
                {formData.grps.map(group => (
                    <div key={group.id} className="group">
                        <h4 className="group-title">{group.title}</h4>
                        {group.questions.map(question => (
                            <div key={question.id} className="question">
                                <div className="ques-score">
                                    <p className="question-text">{question.question_text}</p>
                                    <p className="score-tab">{question.marks}</p>
                                </div>

                                {question.question_type === 'multiple' && question.options && (
                                    <div className="options">
                                        {question.options.map(option => (
                                            <div key={option.id} className="option">
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input mt-0"
                                                        name={`question-${question.id}`}
                                                        value={option.id}
                                                        checked={userAnswers[question.id]?.selectedOptions[option.id] || false}
                                                        onChange={(event) => handleInputChange(question.id, option.id, event)}
                                                    />
                                                    {option.option_text}
                                                </label>
                                                {option.is_fatal && (
                                                    <span className="is-fatal-badge ms-3 text-danger">isFatal</span>
                                                )}
                                                {option.is_fatal && option.reasons && (
                                                    <div className="dropdown-reason">
                                                        <button
                                                            className="btn btn-secondary dropdown-toggle reasons-button"
                                                            type="button"
                                                            id={`dropdownMenuButton-${question.id}-${option.id}`}
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            Reasons
                                                        </button>
                                                        <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${question.id}-${option.id}`}>
                                                            {option.reasons.map(reason => (
                                                                <li key={reason.id}>
                                                                    <label className="dropdown-item">
                                                                        <input
                                                                            type="checkbox"
                                                                            value={reason.id}
                                                                            checked={userAnswers[question.id]?.selectedReasons[option.id]?.includes(reason.id) || false}
                                                                            onChange={(event) => handleReasonChange(question.id, option.id, event)}
                                                                        />
                                                                        {reason.reason_text}
                                                                    </label>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {question.question_type === 'single' && question.options && (
                                    <div className="options">
                                        {question.options.map(option => (
                                            <div key={option.id} className="option">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        className="form-check-input mt-0"
                                                        name={`question-${question.id}`}
                                                        value={option.id}
                                                        checked={userAnswers[question.id]?.selectedOptions[option.id] || false}
                                                        onChange={(event) => handleInputChange(question.id, option.id, event)}
                                                    />
                                                    {option.option_text}
                                                </label>
                                                {option.is_fatal && (
                                                    <span className="is-fatal-badge ms-3 text-danger">isFatal</span>
                                                )}
                                                {option.is_fatal && option.reasons && (
                                                    <div className="dropdown-reason">
                                                        <button
                                                            className="btn btn-secondary dropdown-toggle reasons-button"
                                                            type="button"
                                                            id={`dropdownMenuButton-${question.id}-${option.id}`}
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            Reasons
                                                        </button>
                                                        <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${question.id}-${option.id}`}>
                                                            {option.reasons.map(reason => (
                                                                <li key={reason.id}>
                                                                    <label className="dropdown-item">
                                                                        <input
                                                                            type="checkbox"
                                                                            value={reason.id}
                                                                            checked={userAnswers[question.id]?.selectedReasons[option.id]?.includes(reason.id) || false}
                                                                            onChange={(event) => handleReasonChange(question.id, option.id, event)}
                                                                        />
                                                                        {reason.reason_text}
                                                                    </label>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {question.question_type === 'freeform' && (
                                    <div className="input-group">
                                        <textarea
                                            className="form-control"
                                            placeholder="Your answer"
                                            value={userAnswers[question.id]?.answer || ''}
                                            onChange={(event) => handleInputChange(question.id, null, event)}
                                        ></textarea>
                                    </div>
                                )}
                            
                            </div>
                        ))}
                    </div>
                ))}
                <button className="btn btn-primary btnssss" type="submit">Submit</button>
            </form>
        </div>
    );
};

export default UseForm;
