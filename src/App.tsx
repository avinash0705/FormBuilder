import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from "react-router-dom";
import FormBuilder from "./components/FormBuilder";
import FormRenderer from "./components/FormRenderer";
import "./App.css"; // Import CSS styles

const App: React.FC = () => {
    return (
        <Router>
            <div className="app-container">
                <nav className="navbar">
                    <NavLink to="/builder" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        Form Builder
                    </NavLink>
                    <NavLink to="/renderer" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        Form Renderer
                    </NavLink>
                </nav>
                <div className="content">
                    <Routes>
                        <Route path="/builder" element={<FormBuilder />} />
                        <Route path="/renderer" element={<FormRenderer />} />
                        <Route path="/" element={<Navigate to="/builder" />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
