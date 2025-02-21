import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import { getFormData, saveFormData } from "../../services/formService";
import { Question } from "../../types/formTypes";
import { validateForm } from "../../validation/formValidation";
import QuestionEditor from "../QuestionEditor";
import Spinner from "../common/Spinner";
import { debounce } from "../../util";

const FormBuilder: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>(() => getFormData());
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [errors, setErrors] = useState<{ [key: number]: { [field: string]: string } }>({});
    const [isSaving, setIsSaving] = useState(false);

    const errorPresent = useCallback((): boolean => {
        return Object.keys(errors).length > 0;
    },[errors]);

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
            setIsSaving(true);
            setTimeout(() => {
                saveFormData(questions);
                setIsSaving(false);
            }, 1000);
        }
    }, [questions]);

    const addQuestion = () => {
        if(errorPresent())return;
        const newQuestion: Question = {
            id: Date.now(),
            type: "Text",
            label: "",
            required: false,
            hidden: false,
        };
        setQuestions((prev) => [...prev, newQuestion]);
        setExpandedId(newQuestion.id);
    };

    const updateQuestion = (updated: Question) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === updated.id ? updated : q))
        );
    };

    const deleteQuestion = (id: number) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
    };

    const resetForm = () => {
        setQuestions([]);
        saveFormData([]);
    }

    const debouncedResetForm = debounce(resetForm, 500);


    return (
        <div className="form-builder-container">
            <div className="header">
                <button className={`add-btn ${errorPresent() ? "disabled": ""}`} onClick={addQuestion}>+ Add Question</button>
                <button className="reset-btn" onClick={debouncedResetForm}>Reset Form</button>
                {isSaving && (
                    <Spinner />
                )}
            </div>
            <div className="questions-list">
                {questions.map((q, index) => {
                    const isExpanded = expandedId === q.id;
                    const hasError = errors[q.id] && Object.keys(errors[q.id]).length > 0;

                    return (
                        <div key={q.id} className={`question-card ${isExpanded ? "expanded" : ""} ${hasError ? "error" : ""}`}>
                            <div className="question-header" onClick={() => setExpandedId(isExpanded ? null : q.id)}>
                                <span className="question-number">Q{index + 1}</span>
                                <span title={q.label || ""} className="question-label">{q.label || "New Question"}</span>
                                <span className="action-btn">
                                    <i className="fa-solid fa-trash delete-btn" onClick={() => deleteQuestion(q.id)}></i>
                                    {isExpanded ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i> }
                                    {/* <span className="toggle-arrow">{isExpanded ? "-" : "+"}</span> */}
                                </span>
                            </div>
                            {isExpanded && (
                                <QuestionEditor
                                    question={q}
                                    updateQuestion={updateQuestion}
                                    errors={errors[q.id] || {}}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FormBuilder;
