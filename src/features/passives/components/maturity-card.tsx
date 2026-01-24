import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Info, ShieldAlert } from "lucide-react";
import type { PassiveStats } from "../data/schema";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ManagementMaturityCard({ stats }: { stats: PassiveStats }) {
  const score = Math.round(
    ((stats.comPlano / stats.total) * 0.4 + 
     (stats.comResponsavel / stats.total) * 0.3 + 
     (stats.comEvidencias / stats.total) * 0.3) * 100
  );

  return (
    <Card className="bg-indigo-900 text-white overflow-hidden relative">
      <div className="absolute right-[-20px] top-[-20px] opacity-10">
        <ShieldAlert size={120} />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-indigo-200 uppercase tracking-widest text-center">Maturidade da Gestão</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-6">
        <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <div className="text-5xl font-black mb-2 cursor-pointer">{score}</div>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-slate-900 text-slate-100 border-slate-800 max-w-[280px] p-4 shadow-xl">
                <div className="space-y-3">
                  <p className="font-bold text-sm border-b border-slate-700 pb-1">Cálculo de Governança ESG</p>
                  <p className="text-xs leading-relaxed text-slate-400">
                    O Score de Maturidade reflete a prontidão da carteira para auditorias, calculado via média ponderada:
                  </p>
                  <ul className="text-xs space-y-2">
                    <li className="flex justify-between font-medium">
                      <span>• Planos de Ação definidos:</span>
                      <span className="text-indigo-400 font-bold">40%</span>
                    </li>
                    <li className="flex justify-between font-medium">
                      <span>• Responsáveis atribuídos:</span>
                      <span className="text-indigo-400 font-bold">30%</span>
                    </li>
                    <li className="flex justify-between font-medium">
                      <span>• Evidências documentadas:</span>
                      <span className="text-indigo-400 font-bold">30%</span>
                    </li>
                  </ul>
                  <p className="text-[10px] italic text-slate-500 pt-1 border-t border-slate-700">
                    * Dados atualizados em tempo real conforme preenchimento técnico.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        <Progress value={score} className="h-1.5 w-full bg-indigo-950" />
        <p className="text-[10px] text-indigo-300 mt-4 text-center">
          {score > 80 ? "GOVERNANÇA ALTA" : "NECESSITA ATENÇÃO EM EVIDÊNCIAS"}
        </p>
      </CardContent>
    </Card>
  );
}