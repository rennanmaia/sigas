import PageHeader from "@/components/page/page-header";
import { Main } from "@/components/layout/main";
import { useProfiles } from "@/features/profiles/components/profiles-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PenLine, Trash2, Clock, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FEATURE_GROUPS } from "@/features/features/data/features";

type ProfileLog = {
  id: string;
  userId: string;
  userName: string;
  action: "criação" | "edição" | "exclusão";
  profileId: string;
  profileLabel: string;
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

const PERMISSION_LABELS = Object.fromEntries(
  FEATURE_GROUPS.flatMap((group) => group.children).map((perm) => [perm.id, perm.label])
);

export default function ViewProfileLog({ logId }: { logId?: string }) {
  const { logs, getProfileById } = useProfiles();

  const log = logs.find((l) => l.id === logId) as ProfileLog | undefined;

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

  const affectedProfile = getProfileById(log.profileId);

  return (
    <>
      <PageHeader backTo="/profiles/logs" title="Detalhes do Log - Perfil" />
      <Main>
        {/* Header da Ação */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-card border rounded-xl shadow-sm">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
            {actionIcons[log.action]}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight capitalize">
                {log.action} de Perfil
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
          {/* Coluna 1 e 2: Informações da Ação */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> Perfil Afetado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {affectedProfile ? (
                <>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">Nome do Perfil</p>
                    <p className="text-base font-semibold">{affectedProfile.label}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">ID do Perfil</p>
                    <p className="text-sm font-mono">{affectedProfile.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">Descrição</p>
                    <p className="text-sm">{affectedProfile.description || "Não informada"}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">
                      Permissões ({affectedProfile.permissions?.length || 0})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {affectedProfile.permissions?.map((perm, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {PERMISSION_LABELS[perm] ?? perm}
                        </Badge>
                      )) || <p className="text-xs text-muted-foreground italic">Nenhuma permissão</p>}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-base text-muted-foreground">
                  Perfil não encontrado (ID: {log.profileId})
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
                <span className="text-sm text-muted-foreground">ID do Usuário:</span>
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
