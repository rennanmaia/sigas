import { useState } from "react";
import type { Question, QuestionType } from "../types/question";

export function useFormBuilder() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = (type: QuestionType, atIndex?: number) => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type,
      label: "",
      required: false,
      options:
        type === "select" || type === "checkbox" ? ["Opção 1"] : undefined,
    };

    setQuestions((prev) => {
      if (atIndex === undefined) return [...prev, newQuestion];

      const newQuestions = [...prev];
      newQuestions.splice(atIndex + 1, 0, newQuestion);
      return newQuestions;
    });
  };

  const removeQuestion = (id: string) =>
    setQuestions((q) => q.filter((item) => item.id !== id));

  const updateQuestionLabel = (id: string, label: string) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, label } : q)));

  const updateQuestionType = (id: string, type: QuestionType) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === id
          ? {
              ...q,
              type,
              options:
                type === "select" || type === "checkbox"
                  ? q.options || ["Opção 1"]
                  : undefined,
            }
          : q
      )
    );

  const toggleRequired = (id: string) =>
    setQuestions((qs) =>
      qs.map((q) => (q.id === id ? { ...q, required: !q.required } : q))
    );

  const addOption = (qId: string) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: [
                ...(q.options || []),
                `Opção ${(q.options?.length || 0) + 1}`,
              ],
            }
          : q
      )
    );

  const updateOption = (qId: string, idx: number, val: string) =>
    setQuestions((qs) =>
      qs.map((q) => {
        if (q.id === qId && q.options) {
          const newOpts = [...q.options];
          newOpts[idx] = val;
          return { ...q, options: newOpts };
        }
        return q;
      })
    );

  const removeOption = (qId: string, idx: number) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qId && q.options
          ? { ...q, options: q.options.filter((_, i) => i !== idx) }
          : q
      )
    );

  return {
    title,
    setTitle,
    questions,
    setQuestions,
    addQuestion,
    removeQuestion,
    updateQuestionLabel,
    updateQuestionType,
    toggleRequired,
    addOption,
    updateOption,
    removeOption,
  };
}
