import React from "react";
import { Users, Bird } from "lucide-react";
import { users } from "@/features/users/data/users";

export const PROJECT_STATUS = {
  active: "active",
  paused: "paused",
  finished: "finished",
  canceled: "canceled",
  expired: "expired",
};
export type ProjectStatus = keyof typeof PROJECT_STATUS;
export type ProjectCategory = "Ambiental" | "Social";

const activeProjectAdmins = users.filter(
  (u) => u.status === "active" && u.roles.includes("project_administrator"),
);

const activeTeamMembers = users.filter(
  (u) => u.status === "active" && !u.roles.includes("project_administrator"),
);

const getUserFullName = (user: (typeof users)[0]) =>
  `${user.firstName} ${user.lastName}`;

const projectAdminsForMock = activeProjectAdmins.slice(0, 5);

const teamMembersForMock = activeTeamMembers.slice(0, 15);

export const projectTeam = [
  ...projectAdminsForMock.map((u) => ({
    id: u.id,
    name: getUserFullName(u),
    role: "Gerente de Projeto",
    initial: `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase(),
  })),
  ...teamMembersForMock.map((u) => ({
    id: u.id,
    name: getUserFullName(u),
    role:
      u.roles[0] === "collector"
        ? "Coletor"
        : u.roles[0] === "questionnaire_administrator"
          ? "Administrador de Questionários"
          : u.roles[0] === "general_administrator"
            ? "Administrador Geral"
            : u.roles[0],
    initial: `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase(),
  })),
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
  memberRoles?: Record<string, string>;
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
    responsible: projectAdminsForMock[0]
      ? getUserFullName(projectAdminsForMock[0])
      : "",
    stats: {
      formsCount: 2,
      responsesCount: 1240,
      collectorsCount: 3,
      managersCount: 1,
    },
    forms: ["frm-1", "frm-2"],
    members: [
      projectAdminsForMock[0]?.id,
      teamMembersForMock[0]?.id,
      teamMembersForMock[1]?.id,
      teamMembersForMock[2]?.id,
    ].filter(Boolean) as string[],
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
    responsible: projectAdminsForMock[1]
      ? getUserFullName(projectAdminsForMock[1])
      : "",
    stats: {
      formsCount: 2,
      responsesCount: 450,
      collectorsCount: 3,
      managersCount: 1,
    },
    forms: ["frm-3", "frm-4"],
    members: [
      projectAdminsForMock[1]?.id,
      teamMembersForMock[3]?.id,
      teamMembersForMock[4]?.id,
      teamMembersForMock[5]?.id,
    ].filter(Boolean) as string[],
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
    responsible: projectAdminsForMock[2]
      ? getUserFullName(projectAdminsForMock[2])
      : "",
    stats: {
      formsCount: 0,
      responsesCount: 0,
      collectorsCount: 2,
      managersCount: 1,
    },
    forms: [],
    members: [
      projectAdminsForMock[2]?.id,
      teamMembersForMock[6]?.id,
      teamMembersForMock[7]?.id,
    ].filter(Boolean) as string[],
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
    responsible: projectAdminsForMock[3]
      ? getUserFullName(projectAdminsForMock[3])
      : "",
    stats: {
      formsCount: 0,
      responsesCount: 0,
      collectorsCount: 2,
      managersCount: 1,
    },
    forms: [],
    members: [
      projectAdminsForMock[3]?.id,
      teamMembersForMock[8]?.id,
      teamMembersForMock[9]?.id,
    ].filter(Boolean) as string[],
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
    responsible: projectAdminsForMock[4]
      ? getUserFullName(projectAdminsForMock[4])
      : "",
    stats: {
      formsCount: 1,
      responsesCount: 230,
      collectorsCount: 2,
      managersCount: 1,
    },
    forms: [],
    members: [
      projectAdminsForMock[4]?.id,
      teamMembersForMock[10]?.id,
      teamMembersForMock[11]?.id,
    ].filter(Boolean) as string[],
  },
];
