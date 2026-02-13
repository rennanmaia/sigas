import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Shield, Calendar } from "lucide-react";

interface UserProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: string;
  roles: string[];
  createdAt: Date;
}

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfileData | null;
}

const getRoleLabel = (roleValue: string): string => {
  const roleLabels: Record<string, string> = {
    general_administrator: "Administrador Geral",
    project_administrator: "Gerente de Projeto",
    questionnaire_administrator: "Administrador de Questionários",
    collector: "Coletor",
  };
  return roleLabels[roleValue] || roleValue;
};

const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    active: "Ativo",
    inactive: "Inativo",
    invited: "Convidado",
    suspended: "Suspenso",
  };
  return statusLabels[status] || status;
};

export function UserProfileDialog({
  open,
  onOpenChange,
  user,
}: UserProfileDialogProps) {
  if (!user) return null;

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Perfil do Usuário</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center pt-2">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl font-semibold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <h3 className="mt-4 text-lg font-semibold">
            {user.firstName} {user.lastName}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant={user.status === "active" ? "default" : "secondary"}
              className="text-xs"
            >
              {getStatusLabel(user.status)}
            </Badge>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Telefone</span>
              <span className="text-sm font-medium">{user.phoneNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Papel(is)</span>
              <span className="text-sm font-medium">
                {user.roles.map((r) => getRoleLabel(r)).join(", ")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                Membro desde
              </span>
              <span className="text-sm font-medium">
                {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
