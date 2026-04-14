import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useLiabilitiesStore } from "@/stores/passives-store";

export function PassivesSummary() {
  const { liabilities } = useLiabilitiesStore();

  const passivesData = useMemo(() => {
    const ativos = liabilities.filter((l) => l.status === "Ativo").length;
    const inativos = liabilities.filter((l) => l.status === "Inativo").length;
    const indisponiveis = liabilities.filter(
      (l) => l.status === "Indisponível",
    ).length;
    const comEvidencias = liabilities.filter(
      (l) => l.documentos.length > 0,
    ).length;

    return [
      {
        title: "Passivos Ativos",
        value: ativos,
        description: "Em monitoramento",
        icon: CheckCircle2,
        iconClass: "text-green-500",
      },
      {
        title: "Inativos",
        value: inativos,
        description: "Não monitorados",
        icon: Clock,
        iconClass: "text-blue-500",
      },
      {
        title: "Indisponíveis",
        value: indisponiveis,
        description: "Requer atenção",
        icon: AlertTriangle,
        iconClass: "text-yellow-500",
      },
      {
        title: "Com Evidências",
        value: comEvidencias,
        description: "Documentados",
        icon: XCircle,
        iconClass: "text-blue-500",
      },
    ];
  }, [liabilities]);
  return (
    <>
      {passivesData.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.iconClass}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-muted-foreground text-xs">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
