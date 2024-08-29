// src/components/routes/CreateForm/CreateForm.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateForm.css";

const CreateForm = () => {
  const [formTitle, setFormTitle] = useState("");
  const [savedFormTitle, setSavedFormTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(true);
  const [groups, setGroups] = useState([]);
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
      // Optionally, handle empty title case here
      return;
    }
    setGroups([...groups, { title: newSectionTitle, questions: [] }]);
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
    const newGroups = [...groups];
    newGroups[groupIndex].title = e.target.value;
    setGroups(newGroups);
  };

  // Delete a section (group) from the form
  const deleteSection = (groupIndex) => {
    const newGroups = [...groups];
    newGroups.splice(groupIndex, 1);
    setGroups(newGroups);
  };

  // Edit a section (group) title
  const editSection = (groupIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].isEditing = true;
    setGroups(newGroups);
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
    if (groups[groupIndex] && groups[groupIndex].questions.length > 0) {
      setCurrentQuestionIndex(groups[groupIndex].questions.length - 1);
    } else {
      setCurrentQuestionIndex(null); // or handle the case when there are no questions
    }
    setIsQuestionModalOpen(true);
  };

  const closeQuestionModal = () => {
    setIsQuestionModalOpen(false);
  };

  // Add a new question to a section (group)
  const addQuestion = (groupIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].questions.push({
      type: "multiple",
      questionText: "",
      savedQuestionText: "",
      options: [],
      marks: 0,
      isEditing: true,
    });
    setGroups(newGroups);
    setCurrentQuestionIndex(newGroups[groupIndex].questions.length - 1); 
  };

  // Edit a question in a section (group)
  const editQuestion = (groupIndex, questionIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].questions[questionIndex].isEditing = true;
    setGroups(newGroups);
  };

  // Save a question in a section (group)
  const saveQuestion = (groupIndex, questionIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].questions[questionIndex].savedQuestionText =
      newGroups[groupIndex].questions[questionIndex].questionText;
    newGroups[groupIndex].questions[questionIndex].isEditing = false;
    setGroups(newGroups);
    closeQuestionModal();
  };

  // Delete a question from a section (group)
  const deleteQuestion = (groupIndex, questionIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].questions.splice(questionIndex, 1);
    setGroups(newGroups);
  };

  // Handle marks change for a question
  const handleMarksChange = (groupIndex, questionIndex, marks) => {
    const newGroups = [...groups];
    newGroups[groupIndex].questions[questionIndex].marks = parseInt(marks) || 0;
    setGroups(newGroups);

    // Calculate the total marks
    const total = newGroups.reduce((acc, group) => {
      return acc + group.questions.reduce((qAcc, question) => qAcc + question.marks, 0);
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
    const newGroups = [...groups];
    newGroups[groupIndex].questions[questionIndex].type = type;
    setGroups(newGroups);
  };

  const handleQuestionTextChange = (groupIndex, questionIndex, text) => {
    const newGroups = [...groups];
    
    // Check if the group and question exist
    if (newGroups[groupIndex] && newGroups[groupIndex].questions[questionIndex]) {
      newGroups[groupIndex].questions[questionIndex].questionText = text;
      setGroups(newGroups);
    } else {
      console.error("Group or question not found");
    }
  };

  const addOption = (groupIndex, questionIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].questions[questionIndex].options.push({
      text: "",
      isFatal: false,
      reasons: [""],
    });
    setGroups(newGroups);
  };

  const handleOptionTextChange = (groupIndex, questionIndex, optionIndex, text) => {
    const newGroups = [...groups];
    newGroups[groupIndex].questions[questionIndex].options[optionIndex].text = text;
    setGroups(newGroups);
  };

  const toggleIsFatal = (groupIndex, questionIndex, optionIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].questions[questionIndex].options[optionIndex].isFatal =
      !newGroups[groupIndex].questions[questionIndex].options[optionIndex].isFatal;
    setGroups(newGroups);
  };

  const addReason = (groupIndex, questionIndex, optionIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].questions[questionIndex].options[optionIndex].reasons.push("");
    setGroups(newGroups);
  };

  const handleReasonChange = (
    groupIndex,
    questionIndex,
    optionIndex,
    reasonIndex,
    text
  ) => {
    const newGroups = [...groups];
    newGroups[groupIndex].questions[questionIndex].options[optionIndex].reasons[
      reasonIndex
    ] = text;
    setGroups(newGroups);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (totalMarks !== 100) {
      alert("Inappropriate marks distribution!! Please Try Again");
      return;
    }
  
    const formData = {
      formTitle: savedFormTitle,
      groups,
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
      <div>
        {groups.map((group, groupIndex) => (
          <div className="section-container" key={groupIndex}>
            <div className="section-contents">
              {group.isEditing ? (
                <input
                  type="text"
                  value={group.title}
                  onChange={(e) => handleSectionTitleChange(e, groupIndex)}
                />
              ) : (
                <h3>{group.title}</h3>
              )}
              <button
                onClick={() => editSection(groupIndex)}
                className="edit-save headi-btns"
              >
                Edit Section
              </button>
              <button
                onClick={() => deleteSection(groupIndex)}
                className="edit-save headi-btns"
              >
                Delete Section
              </button>
            </div>
            <div className="questions-container">
              {group.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="section-questions">
                  {question.isEditing ? (
                    <div className="input-question">
                      <input
                        type="text"
                        value={question.questionText}
                        onChange={(e) =>
                          handleQuestionTextChange(
                            groupIndex,
                            questionIndex,
                            e.target.value
                          )
                        }
                      />
                      <select
                        value={question.type}
                        onChange={(e) =>
                          handleQuestionTypeChange(
                            groupIndex,
                            questionIndex,
                            e.target.value
                          )
                        }
                        className="select-type"
                      >
                        <option value="multiple">Multiple Choice(Checkboxes)</option>
                        <option value="single">Single Choice(Radio Buttons)</option>
                        <option value="freeform">Free Form</option>
                      </select>
                      <input
                        type="number"
                        value={question.marks}
                        onChange={(e) =>
                          handleMarksChange(groupIndex, questionIndex, e.target.value)
                        }
                        placeholder="Marks"
                        className="marks-input"
                      />
                      <button
                        onClick={() => saveQuestion(groupIndex, questionIndex)}
                        className="edit-save save-btn"
                      >
                        Save Question
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h4>{question.savedQuestionText}</h4>
                      <button
                        onClick={() => editQuestion(groupIndex, questionIndex)}
                        className="edit-save"
                      >
                        Edit Question
                      </button>
                      <button
                        onClick={() => deleteQuestion(groupIndex, questionIndex)}
                        className="edit-save"
                      >
                        Delete Question
                      </button>
                    </div>
                  )}
                  <div>
                    {question.type !== "freeform" && (
                      <div>
                        <button
                          onClick={() => addOption(groupIndex, questionIndex)}
                          className="edit-save add-qns"
                        >
                          Add Option
                        </button>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex}>
                            <input
                              type="text"
                              value={option.text}
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
                                {option.reasons.map((reason, reasonIndex) => (
                                  <input
                                    key={reasonIndex}
                                    type="text"
                                    value={reason}
                                    onChange={(e) =>
                                      handleReasonChange(
                                        groupIndex,
                                        questionIndex,
                                        optionIndex,
                                        reasonIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Reason"
                                  />
                                ))}
                                <button
                                  onClick={() =>
                                    addReason(groupIndex, questionIndex, optionIndex)
                                  }
                                  className="edit-save"
                                >
                                  Add Reason
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={() => handleAddQuestion(groupIndex)}
                className="edit-save add-qns"
              >
                + ADD QUESTION
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="submit-section">
        <button onClick={openSectionModal} className="edit-save">
          + ADD SECTION
        </button>
        <p>Total Marks: {totalMarks}</p>

        {/* {!isTotalMarksValid && (
          <div className="error-message">Inappropriate marks distribution, Please Try Again</div>
        )} */}

        <button onClick={handleSubmit} className="edit-save">
          Submit Form
        </button>
      </div>
      {isSectionModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Section</h3>
            <input
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="Section Title"
            />
            <button onClick={addGroup} className="edit-save">
              Save Section
            </button>
            <button onClick={closeSectionModal} className="edit-save">
              Close
            </button>
          </div>
        </div>
      )}
      {isQuestionModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Question</h3>
            <button onClick={closeQuestionModal} className="edit-save">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateForm;
