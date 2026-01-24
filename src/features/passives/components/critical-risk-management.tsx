import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { passivosMock } from "../data/passives";
import { useCallback } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { PassiveCard } from "./passives-card";

interface CriticalRisksViewProps {
  onBack?: () => void;
}

const route = getRouteApi('/_authenticated/passives/')

export function CriticalRisksManagement({ onBack }: CriticalRisksViewProps) {
  const navigate = route.useNavigate()
  const goToResolve = useCallback((id: string) => navigate({ search: (prev) => ({ ...prev, /*view: PassiveView.RESOLVE,*/ selectedId: id }) }), []);
  const criticalItems = passivosMock.filter(i => i.risco === 'Crítico');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 text-slate-500">
            ← Voltar para Visão Geral
          </Button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="text-red-500 h-5 w-5" /> 
            Gestão de Riscos Críticos
          </h2>
          <p className="text-sm text-slate-500">Existem {criticalItems.length} passivos que exigem mitigação imediata.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {criticalItems.map((item) => (
          <PassiveCard key={`critial-items-${item.id}`} item={item} goToResolve={goToResolve} goToDetails={(id) => {console.log(id)}} />
        ))}
      </div>
    </div>
  );
}