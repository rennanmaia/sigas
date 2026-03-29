import PageHeader from "@/components/page/page-header";
import { Main } from "@/components/layout/main";
import { useUsersStore } from "@/stores/users-store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PenLine, Trash2, Clock, User as UserIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type UserLog = {
  id: string;
  userId: string;
  userName: string;
  action: "criação" | "edição" | "exclusão";
  targetUserId: string;
  targetUserName: string;
  timestamp: string;
  details?: string;
};

const actionIcons = {
  criação: <FileText className="h-5 w-5" />,
  edição: <PenLine className="h-5 w-5" />,
  exclusão: <Trash2 className="h-5 w-5" />,
};

const actionColors = {
  criação: "border-green-200 bg-green-50 text-green-700",
  edição: "border-blue-200 bg-blue-50 text-blue-700",
  exclusão: "border-red-200 bg-red-50 text-red-700",
};

export default function ViewUserLog({ logId }: { logId?: string }) {
  const { logs, users } = useUsersStore();

  const log = logs.find((l) => l.id === logId) as UserLog | undefined;

  if (!log) {
    return (
      <Main className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Log não encontrado!</h2>
          <p className="text-muted-foreground">O registro solicitado pode ter sido excluído.</p>
        </div>
      </Main>
    );
  }

  const affectedUser = users.find((u) => u.id === log.targetUserId);

  return (
    <>
      <PageHeader backTo="/users/logs" title="Detalhes do Log - Usuário" />
      <Main>
        {/* Header da Ação */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-card border rounded-xl shadow-sm">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
            {actionIcons[log.action]}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight capitalize">
                {log.action} de Usuário
              </h1>
              <Badge className={`gap-1.5 ${actionColors[log.action]}`}>
                {actionIcons[log.action]}
                {log.action}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {format(new Date(log.timestamp), "dd 'de' MMMM 'de' yyyy 'às' HH:mm:ss", {
                locale: ptBR,
              })}
            </p>
          </div>
        </div>

        {/* Conteúdo em Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna 1 e 2: Informações do Usuário */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" /> Usuário Afetado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {affectedUser ? (
                <>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">Nome do Usuário</p>
                    <p className="text-base font-semibold">{affectedUser.firstName} {affectedUser.lastName || ""}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">E-mail</p>
                    <p className="text-sm font-mono">{affectedUser.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">Username</p>
                    <p className="text-sm">@{affectedUser.username}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">Status</p>
                    <Badge variant="secondary">{affectedUser.status}</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">
                      Papéis ({affectedUser.roles?.length || 0})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {affectedUser.roles?.map((role, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {role.replace(/_/g, ' ')}
                        </Badge>
                      )) || <p className="text-xs text-muted-foreground italic">Nenhum papel</p>}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-base text-muted-foreground">
                  Usuário não encontrado (ID: {log.targetUserId})
                </p>
              )}
            </CardContent>
          </Card>

          {/* Coluna 3: Informações da Ação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Ação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Tipo de Ação</p>
                <Badge className={`gap-1.5 ${actionColors[log.action]}`}>
                  {actionIcons[log.action]}
                  {log.action}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-dashed">
                <span className="text-sm text-muted-foreground">Executado por:</span>
                <span className="text-sm font-medium">{log.userName}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-dashed">
                <span className="text-sm text-muted-foreground">ID do Executor:</span>
                <span className="text-xs font-mono">{log.userId}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Data/Hora:</span>
                <span className="text-sm font-medium">
                  {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm", {
                    locale: ptBR,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da Ação (se houver) - Ocupa toda largura */}
          {log.details && (
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg">Detalhes da Ação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground whitespace-pre-line bg-muted p-4 rounded-md">
                  {log.details}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Main>
    </>
  );
}
