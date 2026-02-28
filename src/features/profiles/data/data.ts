import { Shield, UserCheck, Users, CreditCard } from "lucide-react";

export const roles = [
  {
    label: "General Admin",
    value: "generaladmin",
    icon: Shield,
  },
  {
    label: "Project Admin",
    value: "projectadmin",
    icon: UserCheck,
  },
  {
    label: "Form Admin",
    value: "formadmin",
    icon: Users,
  },
  {
    label: "Colector",
    value: "colector",
    icon: CreditCard,
  },
] as const;
