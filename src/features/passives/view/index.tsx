import { getRouteApi, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertCircle,
  Edit2,
  Trash2,
  FileText,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useLiabilitiesStore } from "@/stores/passives-store";
import { LiabilityView } from "@/routes/_authenticated/passives";

const statusVariantMap: Record<string, string> = {
  Ativo: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Inativo: "bg-gray-100 text-gray-600 border-gray-200",
  Indisponível: "bg-amber-100 text-amber-800 border-amber-200",
};

const LiabilityRoute = getRouteApi("/_authenticated/passives/");
export function ViewLiability() {
  const { passiveId } = useParams({
    from: "/_authenticated/passives/$passiveId/",
  });
  const { liabilities, deleteLiability } = useLiabilitiesStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const nagateBack = LiabilityRoute.useNavigate();

  const liability = liabilities.find((l) => l.id === passiveId);

  if (!liability) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">
              Passivo não encontrado
            </h2>
            <p className="text-muted-foreground mb-4">
              O passivo que você está procurando não existe ou foi removido.
            </p>
            <Button
              onClick={() =>
                nagateBack({
                  to: "/passives",
                  search: {
                    view: LiabilityView.OVERVIEW,
                    tabs: LiabilityView.OVERVIEW,
                  },
                })
              }
            >
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      if (liability.id) {
        deleteLiability(liability.id);
      }
      toast.success("Passivo deletado com sucesso!");
      nagateBack({
        to: "/passives",
        search: {
          view: LiabilityView.OVERVIEW,
          tabs: LiabilityView.OVERVIEW,
        },
      });
    } catch (error) {
      toast.error("Erro ao deletar passivo");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Header fixed>
        <Button variant="ghost" size="icon" asChild>
          <Link
            to="/passives"
            search={{ tabs: LiabilityView.LIST, view: LiabilityView.OVERVIEW }}
          >
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{liability.nome}</h1>
            <Badge
              variant="outline"
              className={statusVariantMap[liability.status] ?? ""}
            >
              {liability.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link
                to="/passives/$passiveId/edit"
                params={{ passiveId: liability.id ?? "" }}
              >
                <Edit2 className="h-4 w-4" />
                Editar
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Deletar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Deletar Passivo</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja deletar este passivo? Esta ação não
                  pode ser desfeita.
                </AlertDialogDescription>
                <div className="flex gap-3 justify-end mt-6">
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deletando..." : "Deletar"}
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Header>

      <Main>
        <div className="space-y-6">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Código</p>
                  <p className="font-medium">{liability.codigo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {liability.tipo.length > 0 ? (
                      liability.tipo.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <p className="font-medium">{liability.categoria}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Criado por</p>
                  <p className="font-medium">{liability.responsavel || "—"}</p>
                </div>
              </div>

              {liability.descricao && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Descrição
                    </p>
                    <p className="text-sm">{liability.descricao}</p>
                  </div>
                </>
              )}

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Data de Identificação
                  </p>
                  <p className="font-medium">
                    {new Date(liability.dataIdentificacao).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Última Atualização
                  </p>
                  <p className="font-medium">
                    {new Date(liability.ultimaAtualizacao).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Auditado</p>
                  <p className="font-medium">
                    {liability.auditado ? "Sim" : "Não"}
                  </p>
                </div>
              </div>

              {liability.customFields && liability.customFields.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-3">
                      Campos Personalizados
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {liability.customFields.map((cf, i) => (
                        <div key={i}>
                          <p className="text-xs text-muted-foreground">
                            {cf.label}
                          </p>
                          <p className="text-sm font-medium">{cf.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="documents">
                Documentos ({liability.documentos?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              {liability.documentos && liability.documentos.length > 0 ? (
                <div className="space-y-4">
                  {liability.documentos.map((doc) => {
                    const typeColors: Record<string, string> = {
                      evidencia: "text-blue-600 bg-blue-50",
                      plano: "text-green-600 bg-green-50",
                      auditoria: "text-purple-600 bg-purple-50",
                      outro: "text-gray-600 bg-gray-50",
                    };

                    return (
                      <Card key={doc.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText
                                className={`h-8 w-8 ${typeColors[doc.tipo]}`}
                              />
                              <div>
                                <h4 className="font-medium">{doc.nome}</h4>
                                <p className="text-sm text-muted-foreground capitalize">
                                  Tipo: {doc.tipo}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum documento anexado</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Histórico de Alterações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                        <div className="h-16 w-0.5 bg-border" />
                      </div>
                      <div className="pt-1 pb-4">
                        <h4 className="font-medium">Passivo criado</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(liability.dataIdentificacao).toLocaleString(
                            "pt-BR",
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                          <Edit2 className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="pt-1">
                        <h4 className="font-medium">Última atualização</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(liability.ultimaAtualizacao).toLocaleString(
                            "pt-BR",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Main>
    </>
  );
}

export default ViewLiability;
