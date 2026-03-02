import { Shield, UserCheck, Users, CreditCard } from "lucide-react";

export const roles = [
  {
    label: "Administrador Geral",
    value: "generaladmin",
    icon: Shield,
  },
  {
    label: "Administrador de Projeto",
    value: "projectadmin",
    icon: UserCheck,
  },
  {
    label: "Administrador de Formulário",
    value: "formadmin",
    icon: Users,
  },
  {
    label: "Coletor",
    value: "colector",
    icon: CreditCard,
  },
] as const;
