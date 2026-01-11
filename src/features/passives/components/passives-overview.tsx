import { useMemo } from "react";
import type { PassiveStats } from "../data/schema";
import { passivosMock } from "../data/passives";
import { SummaryCard } from "./passives-summary-card";
import { AlertTriangle, Calendar, History, Info, ShieldAlert, UserCheck } from "lucide-react";
import { ImmediateAttentionPanel } from "./attention-pannel";
import { ManagementMaturityCard } from "./maturity-card";
import { RecentEventsTimeline } from "./recent-events-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PassivesOverview() {
  
  // Cálculos de Resumo
  const stats: PassiveStats = useMemo(() => {
    const total = passivosMock.length;
    const criticos = passivosMock.filter(p => p.risco === 'Crítico').length;
    const semPlano = passivosMock.filter(p => p.statusPlano === 'Não Definido').length;
    const comPlano = passivosMock.filter(p => p.statusPlano !== 'Não Definido').length;
    const atrasados = passivosMock.filter(p => p.statusPlano === 'Atrasado').length;
    const ambiental = passivosMock.filter(p => p.tipo === 'Ambiental').length;
    const comResponsavel = passivosMock.filter(p => p.responsavel && p.responsavel.trim() !== '').length;
    const comEvidencias = passivosMock.filter(p => p.documentosAnexadas && p.documentosAnexadas > 0).length;

    return { 
      total, 
      criticos, 
      semPlano, 
      atrasados, 
      ambiental, 
      social: total - ambiental, 
      comPlano,
      comEvidencias,
      comResponsavel
    };
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Visão Geral de Passivos</h1>
          <p className="text-slate-500 text-sm">Monitoramento de conformidade e exposição de risco ESG.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard title="Total de Passivos" value={stats.total} sub={`100% da carteira`} icon={<History className="h-4 w-4 text-slate-400" />} />
        <SummaryCard 
          title="Riscos Críticos" 
          value={stats.criticos} 
          sub={`${((stats.criticos/stats.total)*100).toFixed(0)}% do total`} 
          icon={<ShieldAlert className="h-4 w-4 text-red-500" />}
          alert
        />
        <SummaryCard title="Sem Plano de Ação" value={stats.semPlano} sub="Requer atenção imediata" icon={<AlertTriangle className="h-4 w-4 text-orange-500" />} />
        <SummaryCard title="Planos em Atraso" value={stats.atrasados} sub="Gargalo operacional" icon={<Calendar className="h-4 w-4 text-red-500" />} />
        <SummaryCard title="Distribuição" value={`${stats.ambiental}/${stats.social}`} sub="Ambiental vs Social" icon={<UserCheck className="h-4 w-4 text-blue-500" />} />
      </div>

      <ImmediateAttentionPanel data={passivosMock} />

      <div className="col-span-12 lg:col-span-3 space-y-4">
        <ManagementMaturityCard stats={stats} />
        <RecentEventsTimeline />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Distribuição de Exposição por Risco
              <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Info className="h-3 w-3 text-slate-400"/>
                    </TooltipTrigger>
                    <TooltipContent>
                        Percentual de passivos em cada faixa de risco
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4 h-12">
            <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-100">
              <div className="bg-red-500 w-[20%]" />
              <div className="bg-orange-400 w-[30%]" />
              <div className="bg-amber-300 w-[25%]" />
              <div className="bg-emerald-400 w-[25%]" />
            </div>
            <div className="flex gap-3 text-[10px] font-bold uppercase text-slate-500 whitespace-nowrap">
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 bg-red-500 rounded-full"/> Crítico</span>
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 bg-orange-400 rounded-full"/> Alto</span>
            </div>
          </CardContent>
        </Card>

        {stats.semPlano > 0 && (
          <Alert variant="destructive" className="bg-white border-red-200">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Atenção Gestor</AlertTitle>
            <AlertDescription className="text-xs">
              Existem {stats.semPlano} passivos críticos sem plano de ação definido. Isso aumenta a vulnerabilidade em auditorias.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}