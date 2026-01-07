import React from "react";
import { Users, Bird } from "lucide-react";

export type ProjectStatus = "em andamento" | "concluido";
export type ProjectCategory = "Ambiental" | "Social";

export let projectForms = [
  {
    id: "frm-1",
    title: "Checklist de Campo - Fauna",
    responses: 840,
    status: "Ativo",
  },
  {
    id: "frm-2",
    title: "Registro de Avistamento Especial",
    responses: 400,
    status: "Ativo",
  },
  {
    id: "frm-3",
    title: "Relatório de Incidentes Ambientais",
    responses: 0,
    status: "Rascunho",
  },
  {
    id: "frm-4",
    title: "Pesquisa de Opinião Comunitária",
    responses: 120,
    status: "Ativo",
  },
  {
    id: "frm-5",
    title: "Inspeção de Segurança do Trabalho",
    responses: 45,
    status: "Ativo",
  },
  {
    id: "frm-6",
    title: "Monitoramento de Ruído Urbano",
    responses: 12,
    status: "Em Revisão",
  },
];

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
};

export let projects: Project[] = [
  {
    id: "proj-001",
    title: "Monitoramento de Fauna (BR-101)",
    logo: <Bird className="text-emerald-600" size={20} />,
    status: "em andamento",
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
    logo: <Users className="text-blue-600" size={20} />,
    status: "concluido",
    description:
      "Levantamento demográfico e perfil de renda das famílias afetadas pela obra da barragem.",
    category: "Social",
    startDate: "2026-02-15",
    endDate: "2026-08-10",
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
];
