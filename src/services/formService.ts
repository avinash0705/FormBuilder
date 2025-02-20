import { Question } from "../types/formTypes";

const STORAGE_KEY = "formData";

export const saveFormData = (questions: Question[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
};

export const getFormData = (): Question[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};
