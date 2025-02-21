import React, { useState } from "react";
import "./index.css";

interface SelectProps {
    label: string;
    options: string[];
    value?: string | number;
    onChange: (value: string) => void;
    errMsg?: string;
    className?: string
}

const Select: React.FC<SelectProps> = ({ label, options, value, onChange, errMsg, className }) => {
    const [focused, setFocused] = useState(false);

    return (
        <div className={`select-container ${focused || value ? "focused" : ""} ${className ? className : ""}`}>
            <label className="floating-label">{label}</label>
            <select
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            >
                <option value="" disabled>
                    
                </option>
                {options.map((opt, index) => (
                    <option key={index} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
            {errMsg && <span className="error-message">{errMsg}</span>}
        </div>
    );
};

export default Select;
