import React, { useState, useEffect } from "react";
import { Question } from "../../types/formTypes";
import { getFormData } from "../../services/formService";
import Input from "../common/Input";
import Select from "../common/Select";
import "./index.css";

const FormRenderer: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<{ [key: number]: string | number }>({});
    const [errors, setErrors] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        setQuestions(getFormData());
    }, []);

    const validateField = (id: number, value: string | number) => {
        const question = questions.find((q) => q.id === id);
        if (!question) return "";

        if (question.required && value.toString().trim() === "") {
            return "This field is required.";
        }
        if (question.type === "Text" && question.maxLength && value.toString().length > question.maxLength) {
            return `Max length is ${question.maxLength} characters.`;
        }
        if (question.type === "#Number") {
            const numValue = Number(value);
            if (question.min !== undefined && numValue < question.min) {
                return `Minimum value is ${question.min}.`;
            }
            if (question.max !== undefined && numValue > question.max) {
                return `Maximum value is ${question.max}.`;
            }
        }
        return "";
    };

    const handleChange = (id: number, value: string | number) => {
        setAnswers((prev) => ({ ...prev, [id]: value }));

        const errorMessage = validateField(id, value);
        setErrors((prev) => ({ ...prev, [id]: errorMessage }));
    };

    const handleSubmit = () => {
        const newErrors: { [key: number]: string } = {};
        questions.forEach((q) => {
            const error = validateField(q.id, answers[q.id] || "");
            if (error) newErrors[q.id] = error;
        });
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            alert("Form submitted successfully!");
        }
    };

    return (
        <div className="form-container">
            <h2>Fill the Form</h2>
            {questions.length === 0 ? (
                <p className="no-questions">No questions available. Please add questions in the builder.</p>
            ) : (
                questions.map((q) => (
                    <div key={q.id} className="form-field">
                        {q.type === "Text" || q.type === "#Number" ? (
                            <Input
                                type={q.type === "#Number" ? "number" : "text"}
                                label={q.label + (q.required ? " *" : "")}
                                value={answers[q.id] || ""}
                                onChange={(val) => handleChange(q.id, val)}
                                maxLength={q.type === "Text" ? q.maxLength : undefined}
                                className={errors[q.id] ? "error-border" : ""}
                                min={q.type === "#Number" ? q.min : undefined}
                                max={q.type === "#Number" ? q.max : undefined}
                                errMsg={errors[q.id] || ""}
                            />
                        ) : q.type === "MCQ" ? (
                            <Select
                                label={q.label + (q.required ? " *" : "")}
                                options={q.options || []}
                                value={answers[q.id] || ""}
                                onChange={(val) => handleChange(q.id, val)}
                                errMsg={errors[q.id] || ""}
                                className={errors[q.id] ? "error-border" : ""}
                            />
                        ) : null}
                    </div>
                ))
            )}
            {questions.length === 0 ? "" :<button className="submit-button" onClick={handleSubmit}>Submit</button>}
        </div>
    );
};

export default FormRenderer;
