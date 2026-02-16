import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BriefcaseBusiness,
  ClipboardList,
  Banknote,
  UserPlus,
} from "lucide-react";
import { projects } from "@/features/projects/data/projects-mock";
import { forms } from "@/features/forms/data/forms-mock";
import { useUsersStore } from "@/stores/users-store";

type Activity = {
  id: string;
  user: { name: string; avatar?: string; initials: string };
  action: string;
  target: string;
  type: "project" | "form" | "passive" | "user";
  timestamp: string;
};

function getInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Há 1 dia";
  if (diffDays < 7) return `Há ${diffDays} dias`;
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semana(s)`;
  if (diffDays < 365) return `Há ${Math.floor(diffDays / 30)} mês(es)`;
  return `Há ${Math.floor(diffDays / 365)} ano(s)`;
}

const typeIcons: Record<Activity["type"], React.ReactNode> = {
  project: <BriefcaseBusiness className="h-3 w-3" />,
  form: <ClipboardList className="h-3 w-3" />,
  passive: <Banknote className="h-3 w-3" />,
  user: <UserPlus className="h-3 w-3" />,
};

const typeBadgeVariant: Record<Activity["type"], string> = {
  project: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  form: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  passive:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  user: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

export function RecentActivity() {
  const { users } = useUsersStore();

  const activities = useMemo(() => {
    const result: Activity[] = [];

    const sortedProjects = [...projects]
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      )
      .slice(0, 2);

    for (const p of sortedProjects) {
      const user = users.find(
        (u) => `${u.firstName} ${u.lastName}` === p.responsible,
      );
      result.push({
        id: `proj-${p.id}`,
        user: {
          name: p.responsible || "Usuário",
          initials: user ? getInitials(user.firstName, user.lastName) : "??",
        },
        action:
          p.status === "active" ? "criou o projeto" : "atualizou o projeto",
        target: p.title,
        type: "project",
        timestamp: formatRelativeDate(p.startDate),
      });
    }

    const sortedForms = [...forms]
      .sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
      )
      .slice(0, 2);

    for (const f of sortedForms) {
      result.push({
        id: `form-${f.id}`,
        user: {
          name: f.owner,
          initials: f.owner
            .split(" ")
            .map((w) => w.charAt(0))
            .join("")
            .toUpperCase()
            .substring(0, 2),
        },
        action:
          f.status === "Ativo" ? "ativou o formulário" : "editou o formulário",
        target: f.title,
        type: "form",
        timestamp: formatRelativeDate(f.lastUpdated),
      });
    }

    const sortedUsers = [...users]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 2);

    for (const u of sortedUsers) {
      result.push({
        id: `user-${u.id}`,
        user: {
          name: `${u.firstName} ${u.lastName}`,
          initials: getInitials(u.firstName, u.lastName),
        },
        action: "foi adicionado ao sistema",
        target: "",
        type: "user",
        timestamp: formatRelativeDate(u.createdAt.toString()),
      });
    }

    return result.slice(0, 6);
  }, [users]);
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm leading-none">
              <span className="font-medium">{activity.user.name}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>{" "}
              <span className="font-medium">{activity.target}</span>
            </p>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`gap-1 text-xs ${typeBadgeVariant[activity.type]}`}
              >
                {typeIcons[activity.type]}
                {activity.type === "project" && "Projeto"}
                {activity.type === "form" && "Formulário"}
                {activity.type === "passive" && "Passivo"}
                {activity.type === "user" && "Usuário"}
              </Badge>
              <span className="text-muted-foreground text-xs">
                {activity.timestamp}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
