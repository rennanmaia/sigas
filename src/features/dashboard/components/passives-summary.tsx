import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useLiabilitiesStore } from "@/stores/passives-store";

export function PassivesSummary() {
  const { liabilities } = useLiabilitiesStore();

  const passivesData = useMemo(() => {
    const concluidos = liabilities.filter(
      (l) => l.statusPlano === "Concluído",
    ).length;
    const emAndamento = liabilities.filter(
      (l) =>
        l.statusPlano === "Em Execução" || l.statusPlano === "Em Planejamento",
    ).length;
    const criticos = liabilities.filter((l) => l.risco === "Crítico").length;
    const atrasados = liabilities.filter(
      (l) => l.statusPlano === "Atrasado",
    ).length;

    return [
      {
        title: "Passivos Concluídos",
        value: concluidos,
        description: "Com plano finalizado",
        icon: CheckCircle2,
        iconClass: "text-green-500",
      },
      {
        title: "Em Andamento",
        value: emAndamento,
        description: "Com tratativa ativa",
        icon: Clock,
        iconClass: "text-blue-500",
      },
      {
        title: "Críticos",
        value: criticos,
        description: "Requer ação imediata",
        icon: AlertTriangle,
        iconClass: "text-yellow-500",
      },
      {
        title: "Atrasados",
        value: atrasados,
        description: "Prazo expirado",
        icon: XCircle,
        iconClass: "text-red-500",
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
