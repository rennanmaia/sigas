import { useCallback, useMemo } from "react";
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
import { getRouteApi } from "@tanstack/react-router";
import { PassiveView } from "@/routes/_authenticated/passives";

const route = getRouteApi('/_authenticated/passives/');
export function PassivesOverview() {
  const navigate = route.useNavigate();

  const goToCritical = useCallback(() => navigate({ search: (prev) => ({ ...prev, view: PassiveView.CRITICAL }) }), [])
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

    const altos = passivosMock.filter(p => p.risco === 'Alto').length;
    const medios = passivosMock.filter(p => p.risco === 'Médio').length;
    const baixos = passivosMock.filter(p => p.risco === 'Baixo').length;

    const pctCritico = (criticos / total) * 100;
    const pctAlto = (altos / total) * 100;
    const pctMedio = (medios / total) * 100;
    const pctBaixo = (baixos / total) * 100;

    return { 
      total, 
      criticos, 
      semPlano, 
      atrasados, 
      ambiental, 
      social: total - ambiental, 
      comPlano,
      comEvidencias,
      comResponsavel,
      distribuicao: {
        critico: pctCritico,
        alto: pctAlto,
        medio: pctMedio,
        baixo: pctBaixo
      }
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
          onReview={() => {
            goToCritical()
          }}
        />
        <SummaryCard title="Sem Plano de Ação" value={stats.semPlano} sub="Requer atenção imediata" icon={<AlertTriangle className="h-4 w-4 text-orange-500" />} />
        <SummaryCard title="Planos em Atraso" value={stats.atrasados} sub="Gargalo operacional" icon={<Calendar className="h-4 w-4 text-red-500" />} />
        <SummaryCard title="Distribuição" value={`${stats.ambiental}/${stats.social}`} sub="Ambiental vs Social" icon={<UserCheck className="h-4 w-4 text-blue-500" />} />
      </div>

      <ImmediateAttentionPanel data={passivosMock} />

      <div className="col-span-12 lg:col-span-3 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">

        <ManagementMaturityCard stats={stats} />
        <RecentEventsTimeline />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                Distribuição de Exposição por Risco
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><Info className="h-3 w-3 text-slate-400"/></TooltipTrigger>
                    <TooltipContent>Representação proporcional do nível de criticidade da carteira atual.</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-[10px] text-slate-400 font-normal">TOTAL: {stats.total} ITENS</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {/* Barra Empilhada Dinâmica */}
            <div className="flex h-6 w-full rounded-md overflow-hidden bg-slate-100 shadow-inner border border-slate-200">
              <TooltipProvider>
                {/* Segmento Crítico */}
                <Tooltip>
                  <TooltipTrigger style={{ width: `${stats.distribuicao.critico}%` }} className="bg-red-500 h-full transition-all hover:brightness-110" />
                  <TooltipContent>Crítico: {stats.distribuicao.critico.toFixed(1)}%</TooltipContent>
                </Tooltip>

                {/* Segmento Alto */}
                <Tooltip>
                  <TooltipTrigger style={{ width: `${stats.distribuicao.alto}%` }} className="bg-orange-400 h-full transition-all hover:brightness-110" />
                  <TooltipContent>Alto: {stats.distribuicao.alto.toFixed(1)}%</TooltipContent>
                </Tooltip>

                {/* Segmento Médio */}
                <Tooltip>
                  <TooltipTrigger style={{ width: `${stats.distribuicao.medio}%` }} className="bg-amber-300 h-full transition-all hover:brightness-110" />
                  <TooltipContent>Médio: {stats.distribuicao.medio.toFixed(1)}%</TooltipContent>
                </Tooltip>

                {/* Segmento Baixo */}
                <Tooltip>
                  <TooltipTrigger style={{ width: `${stats.distribuicao.baixo}%` }} className="bg-emerald-400 h-full transition-all hover:brightness-110" />
                  <TooltipContent>Baixo: {stats.distribuicao.baixo.toFixed(1)}%</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Legenda com Valores Reais */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
              <LegendItem color="bg-red-500" label="Crítico" pct={stats.distribuicao.critico} />
              <LegendItem color="bg-orange-400" label="Alto" pct={stats.distribuicao.alto} />
              <LegendItem color="bg-amber-300" label="Médio" pct={stats.distribuicao.medio} />
              <LegendItem color="bg-emerald-400" label="Baixo" pct={stats.distribuicao.baixo} />
            </div>
          </CardContent>
        </Card>

        {stats.semPlano > 0 && (
          <Alert variant="destructive" className="bg-white border-red-200">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription className="text-xs">
              Existem {stats.semPlano} passivos sem plano de ação definido. Isso aumenta a vulnerabilidade em auditorias.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

function LegendItem({ color, label, pct }: { color: string, label: string, pct: number }) {
  if (pct === 0) return null; // Não mostra se não houver itens desse risco
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-[10px] font-bold text-slate-600 uppercase whitespace-nowrap">
        {label} <span className="text-slate-400 font-normal ml-1">{pct.toFixed(0)}%</span>
      </span>
    </div>
  );
}