export type QuestionType = "Text" | "#Number" | "MCQ";

export interface Question {
    id: number;
    label: string;
    type: QuestionType;
    required?: boolean;
    hidden?: boolean;
    multiSelect?: boolean;
    maxLength?: number; // For text inputs
    min?: number; // For number inputs
    max?: number; // For number inputs
    options?: string[]; // For select inputs
    helpText?: string;
}
