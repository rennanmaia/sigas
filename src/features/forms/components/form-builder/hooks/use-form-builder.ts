import { useCallback, useState } from "react";
import type { Question, QuestionType } from "../types/question";

export function useFormBuilder() {
  const defaultTitle = "Formulário sem título";
  const defaultQuestions: Question[] = [
    {
      id: crypto.randomUUID(),
      type: "text",
      label: "Pergunta sem título",
      required: false,
    },
  ];

  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);

  const loadForm = useCallback((data: any) => {
    setTitle(data.title || defaultTitle);
    setDescription(data.description || "");
    setQuestions(data.questions?.length ? data.questions : defaultQuestions);
  }, []);

  const resetForm = useCallback(() => {
    setTitle(defaultTitle);
    setDescription("");
    setQuestions(defaultQuestions);
  }, []);

  const addQuestion = useCallback((type: QuestionType, atIndex?: number) => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type,
      label: "Pergunta sem título",
      required: false,
      options:
        type === "select" || type === "checkbox"
          ? [
              { id: crypto.randomUUID(), label: "Opção 1" },
              { id: crypto.randomUUID(), label: "Opção 2" },
            ]
          : undefined,
    };

    setQuestions((prev) => {
      if (atIndex === undefined) return [...prev, newQuestion];
      const newQuestions = [...prev];
      newQuestions.splice(atIndex + 1, 0, newQuestion);
      return newQuestions;
    });
  }, []);

  const duplicateQuestion = useCallback((id: string) => {
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.id === id);
      if (index === -1) return prev;
      const original = prev[index];
      const copy: Question = {
        ...JSON.parse(JSON.stringify(original)),
        id: crypto.randomUUID(),
      };
      const newQuestions = [...prev];
      newQuestions.splice(index + 1, 0, copy);
      return newQuestions;
    });
  }, []);

  const removeQuestion = useCallback(
    (id: string) => setQuestions((q) => q.filter((item) => item.id !== id)),
    [],
  );

  const updateQuestion = useCallback(
    (id: string, updates: Partial<Question>) => {
      setQuestions((qs) =>
        qs.map((q) => (q.id === id ? { ...q, ...updates } : q)),
      );
    },
    [],
  );

  const updateQuestionLabel = useCallback(
    (id: string, label: string) => updateQuestion(id, { label }),
    [updateQuestion],
  );

  const updateQuestionType = useCallback(
    (id: string, type: QuestionType) =>
      setQuestions((qs) =>
        qs.map((q) =>
          q.id === id
            ? {
                ...q,
                type,
                options:
                  type === "select" || type === "checkbox"
                    ? q.options && q.options.length >= 2
                      ? q.options
                      : [
                          { id: crypto.randomUUID(), label: "Opção 1" },
                          { id: crypto.randomUUID(), label: "Opção 2" },
                        ]
                    : undefined,
              }
            : q,
        ),
      ),
    [],
  );

  const toggleRequired = useCallback(
    (id: string) =>
      setQuestions((qs) =>
        qs.map((q) => (q.id === id ? { ...q, required: !q.required } : q)),
      ),
    [],
  );

  const addOption = useCallback((questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const newOption = { id: crypto.randomUUID(), label: "" };
          return { ...q, options: [...(q.options || []), newOption] };
        }
        return q;
      }),
    );
  }, []);

  const updateOption = useCallback(
    (questionId: string, idx: number, val: string) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId && q.options) {
            const newOpts = [...q.options];
            newOpts[idx] = { ...newOpts[idx], label: val };
            return { ...q, options: newOpts };
          }
          return q;
        }),
      );
    },
    [],
  );

  const removeOption = useCallback(
    (qId: string, idx: number) =>
      setQuestions((qs) =>
        qs.map((q) =>
          q.id === qId && q.options
            ? { ...q, options: q.options.filter((_, i) => i !== idx) }
            : q,
        ),
      ),
    [],
  );

  return {
    title,
    setTitle,
    description,
    setDescription,
    questions,
    setQuestions,
    loadForm,
    resetForm,
    addQuestion,
    duplicateQuestion,
    removeQuestion,
    updateQuestion,
    updateQuestionLabel,
    updateQuestionType,
    toggleRequired,
    addOption,
    updateOption,
    removeOption,
  };
}
