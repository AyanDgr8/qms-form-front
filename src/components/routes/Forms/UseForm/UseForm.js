// src/components/routes/Forms/UseForm/UseForm.js

import "./UseForm.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UseForm = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const navigate = useNavigate();

    const hasFetched = useRef(false);

    useEffect(() => {
        if (!hasFetched.current) {
            console.log("Fetching form data...");
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
            hasFetched.current = true;
        }
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
    
        // Convert answers into a format suitable for MySQL
        const userData = {
            formId: id,
            grps: formData.grps,
            answers: Object.keys(userAnswers).reduce((acc, questionId) => {
                acc[questionId] = {
                    ...userAnswers[questionId],
                    selectedOptions: JSON.stringify(userAnswers[questionId].selectedOptions),
                    selectedReasons: JSON.stringify(userAnswers[questionId].selectedReasons)
                };
                return acc;
            }, {})
        };
    
        try {
            await axios.post(`http://localhost:3005/use-form/${id}`, userData);
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

                                {question.question_type === 'multiple' && question.options && question.options.length > 0 && (
  <div className="optionss">
    {question.options.map(option => (
      <div key={option.id} className="optionn d-flex align-items-center">
        <label>
          <input
            type="checkbox"
            name={`question-${question.id}`}
            value={option.id}
            checked={userAnswers[question.id]?.selectedOptions[option.id] || false}
            onChange={(event) => handleInputChange(question.id, option.id, event)}
          />
          {option.is_fatal === 1
            ? option.option_text.replace(/0+$/, "")  // Replace multiple trailing zeros with a single zero for fatal options.
            : option.option_text}  {/* If not fatal, use the option text as is */}
        </label>
        {option.is_fatal === 1 && (
          <span className="is-fatal-badge ms-3 text-danger">isFatal</span>
        )}
        {option.is_fatal === 1 && option.reasons && option.reasons.length > 0 && (
          <div className="dropdown-rea ms-auto">
            <button
              className="btn btn-secondary dropdown-toggle rea-button"
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
                      type="radio"
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

{question.question_type === 'single' && question.options && question.options.length > 0 && (
  <div className="optionss">
    {question.options.map(option => (
      <div key={option.id} className="optionn d-flex align-items-center">
        <label>
          <input
            type="radio"
            name={`question-${question.id}`}
            value={option.id}
            checked={userAnswers[question.id]?.selectedOptions[option.id] || false}
            onChange={(event) => handleInputChange(question.id, option.id, event)}
          />
          {option.is_fatal === 1
            ? option.option_text.replace(/0+$/, "")  // Replace multiple trailing zeros with a single zero for fatal options.
            : option.option_text}  {/* If not fatal, use the option text as is */}
        </label>
        {option.is_fatal === 1 && (
          <span className="is-fatal-badge ms-3 text-danger">isFatal</span>
        )}
        {option.is_fatal === 1 && option.reasons && option.reasons.length > 0 && (
          <div className="dropdown-rea ms-auto">
            <button
              className="btn btn-secondary dropdown-toggle rea-button"
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
                      type="radio"
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

