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
}
export let forms: FormItem[] = [
  {
    id: "frm-1",
    title: "Checklist de Campo - Fauna",
    description:
      "Monitoramento de atropelamento e avistamento de animais silvestres em rodovias.",
    status: "Ativo",
    responses: 840,
    questionsCount: 12,
    lastUpdated: "2026-01-05",
    createdAt: "2025-10-10",
    owner: "Carlos Silva",
  },
  {
    id: "frm-2",
    title: "Levantamento de Flora - Área A",
    description:
      "Censo detalhado de espécies arbóreas em zona de preservação permanente.",
    status: "Concluído",
    responses: 1250,
    questionsCount: 20,
    lastUpdated: "2026-01-02",
    createdAt: "2025-08-15",
    owner: "Ana Beatriz",
  },
  {
    id: "frm-3",
    title: "Relatório de Incidentes Ambientais",
    description:
      "Registro de vazamentos, queimadas ou desmatamento não autorizado identificados por satélite.",
    status: "Rascunho",
    responses: 0,
    questionsCount: 15,
    lastUpdated: "2025-12-28",
    createdAt: "2025-12-20",
    owner: "Ricardo Mendes",
  },
  {
    id: "frm-4",
    title: "Pesquisa Socioambiental 2024",
    description:
      "Dados históricos de percepção da comunidade local sobre o impacto das obras.",
    status: "Arquivado",
    responses: 3200,
    questionsCount: 45,
    lastUpdated: "2025-11-15",
    createdAt: "2024-01-10",
    owner: "Mariana Costa",
  },
  {
    id: "frm-5",
    title: "Inspeção de Erosão e Drenagem",
    description:
      "Avaliação técnica de encostas e sistemas de escoamento de águas pluviais.",
    status: "Ativo",
    responses: 156,
    questionsCount: 10,
    lastUpdated: "2026-01-07",
    createdAt: "2025-11-02",
    owner: "Carlos Silva",
  },
  {
    id: "frm-6",
    title: "Monitoramento de Ruído e Vibração",
    description:
      "Coleta de dados de decibéis em pontos estratégicos próximos à área urbana.",
    status: "Ativo",
    responses: 92,
    questionsCount: 6,
    lastUpdated: "2026-01-06",
    createdAt: "2025-12-05",
    owner: "Fernanda Oliveira",
  },
];
