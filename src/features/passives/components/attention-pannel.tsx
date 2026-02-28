import { AlertCircle } from "lucide-react";
import type { Liability } from "../data/schema";
import { PassiveCard } from "./passives-card";

export function ImmediateAttentionPanel({ data }: { data: Liability[] }) {

  const urgentes = data
    .filter(p => p.risco === 'Crítico' && (p.statusPlano === 'Não Definido' || p.statusPlano === 'Atrasado'));

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-red-500" /> ATENÇÃO IMEDIATA
      </h3>
      <p className="text-slate-500 text-sm">{urgentes.length} Passivos críticos sem plano de ação ou em atraso.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {urgentes.slice(0, 3).map(item => (
          <PassiveCard key={`attention-card-${item.id}`} item={item} goToDetails={(id) => {console.log(id)}}/>
        ))}
      </div>
    </div>
  );
}