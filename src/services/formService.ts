import { Question } from "../types/formTypes";

const STORAGE_KEY = "formData";

// Save data to sessionStorage (persists in SPA but resets on refresh)
export const saveFormData = (questions: Question[]) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
};

// Retrieve data from sessionStorage
export const getFormData = (): Question[] => {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
};
