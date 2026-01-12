import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export function SummaryCard({ title, value, sub, icon, alert, onReview }: {
  title: string;
  value: number | string;
  sub: string;
  icon: React.ReactNode;
  alert?: boolean;
  onReview?: () => void;
}) {
  return (
      <Card className={`relative overflow-hidden border-none shadow-sm transition-all duration-300 group ${
      alert ? 'bg-red-50/50 hover:bg-red-100/80' : 'bg-white hover:bg-slate-50'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">{title}</CardTitle>
        <div className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p className="text-[10px] text-slate-400 mt-1 font-medium">{sub}</p>
        
        {/* Botão de Revisão que aparece no Hover */}
        <div className="absolute inset-x-0 bottom-0 p-2 translate-y-full transition-transform duration-300 group-hover:translate-y-0 bg-gradient-to-t from-white/80 to-transparent">
          {onReview && (
              <Button 
              variant={alert ? "destructive" : "secondary"} 
              size="sm" 
              className="w-full h-7 text-[10px] gap-2"
              onClick={onReview}
            >
              Revisar Itens <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}