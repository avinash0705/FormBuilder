import React from "react";

interface Props {
    label: string;
}

const Checkbox: React.FC<Props> = ({ label }) => {
    return (
        <div>
            <label>
                <input type="checkbox" /> {label}
            </label>
        </div>
    );
};

export default Checkbox;
