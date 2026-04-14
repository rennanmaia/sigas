import { useState, useCallback } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LiabilitiesProvider } from "@/features/passives/components/passives-provider";
import { LiabilityDialogs } from "@/features/passives/components/passives-dialog";
import { PassiveCard } from "@/features/passives/components/passives-card";
import { PassivesTable } from "@/features/passives/components/passives-table-v2";
import { PassiveWizard } from "@/features/passives/components/passive-wizard";
import { useLiabilitiesStore } from "@/stores/passives-store";
import type { Liability } from "@/features/passives/data/schema";

type PassiveView = "overview" | "critical" | "create";

function PassivesTabContent() {
  const [view, setView] = useState<PassiveView>("overview");
  const [isLoading, setIsLoading] = useState(false);
  const { liabilities, addLiability } = useLiabilitiesStore();
  const criticalItems = liabilities.filter((i) => i.status === "Indisponível");

  const goToOverview = useCallback(() => setView("overview"), []);
  const goToCreate = useCallback(() => setView("create"), []);

  const handleSubmit = async (values: Liability) => {
    try {
      setIsLoading(true);
      const passive: Liability = {
        ...values,
        id: `passivo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ultimaAtualizacao: new Date().toISOString(),
        documentos: values.documentos || [],
        customFields: values.customFields || [],
      };
      addLiability(passive);
      toast.success("Passivo criado com sucesso!");
      goToOverview();
    } catch {
      toast.error("Erro ao criar passivo");
    } finally {
      setIsLoading(false);
    }
  };

  if (view === "create") {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToOverview}
            className="mb-2 -ml-2 text-muted-foreground"
          >
            ← Voltar para Visão Geral
          </Button>
          <h2 className="text-xl font-bold">Novo Passivo</h2>
          <p className="text-sm text-muted-foreground">
            Preencha os dados do passivo ambiental ou social.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cadastro de Passivo</CardTitle>
          </CardHeader>
          <CardContent>
            <PassiveWizard onSubmit={handleSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === "critical") {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToOverview}
            className="mb-2 -ml-2 text-muted-foreground"
          >
            ← Voltar para Visão Geral
          </Button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="text-yellow-500 h-5 w-5" />
            Passivos Indisponíveis
          </h2>
          <p className="text-sm text-muted-foreground">
            Existem {criticalItems.length} passivos indisponíveis.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criticalItems.map((item) => (
            <PassiveCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Visão Geral de Passivos
          </h2>
          <p className="text-sm text-muted-foreground">
            Monitoramento de conformidade e exposição de risco ESG.
          </p>
        </div>
        <Button className="gap-2" onClick={goToCreate}>
          <Plus size={15} /> Novo Passivo
        </Button>
      </div>

      <PassivesTable />
    </div>
  );
}

export function PassivesTab() {
  return (
    <LiabilitiesProvider>
      <PassivesTabContent />
      <LiabilityDialogs />
    </LiabilitiesProvider>
  );
}
