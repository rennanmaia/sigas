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
  projectId: string;
  questions: Question[];
  collectors?: [];
}

export const forms: FormItem[] = [
  {
    id: "frm-1",
    title: "Checklist de Campo - Fauna",
    description:
      "Monitoramento de atropelamento e avistamento de animais silvestres em rodovias.",
    status: "Ativo",
    responses: 8,
    questionsCount: 3,
    lastUpdated: "2026-01-05",
    createdAt: "2025-10-10",
    owner: "Carlos Silva",
    projectId: "proj-001",
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
    responses: 8,
    questionsCount: 2,
    lastUpdated: "2026-01-07",
    createdAt: "2025-11-02",
    owner: "Carlos Silva",
    projectId: "proj-001",
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
  {
    id: "frm-3",
    title: "Formulário Completo - Todos os Tipos de Questões",
    description:
      "Formulário de demonstração contendo todos os tipos de questões disponíveis no sistema.",
    status: "Ativo",
    responses: 5,
    questionsCount: 10,
    lastUpdated: "2026-01-26",
    createdAt: "2026-01-15",
    owner: "Carlos Silva",
    projectId: "proj-002",
    questions: [
      {
        id: "q-text",
        type: "text",
        label: "Nome Completo",
        required: true,
        validations: {
          min: 3,
          max: 100,
          placeholder: "Digite seu nome completo",
        },
      },
      {
        id: "q-textarea",
        type: "textarea",
        label: "Observações Gerais",
        required: false,
        validations: {
          max: 500,
          placeholder: "Descreva suas observações...",
        },
      },
      {
        id: "q-number",
        type: "number",
        label: "Quantidade de Amostras",
        required: true,
        validations: {
          min: 1,
          max: 100,
        },
      },
      {
        id: "q-select",
        type: "select",
        label: "Região de Atuação",
        required: true,
        options: [
          { id: "norte", label: "Norte" },
          { id: "nordeste", label: "Nordeste" },
          { id: "centro-oeste", label: "Centro-Oeste" },
          { id: "sudeste", label: "Sudeste" },
          { id: "sul", label: "Sul" },
        ],
      },
      {
        id: "q-checkbox",
        type: "checkbox",
        label: "Equipamentos Utilizados",
        required: true,
        options: [
          { id: "gps", label: "GPS" },
          { id: "camera", label: "Câmera" },
          { id: "drone", label: "Drone" },
          { id: "termometro", label: "Termômetro" },
          { id: "medidor-ph", label: "Medidor de pH" },
        ],
      },
      {
        id: "q-date",
        type: "date",
        label: "Data da Coleta",
        required: true,
      },
      {
        id: "q-photo",
        type: "photo",
        label: "Foto do Local",
        required: false,
        validations: {
          max: 5,
        },
      },
      {
        id: "q-map",
        type: "map",
        label: "Localização da Coleta",
        required: true,
      },
      {
        id: "q-file",
        type: "file",
        label: "Documento de Autorização",
        required: false,
        validations: {
          max: 3,
        },
      },
      {
        id: "q-audio",
        type: "audio",
        label: "Gravação de Áudio (Notas de Campo)",
        required: false,
      },
    ],
  },
  {
    id: "frm-4",
    title: "Pesquisa de Satisfação Comunitária",
    description:
      "Avaliação da percepção da comunidade sobre os impactos do projeto.",
    status: "Ativo",
    responses: 45,
    questionsCount: 5,
    lastUpdated: "2026-01-20",
    createdAt: "2025-12-01",
    owner: "Carlos Silva",
    projectId: "proj-002",
    questions: [
      {
        id: "q10",
        type: "select",
        label: "Nível de Satisfação",
        required: true,
        options: [
          { id: "opt1", label: "Muito Satisfeito" },
          { id: "opt2", label: "Satisfeito" },
          { id: "opt3", label: "Neutro" },
          { id: "opt4", label: "Insatisfeito" },
          { id: "opt5", label: "Muito Insatisfeito" },
        ],
      },
    ],
  },
  {
    id: "frm-5",
    title: "Registro de Espécies Aquáticas",
    description: "Documentação de biodiversidade em corpos d'água.",
    status: "Rascunho",
    responses: 0,
    questionsCount: 4,
    lastUpdated: "2026-01-22",
    createdAt: "2026-01-10",
    owner: "Carlos Silva",
    projectId: "",
    questions: [
      {
        id: "q11",
        type: "text",
        label: "Nome da Espécie",
        required: true,
      },
    ],
  },
  {
    id: "frm-6",
    title: "Análise de Qualidade da Água",
    description: "Medições físico-químicas de recursos hídricos.",
    status: "Rascunho",
    responses: 0,
    questionsCount: 6,
    lastUpdated: "2026-01-25",
    createdAt: "2026-01-25",
    owner: "Carlos Silva",
    projectId: "",
    questions: [
      {
        id: "q12",
        type: "number",
        label: "pH",
        required: true,
        validations: { min: 0, max: 14 },
      },
    ],
  },
  {
    id: "frm-7",
    title: "Inspeção de Segurança do Trabalho",
    description: "Verificação de conformidade com normas de segurança.",
    status: "Rascunho",
    responses: 0,
    questionsCount: 8,
    lastUpdated: "2026-01-24",
    createdAt: "2025-11-15",
    owner: "Carlos Silva",
    projectId: "",
    questions: [
      {
        id: "q13",
        type: "checkbox",
        label: "EPIs Utilizados",
        required: true,
        options: [
          { id: "capacete", label: "Capacete" },
          { id: "luvas", label: "Luvas" },
          { id: "botas", label: "Botas de Segurança" },
        ],
      },
    ],
  },
];
