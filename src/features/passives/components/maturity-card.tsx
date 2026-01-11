import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShieldAlert } from "lucide-react";
import type { PassiveStats } from "../data/schema";

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
        <div className="text-5xl font-black mb-2">{score}</div>
        <Progress value={score} className="h-1.5 w-full bg-indigo-950" />
        <p className="text-[10px] text-indigo-300 mt-4 text-center">
          {score > 80 ? "GOVERNANÇA ALTA" : "NECESSITA ATENÇÃO EM EVIDÊNCIAS"}
        </p>
      </CardContent>
    </Card>
  );
}