import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowRight } from "lucide-react";
import type { Passivo } from "../data/schema";
import { cn } from "@/lib/utils";

export function ImmediateAttentionPanel({ data }: { data: Passivo[] }) {
  const urgentes = data
    .filter(p => p.risco === 'Crítico' && (p.statusPlano === 'Não Definido' || p.statusPlano === 'Atrasado'))
    .slice(0, 3);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-red-500" /> ATENÇÃO IMEDIATA
      </h3>
      <p className="text-slate-500 text-sm">Passivos críticos sem plano de ação ou em atraso.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {urgentes.map(item => (
          <Card key={item.id} className={cn(
            "shadow-sm hover:shadow-md transition-shadow",
            // "border-l-4 border-l-red-500"
            )}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-[10px] uppercase">{item.codigo}</Badge>
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Crítico</Badge>
              </div>
              <p className="text-sm font-semibold truncate mb-3">{item.nome}</p>
              <div className="flex gap-2">
                {/* <Button size="sm" className="h-8 text-xs flex-1 bg-red-600 hover:bg-red-700">Criar Plano</Button> */}
                <Button size="sm" variant="outline" className="h-8 text-xs flex-1">Ver Detalhes</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}