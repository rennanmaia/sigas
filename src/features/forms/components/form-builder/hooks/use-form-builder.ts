import { useCallback, useState } from "react";
import type { Question, QuestionType, Section } from "../types/question";

function createDefaultQuestion(): Question {
  return {
    id: crypto.randomUUID(),
    type: "text",
    label: "Pergunta sem título",
    required: false,
  };
}

function createDefaultSection(index: number = 1): Section {
  return {
    id: crypto.randomUUID(),
    title: `Seção ${index}`,
    questions: [createDefaultQuestion()],
  };
}

export function useFormBuilder() {
  const defaultTitle = "Formulário sem título";

  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState<Section[]>([
    createDefaultSection(1),
  ]);

  const loadForm = useCallback((data: any) => {
    setTitle(data.title || defaultTitle);
    setDescription(data.description || "");
    if (data.sections?.length) {
      setSections(data.sections);
    } else if (data.questions?.length) {
      setSections([
        {
          id: crypto.randomUUID(),
          title: "Seção 1",
          questions: data.questions,
        },
      ]);
    } else {
      setSections([createDefaultSection(1)]);
    }
  }, []);

  const resetForm = useCallback(() => {
    setTitle(defaultTitle);
    setDescription("");
    setSections([createDefaultSection(1)]);
  }, []);

  const addSection = useCallback((atIndex?: number) => {
    setSections((prev) => {
      const newSection = createDefaultSection(prev.length + 1);
      if (atIndex === undefined) return [...prev, newSection];
      const next = [...prev];
      next.splice(atIndex + 1, 0, newSection);
      return next;
    });
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setSections((prev) => {
      if (prev.length <= 1) return prev;
      return prev
        .filter((s) => s.id !== sectionId)
        .map((s) => {
          if (!s.navigation?.rules) return s;
          return {
            ...s,
            navigation: {
              ...s.navigation,
              defaultNext:
                s.navigation.defaultNext === sectionId
                  ? "next"
                  : s.navigation.defaultNext,
              rules: s.navigation.rules.filter(
                (r) => r.goToSectionId !== sectionId,
              ),
            },
          };
        });
    });
  }, []);

  const updateSection = useCallback(
    (sectionId: string, updates: Partial<Section>) => {
      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
      );
    },
    [],
  );

  const reorderSections = useCallback(
    (sourceIndex: number, destIndex: number) => {
      setSections((prev) => {
        const next = Array.from(prev);
        const [moved] = next.splice(sourceIndex, 1);
        next.splice(destIndex, 0, moved);
        return next;
      });
    },
    [],
  );

  const addQuestion = useCallback(
    (type: QuestionType, sectionId: string, atIndex?: number) => {
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
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== sectionId) return s;
          const qs = [...s.questions];
          if (atIndex === undefined) {
            qs.push(newQuestion);
          } else {
            qs.splice(atIndex + 1, 0, newQuestion);
          }
          return { ...s, questions: qs };
        }),
      );
    },
    [],
  );

  const duplicateQuestion = useCallback(
    (questionId: string, sectionId: string) => {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== sectionId) return s;
          const index = s.questions.findIndex((q) => q.id === questionId);
          if (index === -1) return s;
          const copy: Question = {
            ...JSON.parse(JSON.stringify(s.questions[index])),
            id: crypto.randomUUID(),
          };
          const qs = [...s.questions];
          qs.splice(index + 1, 0, copy);
          return { ...s, questions: qs };
        }),
      );
    },
    [],
  );

  const removeQuestion = useCallback(
    (questionId: string, sectionId: string) => {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            questions: s.questions.filter((q) => q.id !== questionId),
          };
        }),
      );
    },
    [],
  );

  const updateQuestion = useCallback(
    (questionId: string, sectionId: string, updates: Partial<Question>) => {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            questions: s.questions.map((q) =>
              q.id === questionId ? { ...q, ...updates } : q,
            ),
          };
        }),
      );
    },
    [],
  );

  const updateQuestionLabel = useCallback(
    (questionId: string, sectionId: string, label: string) =>
      updateQuestion(questionId, sectionId, { label }),
    [updateQuestion],
  );

  const updateQuestionType = useCallback(
    (questionId: string, sectionId: string, type: QuestionType) => {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            questions: s.questions.map((q) =>
              q.id === questionId
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
          };
        }),
      );
    },
    [],
  );

  const toggleRequired = useCallback(
    (questionId: string, sectionId: string) => {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            questions: s.questions.map((q) =>
              q.id === questionId ? { ...q, required: !q.required } : q,
            ),
          };
        }),
      );
    },
    [],
  );

  const addOption = useCallback((questionId: string, sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          questions: s.questions.map((q) => {
            if (q.id !== questionId) return q;
            return {
              ...q,
              options: [
                ...(q.options || []),
                { id: crypto.randomUUID(), label: "" },
              ],
            };
          }),
        };
      }),
    );
  }, []);

  const updateOption = useCallback(
    (questionId: string, sectionId: string, idx: number, val: string) => {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            questions: s.questions.map((q) => {
              if (q.id !== questionId || !q.options) return q;
              const opts = [...q.options];
              opts[idx] = { ...opts[idx], label: val };
              return { ...q, options: opts };
            }),
          };
        }),
      );
    },
    [],
  );

  const removeOption = useCallback(
    (questionId: string, sectionId: string, idx: number) => {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            questions: s.questions.map((q) =>
              q.id === questionId && q.options
                ? { ...q, options: q.options.filter((_, i) => i !== idx) }
                : q,
            ),
          };
        }),
      );
    },
    [],
  );

  const reorderQuestionsInSection = useCallback(
    (sectionId: string, sourceIndex: number, destIndex: number) => {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== sectionId) return s;
          const qs = Array.from(s.questions);
          const [moved] = qs.splice(sourceIndex, 1);
          qs.splice(destIndex, 0, moved);
          return { ...s, questions: qs };
        }),
      );
    },
    [],
  );

  const moveQuestionBetweenSections = useCallback(
    (
      fromSectionId: string,
      sourceIndex: number,
      toSectionId: string,
      destIndex: number,
    ) => {
      setSections((prev) => {
        const fromSection = prev.find((s) => s.id === fromSectionId);
        if (!fromSection) return prev;
        const question = fromSection.questions[sourceIndex];
        if (!question) return prev;
        return prev.map((s) => {
          if (s.id === fromSectionId) {
            return {
              ...s,
              questions: s.questions.filter((_, i) => i !== sourceIndex),
            };
          }
          if (s.id === toSectionId) {
            const qs = Array.from(s.questions);
            qs.splice(destIndex, 0, question);
            return { ...s, questions: qs };
          }
          return s;
        });
      });
    },
    [],
  );

  const reorderOptions = useCallback(
    (questionId: string, sourceIndex: number, destIndex: number) => {
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          questions: s.questions.map((q) => {
            if (q.id !== questionId || !q.options) return q;
            const opts = Array.from(q.options);
            const [moved] = opts.splice(sourceIndex, 1);
            opts.splice(destIndex, 0, moved);
            return { ...q, options: opts };
          }),
        })),
      );
    },
    [],
  );

  return {
    title,
    setTitle,
    description,
    setDescription,
    sections,
    setSections,
    loadForm,
    resetForm,
    addSection,
    removeSection,
    updateSection,
    reorderSections,
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
    reorderQuestionsInSection,
    moveQuestionBetweenSections,
    reorderOptions,
  };
}
