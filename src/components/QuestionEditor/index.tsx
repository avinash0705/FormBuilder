import React, { useState } from "react";
import { Question } from "../../types/formTypes";
import Input from "../common/Input";
import Select from "../common/Select";
import "./index.css";

interface Props {
    question: Question;
    updateQuestion: (updatedQuestion: Question) => void;
    errors: { [field: string]: string }; // Field-specific errors
}

const QuestionEditor: React.FC<Props> = ({ question, updateQuestion, errors }) => {
    const [newOption, setNewOption] = useState("");

    const handleFieldValueChange = (key: string, value: number | string | boolean): void => {
        updateQuestion({ ...question, [key]: value });
    };

    const addOption = () => {
        if (newOption.trim() === "") return;
        const updatedOptions = question.options ? [...question.options, newOption.trim()] : [newOption.trim()];
        updateQuestion({ ...question, options: updatedOptions });
        setNewOption(""); // Clear input after adding
    };

    const removeOption = (index: number) => {
        const updatedOptions = question.options ? question.options.filter((_, i) => i !== index) : [];
        updateQuestion({ ...question, options: updatedOptions });
    };

    return (
        <div className="question-editor">
            {/* Question Label */}
            <Input
                label="Question Label*"
                value={question.label}
                onChange={(val) => handleFieldValueChange("label", val)}
                className={errors.label ? "error-border" : ""}
                errMsg={errors.label}
            />
            <div className="question-meta">
                {/* Question Type */}
                <Select
                    label="Type*"
                    options={["Text", "#Number", "MCQ"]}
                    value={question.type}
                    onChange={(val) => handleFieldValueChange("type", val)}
                />

                {/* Required Checkbox */}
                <label className="checkbox">
                    <input
                        type="checkbox"
                        checked={question.required || false}
                        onChange={(e) => handleFieldValueChange("required", e.target.checked)}
                    />
                    <span>Required</span>
                </label>

                {/* Hidden Checkbox */}
                <label className="checkbox">
                    <input
                        type="checkbox"
                        checked={question.hidden || false}
                        onChange={(e) => handleFieldValueChange("hidden", e.target.checked)}
                    />
                    <span>Hidden</span>
                </label>
            </div>

            {/* Max Length for Text Type */}
            {question.type === "Text" && (
                <>
                    <Input
                        className={`max-length ${errors.maxLength ? "error-border" : ""}`}
                        label="Max Length"
                        type="number"
                        value={question.maxLength?.toString() || ""}
                        onChange={(value) => handleFieldValueChange("maxLength", Number(value))}
                    />
                    {errors.maxLength && <span className="error-message">{errors.maxLength}</span>}
                </>
            )}

            {/* Min/Max Values for Number Type */}
            {question.type === "#Number" && (
                <div className="number-fields">
                    <div>
                        <Input
                            label="Min Value"
                            type="number"
                            value={question.min?.toString() || ""}
                            onChange={(value) => handleFieldValueChange("min", Number(value))}
                            className={errors.min ? "error-border" : ""}
                        />
                        {errors.min && <span className="error-message">{errors.min}</span>}
                    </div>
                    <div>
                        <Input
                            label="Max Value"
                            type="number"
                            value={question.max?.toString() || ""}
                            onChange={(value) => handleFieldValueChange("max", Number(value))}
                            className={errors.max ? "error-border" : ""}
                        />
                        {errors.max && <span className="error-message">{errors.max}</span>}
                    </div>
                </div>
            )}

            {/* MCQ Options */}
            {question.type === "MCQ" && (
                <div className="options-section">
                    <div className="add-option-container">
                        <Input
                            type="text"
                            label="Enter options"
                            value={newOption}
                            maxLength={50}
                            onChange={(val) => setNewOption(val)}
                            onKeyDown={(e: { key: string }) => e.key === "Enter" && addOption()}
                        />
                        <i className="fa-solid fa-plus add-option-btn" onClick={addOption}></i>
                    </div>

                    {question.options && question.options.length > 0 && (
                        <div className="options-chips">
                            {question.options.map((option, index) => (
                                <span key={index} className="option-chip">
                                    {option}
                                    <i className="fa-solid fa-xmark delete-option" onClick={() => removeOption(index)}></i>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Help Text */}
            <Input
                className="help-text"
                label="Help Text"
                type="text"
                value={question.helpText || ""}
                onChange={(value) => handleFieldValueChange("helpText", value)}
            />
        </div>
    );
};

export default QuestionEditor;
