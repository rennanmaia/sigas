import { useCallback, useMemo } from "react";
import type { LiabilityStats } from "../data/schema";
import { SummaryCard } from "./passives-summary-card";
import { AlertTriangle, Calendar, History, UserCheck } from "lucide-react";
import { getRouteApi } from "@tanstack/react-router";
import { LiabilityView } from "@/routes/_authenticated/passives";
import { useLiabilitiesStore } from "@/stores/passives-store";
import { PassivesTable } from "./passives-table";

const route = getRouteApi("/_authenticated/passives/");
export function PassivesOverview() {
  const navigate = route.useNavigate();
  const { getStats } = useLiabilitiesStore();
  const search = route.useSearch();

  const goToCritical = useCallback(
    () =>
      navigate({
        search: (prev) => ({ ...prev, view: LiabilityView.CRITICAL }),
      }),
    [],
  );

  const stats: LiabilityStats = useMemo(() => {
    return getStats();
  }, [getStats]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Visão Geral de Passivos
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitoramento e gestão de passivos ESG.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total de Passivos"
          value={stats.total}
          sub="100% da carteira"
          icon={<History className="h-4 w-4" />}
        />
        <SummaryCard
          title="Ativos"
          value={stats.ativos}
          sub={`${stats.total ? ((stats.ativos / stats.total) * 100).toFixed(0) : 0}% do total`}
          icon={<UserCheck className="h-4 w-4 text-emerald-500" />}
        />
        <SummaryCard
          title="Indisponíveis"
          value={stats.indisponiveis}
          sub={`${stats.total ? ((stats.indisponiveis / stats.total) * 100).toFixed(0) : 0}% do total`}
          icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
          alert
          onReview={goToCritical}
        />
        <SummaryCard
          title="Com Evidências"
          value={stats.comEvidencias}
          sub="Documentados"
          icon={<Calendar className="h-4 w-4 text-blue-500" />}
        />
      </div>
      <PassivesTable navigate={navigate as any} search={search} />
    </div>
  );
}
