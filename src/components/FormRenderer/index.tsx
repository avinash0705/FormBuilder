import React, { useState } from "react";
import { Question } from "../../types/formTypes";
import { getFormData } from "../../services/formService";
import Input from "../common/Input";
import Select from "../common/Select";
import "./index.css";


const FormRenderer: React.FC = () => {
    const initialQuestions: Question[] = getFormData();
    const [answers, setAnswers] = useState<{ [key: number]: string | number }>({});
    const [errors, setErrors] = useState<{ [key: number]: string }>({}); // Error messages per question

    const handleChange = (id: number, value: string | number) => {
        const question = initialQuestions.find((q) => q.id === id);
        if (!question) return;

        let error = "";

        // Validation logic
        if (question.required && value.toString().trim() === "") {
            error = "This field is required.";
        } else if (question.type === "Text" && question.maxLength && value.toString().length > question.maxLength) {
            error = `Max length is ${question.maxLength} characters.`;
        }

        setAnswers((prev) => ({ ...prev, [id]: value }));
        setErrors((prev) => ({ ...prev, [id]: error }));
    };

    return (
        <div>
            <h2>Render Form</h2>
            {initialQuestions.map((q) => (
                <div key={q.id} className="form-field">
                    {q.type === "Text" || q.type === "#Number" ? (
                        <>
                            <Input
                                label={q.label}
                                value={answers[q.id] || ""}
                                onChange={(val) => handleChange(q.id, val)}
                            />
                            {errors[q.id] && <div className="error-text">{errors[q.id]}</div>}
                        </>
                    ) : q.type === "MCQ" ? (
                        <>
                            <Select
                                label={q.label}
                                options={q.options || []}
                                value={answers[q.id] || ""}
                                onChange={(val) => handleChange(q.id, val)}
                            />
                            {errors[q.id] && <div className="error-text">{errors[q.id]}</div>}
                        </>
                    ) : null}
                </div>
            ))}
        </div>
    );
};

export default FormRenderer;
