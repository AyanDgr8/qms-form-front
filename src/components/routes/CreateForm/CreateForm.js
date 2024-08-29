// src/components/routes/CreateForm/CreateForm.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateForm.css";

const CreateForm = () => {
  const [formTitle, setFormTitle] = useState("");
  const [savedFormTitle, setSavedFormTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(true);
  const [grps, setGrps] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
  const [isTotalMarksValid, setIsTotalMarksValid] = useState(true);

  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);

  // Save the form title
  const saveFormTitle = () => {
    setSavedFormTitle(formTitle);
    setIsEditingTitle(false);
  };

  // Edit the form title
  const editFormTitle = () => {
    setIsEditingTitle(true);
  };

  // Function to handle adding a new section
  const addGroup = () => {
    if (newSectionTitle.trim() === "") {
      return;
    }
    setGrps([...grps, { title: newSectionTitle, questions: [] }]);
    setNewSectionTitle(""); // Clear input after adding
    closeSectionModal(); // Close modal
  };

  // Function to handle adding a new question
  const handleAddQuestion = (groupIndex) => {
    addQuestion(groupIndex);
    openQuestionModal(groupIndex);
  };

  // Handle section title change
  const handleSectionTitleChange = (e, groupIndex) => {
    const newGrps = [...grps];
    newGrps[groupIndex].title = e.target.value;
    setGrps(newGrps);
  };

  // Delete a section (group) from the form
  const deleteSection = (groupIndex) => {
    const newGrps = [...grps];
    newGrps.splice(groupIndex, 1);
    setGrps(newGrps);
  };

  // Edit a section (group) title
  const editSection = (groupIndex) => {
    const newGrps = [...grps];
    newGrps[groupIndex].isEditing = true;
    setGrps(newGrps);
  };

  // Open and close modals
  const openSectionModal = () => {
    setIsSectionModalOpen(true);
  };

  const closeSectionModal = () => {
    setIsSectionModalOpen(false);
  };

  const openQuestionModal = (groupIndex) => {
    setCurrentGroupIndex(groupIndex);
    // Set the current question index to the latest question in the group
    if (grps[groupIndex] && grps[groupIndex].questions.length > 0) {
      setCurrentQuestionIndex(grps[groupIndex].questions.length - 1);
    } else {
      setCurrentQuestionIndex(null);
    }
    setIsQuestionModalOpen(true);
  };

  const closeQuestionModal = () => {
    setIsQuestionModalOpen(false);
  };

  // Add a new question to a section (group)
  const addQuestion = (groupIndex) => {
    const newGrps = [...grps];
    newGrps[groupIndex].questions.push({
      type: "multiple",
      questionText: "",
      savedQuestionText: "",
      options: [],
      marks: 0,
      isEditing: true,
    });
    setGrps(newGrps);
    setCurrentQuestionIndex(newGrps[groupIndex].questions.length - 1);
  };

  // Edit a question in a section (group)
  const editQuestion = (groupIndex, questionIndex) => {
    const newGrps = [...grps];
    newGrps[groupIndex].questions[questionIndex].isEditing = true;
    setGrps(newGrps);
  };

  // Save a question in a section (group)
  const saveQuestion = (groupIndex, questionIndex) => {
    const newGrps = [...grps];
    newGrps[groupIndex].questions[questionIndex].savedQuestionText =
      newGrps[groupIndex].questions[questionIndex].questionText;
    newGrps[groupIndex].questions[questionIndex].isEditing = false;
    setGrps(newGrps);
    closeQuestionModal();
  };

  // Delete a question from a section (group)
  const deleteQuestion = (groupIndex, questionIndex) => {
    const newGrps = [...grps];
    newGrps[groupIndex].questions.splice(questionIndex, 1);
    setGrps(newGrps);
  };

  // Handle marks change for a question
  const handleMarksChange = (groupIndex, questionIndex, marks) => {
    const newGrps = [...grps];
    newGrps[groupIndex].questions[questionIndex].marks = parseInt(marks) || 0;
    setGrps(newGrps);

    // Calculate the total marks
    const total = newGrps.reduce((acc, grp) => {
      return acc + grp.questions.reduce((qAcc, question) => qAcc + question.marks, 0);
    }, 0);

    setTotalMarks(total);
  };

  useEffect(() => {
    // Check if total marks are exactly 100
    if (totalMarks !== 100) {
      setIsTotalMarksValid(false);
    } else {
      setIsTotalMarksValid(true);
    }
  }, [totalMarks]);

  const handleQuestionTypeChange = (groupIndex, questionIndex, type) => {
    const newGrps = [...grps];
    newGrps[groupIndex].questions[questionIndex].type = type;
    setGrps(newGrps);
  };

  const handleQuestionTextChange = (groupIndex, questionIndex, text) => {
    const newGrps = [...grps];
    if (newGrps[groupIndex] && newGrps[groupIndex].questions[questionIndex]) {
      newGrps[groupIndex].questions[questionIndex].questionText = text;
      setGrps(newGrps);
    } else {
      console.error("Group or question not found");
    }
  };

  const addOption = (groupIndex, questionIndex) => {
    const newGrps = [...grps];
    newGrps[groupIndex].questions[questionIndex].options.push({
      text: "",
      isFatal: false,
      reasons: [""],
    });
    setGrps(newGrps);
  };

  const handleOptionTextChange = (groupIndex, questionIndex, optionIndex, text) => {
    const newGrps = [...grps];
    newGrps[groupIndex].questions[questionIndex].options[optionIndex].text = text;
    setGrps(newGrps);
  };

  const toggleIsFatal = (groupIndex, questionIndex, optionIndex) => {
    const newGrps = [...grps];
    newGrps[groupIndex].questions[questionIndex].options[optionIndex].isFatal =
      !newGrps[groupIndex].questions[questionIndex].options[optionIndex].isFatal;
    setGrps(newGrps);
  };

  const addReason = (groupIndex, questionIndex, optionIndex) => {
    const newGrps = [...grps];
    newGrps[groupIndex].questions[questionIndex].options[optionIndex].reasons.push("");
    setGrps(newGrps);
  };

  const handleReasonChange = (
    groupIndex,
    questionIndex,
    optionIndex,
    reasonIndex,
    text
  ) => {
    const newGrps = [...grps];
    newGrps[groupIndex].questions[questionIndex].options[optionIndex].reasons[
      reasonIndex
    ] = text;
    setGrps(newGrps);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (totalMarks !== 100) {
      alert("Inappropriate marks distribution!! Please Try Again");
      return;
    }

    const formData = {
      formTitle: savedFormTitle,
      grps,
    };

    try {
      await axios.post("http://localhost:3007/submit-form", formData);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div>
      <div className="formpage-heading">Create Form</div>
      <div className="title-container">
        {isEditingTitle ? (
          <div className="form-heading">
            <input
              type="text"
              placeholder="Enter Form Title"
              value={formTitle}
              className="inpt-boxes"
              onChange={(e) => setFormTitle(e.target.value)}
            />
            <button onClick={saveFormTitle} className="edit-save headi-btns">
              Save Title
            </button>
          </div>
        ) : (
          <div>
            <h2>{savedFormTitle}</h2>
            <button onClick={editFormTitle} className="edit-save headi-btns">
              Edit Title
            </button>
          </div>
        )}
      </div>

      {/* *********** */}

      <div>
        {grps.map((grp, groupIndex) => (
          <div className="section-container" key={groupIndex}>
            <input
              type="text"
              placeholder="Enter Section Title"
              value={grp.title}
              className="inpt-boxes sect-inpt"
              onChange={(e) => handleSectionTitleChange(e, groupIndex)}
            />
            <button
              onClick={() => deleteSection(groupIndex)}
              className="edit-save add-qns"
            >
              Delete Section
            </button>
            <div>
            <button
              onClick={() => handleAddQuestion(groupIndex)}
              className="edit-save add-qns"
            >
              Add Question
            </button>

            </div>
            {grp.questions.map((question, questionIndex) => (
              <div className="questions-container" key={questionIndex}>
                {question.isEditing ? (
                  <div className="question-section">
                    <input
                      type="text"
                      placeholder="Enter Question Text"
                      value={question.questionText}
                      className="input-question"
                      onChange={(e) =>
                        handleQuestionTextChange(groupIndex, questionIndex, e.target.value)
                      }
                    />
                    <div className="choice-marks">
                      <select
                        value={question.type}
                        className="select-type"
                        onChange={(e) =>
                          handleQuestionTypeChange(groupIndex, questionIndex, e.target.value)
                        }
                      >
                        <option value="multiple">Multiple Choice</option>
                        <option value="single">Single Choice</option>
                        <option value="freeform">Free Form</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Marks"
                        value={question.marks}
                        className="marks-input"
                        onChange={(e) =>
                          handleMarksChange(groupIndex, questionIndex, e.target.value)
                        }
                      />
                    </div>
                    {question.type === "multiple" || question.type === "single" ? (
                      <div >
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex}>
                            <input
                              type="text"
                              placeholder="Enter Option Text"
                              value={option.text}
                              className="input-question opt-txt"
                              onChange={(e) =>
                                handleOptionTextChange(
                                  groupIndex,
                                  questionIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                            />
                            <label>
                              <input
                                type="checkbox"
                                checked={option.isFatal}
                                onChange={() =>
                                  toggleIsFatal(groupIndex, questionIndex, optionIndex)
                                }
                              />
                              Is Fatal
                            </label>
                            {option.isFatal && (
                              <div>
                                <label>Reasons:</label>
                                {option.reasons.map((reason, reasonIndex) => (
                                  <input
                                    key={reasonIndex}
                                    type="text"
                                    placeholder="Enter Reason"
                                    value={reason}
                                    className="input-question"
                                    onChange={(e) =>
                                      handleReasonChange(
                                        groupIndex,
                                        questionIndex,
                                        optionIndex,
                                        reasonIndex,
                                        e.target.value
                                      )
                                    }
                                  />
                                ))}
                                <button
                                  onClick={() =>
                                    addReason(groupIndex, questionIndex, optionIndex)
                                  }
                                  className="edit-save add-qns"
                                >
                                  Add Reason
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => addOption(groupIndex, questionIndex)}
                          className="edit-save add-qns"
                        >
                          Add Option
                        </button>
                      </div>
                    ) : null}
                    <button
                      onClick={() => saveQuestion(groupIndex, questionIndex)}
                      className="edit-save save-btn normal-save-ques"
                    >
                      Save Question
                    </button>
                  </div>
                ) : (
                  <div>
                    <h4>{question.savedQuestionText}</h4>
                    <button
                      onClick={() => editQuestion(groupIndex, questionIndex)}
                      className="edit-save add-qns"
                    >
                      Edit Question
                    </button>
                    <button
                      onClick={() => deleteQuestion(groupIndex, questionIndex)}
                      className="edit-save add-qns"
                    >
                      Delete Question
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={openSectionModal} className="edit-save submit-section">
        Add Section
      </button>
      <div className="submit-section">
        <button onClick={handleSubmit} className="edit-save submit-btn">
          Submit Form
        </button>
      </div>

      {/* Modal for adding a new section */}
      {isSectionModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="pop-up-headi">Add New Section</h3>
            <input
              type="text"
              placeholder="Enter Section Title"
              value={newSectionTitle}
              className="inpt-boxes sect-inpt"
              onChange={(e) => setNewSectionTitle(e.target.value)}
            />
            <button onClick={addGroup} className="edit-save save-btn">
              Save Section
            </button>
            <button onClick={closeSectionModal} className="edit-save save-btn">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for adding a new question */}
      {isQuestionModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="pop-up-headi">Add New Question</h3>
            {currentGroupIndex !== null &&
              currentQuestionIndex !== null &&
              grps[currentGroupIndex] &&
              grps[currentGroupIndex].questions[currentQuestionIndex] && (
                <div className="question-section">
                  <input
                    type="text"
                    placeholder="Enter Question Text"
                    value={
                      grps[currentGroupIndex].questions[currentQuestionIndex].questionText
                    }
                    className="input-question "
                    onChange={(e) =>
                      handleQuestionTextChange(
                        currentGroupIndex,
                        currentQuestionIndex,
                        e.target.value
                      )
                    }
                  />
                  <div className="choice-marks">
                    <select
                      value={grps[currentGroupIndex].questions[currentQuestionIndex].type}
                      className="select-type"
                      onChange={(e) =>
                        handleQuestionTypeChange(
                          currentGroupIndex,
                          currentQuestionIndex,
                          e.target.value
                        )
                      }
                    >
                      <option value="multiple">Multiple Choice</option>
                      <option value="single">Single Choice</option>
                      <option value="freeform">Free Form</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Marks"
                      value={grps[currentGroupIndex].questions[currentQuestionIndex].marks}
                      className="marks-input"
                      onChange={(e) =>
                        handleMarksChange(
                          currentGroupIndex,
                          currentQuestionIndex,
                          e.target.value
                        )
                      }
                    />
                  </div>
                  {grps[currentGroupIndex].questions[currentQuestionIndex].type ===
                    "multiple" ||
                  grps[currentGroupIndex].questions[currentQuestionIndex].type ===
                    "single" ? (
                    <div>
                      {grps[currentGroupIndex].questions[
                        currentQuestionIndex
                      ].options.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          <input
                            type="text"
                            placeholder="Enter Option Text"
                            value={option.text}
                            className="input-question"
                            onChange={(e) =>
                              handleOptionTextChange(
                                currentGroupIndex,
                                currentQuestionIndex,
                                optionIndex,
                                e.target.value
                              )
                            }
                          />
                          <label>
                            <input
                              type="checkbox"
                              checked={option.isFatal}
                              onChange={() =>
                                toggleIsFatal(
                                  currentGroupIndex,
                                  currentQuestionIndex,
                                  optionIndex
                                )
                              }
                            />
                            Is Fatal
                          </label>
                          {option.isFatal && (
                            <div>
                              <label>Reasons:</label>
                              {option.reasons.map((reason, reasonIndex) => (
                                <input
                                  key={reasonIndex}
                                  type="text"
                                  placeholder="Enter Reason"
                                  value={reason}
                                  className="input-question"
                                  onChange={(e) =>
                                    handleReasonChange(
                                      currentGroupIndex,
                                      currentQuestionIndex,
                                      optionIndex,
                                      reasonIndex,
                                      e.target.value
                                    )
                                  }
                                />
                              ))}
                              <button
                                onClick={() =>
                                  addReason(
                                    currentGroupIndex,
                                    currentQuestionIndex,
                                    optionIndex
                                  )
                                }
                                className="edit-save add-qns"
                              >
                                Add Reason
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(currentGroupIndex, currentQuestionIndex)}
                        className="edit-save add-qns"
                      >
                        Add Option
                      </button>
                    </div>
                  ) : null}
                  <button
                    onClick={() =>
                      saveQuestion(currentGroupIndex, currentQuestionIndex)
                    }
                    className="edit-save save-btn save-ques"
                  >
                    Save Question
                  </button>
                  <button onClick={closeQuestionModal} className="edit-save save-btn">
                    Close
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateForm;
