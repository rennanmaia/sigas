export type QuestionType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "checkbox"
  | "date"
  | "photo"
  | "map"
  | "file"
  | "audio";

export interface Option {
  id: string;
  label: string;
}

export interface LogicRule {
  dependsOnQuestionId: string;
  condition: "is" | "is_not";
  value: string;
}
export interface QuestionValidations {
  min?: number;
  max?: number;
  placeholder?: string;
}
export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  options?: Option[];
  logic?: LogicRule;
  validations?: QuestionValidations;
}
