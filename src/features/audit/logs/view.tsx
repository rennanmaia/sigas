import PageHeader from "@/components/page/page-header";
import { Main } from "@/components/layout/main";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuditStore } from "@/stores/audit-store";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Ban, LogIn, LogOut, Shield, ShieldCheck } from "lucide-react";

const getActionMeta = (entityName: string, details?: string) => {
  const text = `${entityName} ${details || ""}`.toLowerCase();

  if (text.includes("login")) {
    return {
      label: "Login",
      icon: <LogIn className="h-5 w-5" />,
      className: "border-green-200 bg-green-50 text-green-700",
    };
  }

  if (text.includes("logout")) {
    return {
      label: "Logout",
      icon: <LogOut className="h-5 w-5" />,
      className: "border-blue-200 bg-blue-50 text-blue-700",
    };
  }

  if (text.includes("bloquead") || text.includes("suspend")) {
    return {
      label: "Conta Bloqueada/Suspensa",
      icon: <Ban className="h-5 w-5" />,
      className: "border-red-200 bg-red-50 text-red-700",
    };
  }

  if (text.includes("desbloque") || text.includes("reativ")) {
    return {
      label: "Conta Desbloqueada",
      icon: <ShieldCheck className="h-5 w-5" />,
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  return {
    label: "Evento de Sistema",
    icon: <Shield className="h-5 w-5" />,
    className: "border-slate-200 bg-slate-50 text-slate-700",
  };
};

export default function ViewAuditSystemLog({ logId }: { logId?: string }) {
  const { events } = useAuditStore();
  const event = events.find((item) => item.id === logId && item.module === "system");

  if (!event) {
    return (
      <Main className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Evento não encontrado!</h2>
          <p className="text-muted-foreground">
            O registro solicitado pode ter sido removido.
          </p>
        </div>
      </Main>
    );
  }

  const usersRaw = localStorage.getItem("local-users");
  const projectsRaw = localStorage.getItem("local-projects");

  const users = usersRaw ? (JSON.parse(usersRaw) as Array<any>) : [];
  const projects = projectsRaw ? (JSON.parse(projectsRaw) as Array<any>) : [];

  const matchedUser =
    users.find((user) => user.id === event.userId) ||
    users.find(
      (user) =>
        String(user.email || "").toLowerCase() ===
        String(event.entityName || "").toLowerCase(),
    ) ||
    users.find(
      (user) =>
        `${user.firstName || ""} ${user.lastName || ""}`.trim().toLowerCase() ===
        String(event.userName || "").toLowerCase(),
    );

  const relatedProjects = projects.filter((project) => {
    if (!matchedUser || !project) return false;
    const members = Array.isArray(project.members) ? project.members : [];
    return (
      members.includes(matchedUser.id) ||
      project.responsible === matchedUser.username ||
      project.responsible === `${matchedUser.firstName || ""} ${matchedUser.lastName || ""}`.trim()
    );
  });

  const actionMeta = getActionMeta(event.entityName, event.details);

  return (
    <>
      <PageHeader backTo="/audit" title="Detalhes do Evento de Sistema" />
      <Main>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Ação executada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className={`gap-1.5 ${actionMeta.className}`}>
                  {actionMeta.icon}
                  {actionMeta.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {format(
                    new Date(event.timestamp),
                    "dd 'de' MMMM 'de' yyyy 'às' HH:mm:ss",
                    { locale: ptBR },
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Nome do usuário</p>
                  <p className="text-sm font-medium">{event.userName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Email usado</p>
                  <p className="text-sm font-medium">{event.entityName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Módulo</p>
                  <p className="text-sm font-medium">Sistema</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Tipo da ação</p>
                  <p className="text-sm font-medium">{actionMeta.label}</p>
                </div>
              </div>

              {event.details && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Detalhes</p>
                  <p className="mt-1 whitespace-pre-line rounded-md bg-muted p-3 text-sm text-muted-foreground">
                    {event.details}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contexto do usuário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Perfis</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {matchedUser?.roles?.length ? (
                    matchedUser.roles.map((role: string) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role.replace(/_/g, " ")}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">Sem perfis identificados.</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">Projetos vinculados</p>
                <div className="mt-2 space-y-1">
                  {relatedProjects.length ? (
                    relatedProjects.slice(0, 6).map((project) => (
                      <p key={project.id} className="text-xs">
                        {project.title}
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">Sem projetos identificados.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  );
}
