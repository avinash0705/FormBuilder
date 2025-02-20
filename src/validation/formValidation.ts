import { Question } from "../types/formTypes";

export interface ValidationError {
    id: number;
    field: string; // Field name causing the error (e.g., "label", "min", "max")
    message: string; // Error message
}


export const validateForm = (questions: Question[]): ValidationError[] => {
    const errors: ValidationError[] = [];

    questions.forEach((q) => {
        if (!q.label.trim()) {
            errors.push({ id: q.id, field: "label", message: "Label is required." });
        }

        if (q.type === "#Number") {
            if (q.min !== undefined && q.max !== undefined && q.min > q.max) {
                errors.push({ id: q.id, field: "min", message: "Min value cannot be greater than max value." });
                errors.push({ id: q.id, field: "max", message: "Max value cannot be less than min value." });
            }
        }
    });

    return errors;
};

