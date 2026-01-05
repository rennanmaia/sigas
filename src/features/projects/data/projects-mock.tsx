import React from "react";
import {
  TreeDeciduous,
  Users,
  Droplets,
  Bird,
  ClipboardCheck,
  MapPin,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

export type ProjectStatus = "em andamento" | "concluido";
export type ProjectCategory = "Ambiental" | "Social";

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
};

export const projects: Project[] = [
  {
    id: "proj-001",
    title: "Monitoramento de Fauna (BR-101)",
    logo: <Bird className="text-emerald-600" size={20} />,
    status: "em andamento",
    description: "Coleta de dados sobre atropelamento e avistamento de animais silvestres no trecho sul.",
    category: "Ambiental",
 startDate: "01/01/2026",
    endDate: "25/06/2026",
    budget: 150000.00,
    responsible: "Ana Silva",
    stats: {
      formsCount: 3,
      responsesCount: 1240,
      collectorsCount: 8,
      managersCount: 2
    }
  },
  {
    id: "proj-002",
    title: "Censo Socioeconômico - Vila Nova",
    logo: <Users className="text-blue-600" size={20} />,
    status: "concluido",
    description: "Levantamento demográfico e perfil de renda das famílias afetadas pela obra da barragem.",
    category: "Social",
 startDate: "01/01/2026",
    endDate: "25/06/2026",
    budget: 85000.00,
    responsible: "Carlos Mendes",
    stats: {
      formsCount: 1,
      responsesCount: 450,
      collectorsCount: 15,
      managersCount: 3
    }
  },
  {
    id: "proj-003",
    title: "Qualidade da Água (Bacia Hidrográfica)",
    logo: <Droplets className="text-cyan-600" size={20} />,
    status: "em andamento",
    description: "Análise físico-química periódica de pontos de coleta nos rios da região mineradora.",
    category: "Ambiental",
 startDate: "01/01/2026",
    endDate: "25/06/2026",
    budget: 220000.00,
    responsible: "Mariana Costa",
    stats: {
      formsCount: 5,
      responsesCount: 89,
      collectorsCount: 4,
      managersCount: 1
    }
  },
  {
    id: "proj-004",
    title: "Gestão de Reclamações (Ouvidoria)",
    logo: <MessageSquare className="text-orange-600" size={20} />,
    status: "concluido",
    description: "Registro e tratamento de impactos relatados pela comunidade local durante a fase de instalação.",
    category: "Social",
 startDate: "01/01/2026",
    endDate: "25/06/2026",
    budget: 45000.00,
    responsible: "Roberto Lima",
    stats: {
      formsCount: 2,
      responsesCount: 156,
      collectorsCount: 2,
      managersCount: 2
    }
  },
  {
    id: "proj-005",
    title: "Supressão de Vegetação - Área B",
    logo: <TreeDeciduous className="text-green-700" size={20} />,
    status: "em andamento",
    description: "Inventário florestal e controle de compensação ambiental para expansão da planta industrial.",
    category: "Ambiental",
 startDate: "01/01/2026",
    endDate: "25/06/2026",
    budget: 310000.00,
    responsible: "Juliana Ferreira",
    stats: {
      formsCount: 4,
      responsesCount: 312,
      collectorsCount: 6,
      managersCount: 2
    }
  },
  {
    id: "proj-006",
    title: "Auditoria de Licenciamento (IBAMA)",
    logo: <ClipboardCheck className="text-slate-600" size={20} />,
    status: "concluido",
    description: "Checklist de conformidade para renovação da Licença de Operação (LO).",
    category: "Ambiental",
    startDate: "01/01/2026",
    endDate: "25/06/2026",
    budget: 12000.00,
    responsible: "Fernando Souza",
    stats: {
      formsCount: 1,
      responsesCount: 1,
      collectorsCount: 1,
      managersCount: 3
    }
  },
  {
    id: "proj-007",
    title: "Programa de Educação Ambiental",
    logo: <MapPin className="text-rose-600" size={20} />,
    status: "em andamento",
    description: "Aplicação de formulários de avaliação após oficinas em escolas da rede pública.",
    category: "Social",
    startDate: "01/01/2026",
    endDate: "25/06/2026",
    budget: 60000.00,
    responsible: "Patrícia Rocha",
    stats: {
      formsCount: 2,
      responsesCount: 840,
      collectorsCount: 12,
      managersCount: 2
    }
  },
  {
    id: "proj-008",
    title: "Inspeção de EPIs em Campo",
    logo: <ShieldCheck className="text-amber-600" size={20} />,
    status: "concluido",
    description: "Verificação de segurança do trabalho para as equipes de topografia e sondagem.",
    category: "Ambiental",
    startDate: "01/01/2026",
    endDate: "25/06/2026",
    budget: 5000.00,
    responsible: "Lucas Martins",
    stats: {
      formsCount: 10,
      responsesCount: 45,
      collectorsCount: 3,
      managersCount: 1
    }
  },
];