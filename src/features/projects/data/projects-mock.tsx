import React from "react";
import { Users, Bird } from "lucide-react";

export const PROJECT_STATUS = {
  active: "active",
  paused: "paused",
  finished: "finished",
  canceled: "canceled",
  expired: "expired",
}
export type ProjectStatus = keyof typeof PROJECT_STATUS;
export type ProjectCategory = "Ambiental" | "Social";

export const projectTeam = [
  { id: "u-1", name: "Ana Silva", role: "Gerente de Projeto", initial: "AS" },
  { id: "u-2", name: "Lucas Martins", role: "Coletor Pleno", initial: "LM" },
  { id: "u-3", name: "Patrícia Rocha", role: "Coletor Júnior", initial: "PR" },
  {
    id: "u-4",
    name: "Carlos Mendes",
    role: "Gerente de Projeto",
    initial: "CM",
  },
  {
    id: "u-5",
    name: "Mariana Costa",
    role: "Analista Ambiental",
    initial: "MC",
  },
  { id: "u-6", name: "Roberto Lima", role: "Técnico de Campo", initial: "RL" },
  {
    id: "u-7",
    name: "Ricardo Souza",
    role: "Gerente de Projeto",
    initial: "RS",
  },
  {
    id: "u-8",
    name: "Fernanda Oliveira",
    role: "Gerente de Projeto",
    initial: "FO",
  },
  {
    id: "u-9",
    name: "Juliana Santos",
    role: "Gerente de Projeto",
    initial: "JS",
  },
];

export type ProjectStats = {
  formsCount: number;
  responsesCount: number;
  collectorsCount: number;
  managersCount: number;
};

export type Project = {
  id: string;
  title: string;
  logo: React.ReactNode;
  status: ProjectStatus;
  description: string;
  category: ProjectCategory;
  startDate: string;
  endDate: string;
  budget: number;
  responsible: string;
  stats: ProjectStats;
  forms: string[];
  members: string[];
  company: string;
  customFields?: { label: string; value: string }[];
};

export let projects: Project[] = [
  {
    id: "proj-001",
    title: "Monitoramento de Fauna (BR-101)",
    company: "Empresa Exemplo LTDA",
    logo: <Bird className="text-emerald-600" size={20} />,
    status: "active",
    description:
      "Coleta de dados sobre atropelamento e avistamento de animais silvestres no trecho sul.",
    category: "Ambiental",
    startDate: "2026-01-01",
    endDate: "2026-06-25",
    budget: 150000.0,
    responsible: "Ana Silva",
    stats: {
      formsCount: 2,
      responsesCount: 1240,
      collectorsCount: 3,
      managersCount: 1,
    },
    forms: ["frm-1", "frm-2"],
    members: ["u-1", "u-2", "u-3"],
  },
  {
    id: "proj-002",
    title: "Censo Socioeconômico - Vila Nova",
    company: "Empresa Exemplo LTDA",
    logo: <Users className="text-blue-600" size={20} />,
    status: "finished",
    description:
      "Levantamento demográfico e perfil de renda das famílias afetadas pela obra da barragem.",
    category: "Social",
    startDate: "2025-02-15",
    endDate: "2025-12-10",
    budget: 85000.0,
    responsible: "Carlos Mendes",
    stats: {
      formsCount: 2,
      responsesCount: 450,
      collectorsCount: 3,
      managersCount: 1,
    },
    forms: ["frm-3", "frm-4"],
    members: ["u-4", "u-5", "u-6"],
  },
  {
    id: "proj-003",
    title: "Monitoramento de Qualidade da Água",
    company: "Empresa Exemplo LTDA",
    logo: <Bird className="text-cyan-600" size={20} />,
    status: "paused",
    description:
      "Análise periódica da qualidade da água em pontos estratégicos da bacia hidrográfica.",
    category: "Ambiental",
    startDate: "2025-06-01",
    endDate: "2026-12-31",
    budget: 120000.0,
    responsible: "Ricardo Souza",
    stats: {
      formsCount: 0,
      responsesCount: 0,
      collectorsCount: 2,
      managersCount: 1,
    },
    forms: [],
    members: ["u-7"],
  },
  {
    id: "proj-004",
    title: "Reassentamento Comunidade Ribeirinha",
    company: "Empresa Exemplo LTDA",
    logo: <Users className="text-purple-600" size={20} />,
    status: "canceled",
    description:
      "Projeto de reassentamento e acompanhamento social das famílias ribeirinhas afetadas.",
    category: "Social",
    startDate: "2025-03-01",
    endDate: "2025-09-30",
    budget: 200000.0,
    responsible: "Fernanda Oliveira",
    stats: {
      formsCount: 0,
      responsesCount: 0,
      collectorsCount: 0,
      managersCount: 1,
    },
    forms: [],
    members: ["u-8"],
  },
  {
    id: "proj-005",
    title: "Inventário Florestal - Mata Atlântica",
    company: "Empresa Exemplo LTDA",
    logo: <Bird className="text-green-600" size={20} />,
    status: "active",
    description:
      "Levantamento e catalogação de espécies arbóreas na área de preservação permanente.",
    category: "Ambiental",
    startDate: "2025-08-01",
    endDate: "2025-12-31",
    budget: 95000.0,
    responsible: "Juliana Santos",
    stats: {
      formsCount: 1,
      responsesCount: 230,
      collectorsCount: 2,
      managersCount: 1,
    },
    forms: [],
    members: ["u-9"],
  },
];
