import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import React from "react";

export function RecentEventsTimeline() {
  const events = [
    { id: 1, text: "Novo plano de ação: Vazamento Setor A", time: new Date(), icon: <CheckCircle2 className="text-emerald-500"/> },
    { id: 2, text: "Risco alterado para Crítico: Bacia Sul", time: new Date(Date.now() - 3600000), icon: <AlertTriangle className="text-red-500"/> },
  ];

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-[10px] font-bold text-slate-400 uppercase">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        {events.map(ev => (
          <div key={ev.id} className="flex gap-3 items-start">
            <div className="mt-1">{React.cloneElement(ev.icon as any, { size: 14 })}</div>
            <div className="flex flex-col">
              <span className="text-[11px] leading-tight text-slate-700 font-medium">{ev.text}</span>
              <span className="text-[9px] text-slate-400">{formatDistanceToNow(ev.time, { locale: ptBR, addSuffix: true })}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}