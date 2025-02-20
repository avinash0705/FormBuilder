import React from "react";
import "../styles.css";

interface ToastProps {
    message: string;
    type: "success" | "error";
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
    return <div className={`toast ${type}`}>{message}</div>;
};

export default Toast;
