import type { Question } from "../components/form-builder/types/question";

export type FormStatus = "Ativo" | "Rascunho" | "Arquivado" | "Concluído";

export interface FormItem {
  id: string;
  title: string;
  description: string;
  status: FormStatus;
  responses: number;
  questionsCount: number;
  lastUpdated: string;
  createdAt: string;
  owner: string;
  questions: Question[];
}

export const forms: FormItem[] = [
  {
    id: "frm-1",
    title: "Checklist de Campo - Fauna",
    description:
      "Monitoramento de atropelamento e avistamento de animais silvestres em rodovias.",
    status: "Ativo",
    responses: 840,
    questionsCount: 3,
    lastUpdated: "2026-01-05",
    createdAt: "2025-10-10",
    owner: "Carlos Silva",
    questions: [
      {
        id: "q1",
        type: "text",
        label: "Nome Científico da Espécie",
        required: true,
        validations: {
          min: 3,
          max: 50,
        },
      },
      {
        id: "q2",
        type: "select",
        label: "Estado do Animal",
        required: true,
        options: [
          { id: "opt1", label: "Vivo (Saudável)" },
          { id: "opt2", label: "Vivo (Ferido)" },
          { id: "opt3", label: "Óbito" },
        ],
      },
      {
        id: "q3",
        type: "text",
        label: "CPF do Observador",
        required: false,
        validations: {
          mask: "cpf",
        },
      },
    ],
  },
  {
    id: "frm-2",
    title: "Inspeção de Erosão e Drenagem",
    description:
      "Avaliação técnica de encostas e sistemas de escoamento de águas pluviais.",
    status: "Ativo",
    responses: 156,
    questionsCount: 2,
    lastUpdated: "2026-01-07",
    createdAt: "2025-11-02",
    owner: "Carlos Silva",
    questions: [
      {
        id: "q4",
        type: "number",
        label: "Nível de Erosão (1-5)",
        required: true,
        validations: {
          min: 1,
          max: 5,
        },
      },
      {
        id: "q5",
        type: "photo",
        label: "Registro Fotográfico da Área",
        required: true,
        validations: {
          max: 10,
        },
      },
    ],
  },
];
