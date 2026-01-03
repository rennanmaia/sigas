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

export type Project = {
  title: string;
  logo: React.ReactNode;
  status: "em andamento" | "concluido"; // por enquanto somente esses tipos de status
  description: string;
  category: "Ambiental" | "Social"; // depois podem ser adicionadas mais categorias caso seja necessário
};

export const projects: Project[] = [
  {
    title: "Monitoramento de Fauna (BR-101)",
    logo: <Bird className="text-emerald-600" size={20} />,
    status: "em andamento",
    description:
      "Coleta de dados sobre atropelamento e avistamento de animais silvestres no trecho sul.",
    category: "Ambiental",
  },
  {
    title: "Censo Socioeconômico - Vila Nova",
    logo: <Users className="text-blue-600" size={20} />,
    status: "concluido",
    description:
      "Levantamento demográfico e perfil de renda das famílias afetadas pela obra da barragem.",
    category: "Social",
  },
  {
    title: "Qualidade da Água (Bacia Hidrográfica)",
    logo: <Droplets className="text-cyan-600" size={20} />,
    status: "em andamento",
    description:
      "Análise físico-química periódica de pontos de coleta nos rios da região mineradora.",
    category: "Ambiental",
  },
  {
    title: "Gestão de Reclamações (Ouvidoria)",
    logo: <MessageSquare className="text-orange-600" size={20} />,
    status: "concluido",
    description:
      "Registro e tratamento de impactos relatados pela comunidade local durante a fase de instalação.",
    category: "Social",
  },
  {
    title: "Supressão de Vegetação - Área B",
    logo: <TreeDeciduous className="text-green-700" size={20} />,
    status: "em andamento",
    description:
      "Inventário florestal e controle de compensação ambiental para expansão da planta industrial.",
    category: "Ambiental",
  },
  {
    title: "Auditoria de Licenciamento (IBAMA)",
    logo: <ClipboardCheck className="text-slate-600" size={20} />,
    status: "concluido",
    description:
      "Checklist de conformidade para renovação da Licença de Operação (LO).",
    category: "Ambiental",
  },
  {
    title: "Programa de Educação Ambiental",
    logo: <MapPin className="text-rose-600" size={20} />,
    status: "em andamento",
    description:
      "Aplicação de formulários de avaliação após oficinas em escolas da rede pública.",
    category: "Social",
  },
  {
    title: "Inspeção de EPIs em Campo",
    logo: <ShieldCheck className="text-amber-600" size={20} />,
    status: "concluido",
    description:
      "Verificação de segurança do trabalho para as equipes de topografia e sondagem.",
    category: "Ambiental",
  },
];
