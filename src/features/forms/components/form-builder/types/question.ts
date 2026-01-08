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

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  options?: Option[];
  logic?: LogicRule;
}
export interface LogicRule {
  dependsOnQuestionId: string;
  condition: "is" | "is_not";
  value: string;
}
export interface Option {
  id: string;
  label: string;
}
