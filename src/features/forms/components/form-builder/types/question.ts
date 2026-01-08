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
  options?: string[];
}
