import React, { useState } from "react";
import "./index.css"; // Import the CSS file for styling

interface InputProps {
    className?: string;
    label: string;
    type?: "text" | "number";
    value?: string | number;
    onChange: (value: string) => void;
    onKeyDown?: Function;
    maxLength?: number;
    placeholder?: string;
    errMsg?: string;
}

const Input: React.FC<InputProps> = ({ className, label, type = "text", value, onChange, maxLength, placeholder, onKeyDown, errMsg }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`input-container ${isFocused || value ? "focused" : ""} ${className ? className : ""}`}>
            <label className="floating-label">{label}</label>
            <input
                type={type}
                maxLength={maxLength || 500}
                value={value ?? ""}
                placeholder={!label ? placeholder : ""}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => onKeyDown && onKeyDown(e)}
            />
            {errMsg && <span className="error-message">{errMsg}</span>}
        </div>
    );
};

export default Input;
