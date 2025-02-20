import React, { useState, useEffect } from "react";
import "./index.css";
import { getFormData, saveFormData } from "../../services/formService";
import { Question } from "../../types/formTypes";
import { validateForm } from "../../validation/formValidation";
import QuestionEditor from "../QuestionEditor";

const FormBuilder: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [errors, setErrors] = useState<{ [key: number]: { [field: string]: string } }>({}); // Track errors per question field

    useEffect(() => {
        setQuestions(getFormData());
    }, []);


    useEffect(() => {
        const validationErrors = validateForm(questions);
        const errorMap: { [key: number]: { [field: string]: string } } = {};
    
        validationErrors.forEach((err) => {
            if (!errorMap[err.id]) {
                errorMap[err.id] = {}; 
            }
            errorMap[err.id][err.field] = err.message;
        });
    
        setErrors(errorMap);
    
        if (Object.keys(errorMap).length === 0) {
            saveFormData(questions);
        }
    }, [questions]);
    

    const addQuestion = () => {
        const newQuestion: Question = {
            id: Date.now(),
            type: "Text",
            label: "",
            required: false,
            hidden: false,
        };
        setQuestions([...questions, newQuestion]);
        setExpandedId(newQuestion.id);
        setEditingId(newQuestion.id);
    };

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const updateQuestion = (updated: Question) => {
        setQuestions(questions.map((q) => (q.id === updated.id ? updated : q)));

        // Clear only the specific field error when it is fixed
        setErrors((prev) => {
            if (!prev[updated.id]) return prev; // No errors to clear

            const newErrors = { ...prev };
            let hasRemainingErrors = false;

            Object.keys(newErrors[updated.id]).forEach((field) => {
                if (updated[field as keyof Question] !== "" && updated[field as keyof Question] !== undefined) {
                    delete newErrors[updated.id][field];
                } else {
                    hasRemainingErrors = true;
                }
            });

            if (!hasRemainingErrors) {
                delete newErrors[updated.id];
            }

            return newErrors;
        });
    };

    const deleteQuestion = (id: number) => {
        setQuestions(questions.filter((q) => q.id !== id));
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[id];
            return newErrors;
        });
    };

    return (
        <div className="form-builder-container">
            <button className="add-btn" onClick={addQuestion}>+ Add Question</button>
            <div className="questions-list">
                {questions.map((q, index) => {
                    const isExpanded = expandedId === q.id;
                    const hasError = errors[q.id] && Object.keys(errors[q.id]).length > 0;

                    return (
                        <div key={q.id} className={`question-card ${isExpanded ? "expanded" : ""} ${hasError ? "error" : ""}`}>
                            <div className="question-header" onClick={() => toggleExpand(q.id)}>
                                <span className="question-number">Q{index + 1}</span>
                                <span title={q.label || ""} className="question-label">{q.label || "New Question"}</span>
                                <span className="action-btn">
                                    <i className="fa-solid fa-trash delete-btn" onClick={() => deleteQuestion(q.id)}></i>
                                    <span className="toggle-arrow">{isExpanded ? "-" : "+"}</span>
                                </span>
                            </div>

                            {isExpanded && (
                                <>
                                    <QuestionEditor
                                        question={q}
                                        updateQuestion={updateQuestion}
                                        errors={errors[q.id] || {}} // Pass only errors for the current question
                                    />
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FormBuilder;
