import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Passivo } from "../data/schema";
import { CheckCircle2, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PassiveCard({
    item,
    goToResolve,
    goToDetails
}: {
    item: Passivo;
    goToResolve?: (id: string) => void;
    goToDetails?: (id: string) => void;
}) {
    return (
        <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border-none shadow-sm transition-all duration-300 group">
            <CardHeader className="pb-2 flex flex-row justify-between items-start space-y-0">
                <div className="space-y-1">
                <h3 className="font-bold text-sm leading-tight line-clamp-2">{item.nome}</h3>
                </div>
                <div className="flex justify-between items-start mb-2">
                    <Badge className="border-none bg-red-100 text-red-700 hover:bg-red-100">{item.risco}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1"><User size={12}/> {item.responsavel || 'Sem dono'}</span>
                <span className="flex items-center gap-1"><Clock size={12}/> {item.dataIdentificacao}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded text-[11px] text-slate-500 italic">
                <strong>Próxima Ação:</strong> {item.proximaAcao || 'Definir plano de mitigação'}
                </div>
            </CardContent>
            <CardFooter className="mt-auto flex gap-2">
                <div className="absolute flex justify-center gap-2 inset-x-0 bottom-0 p-2 translate-y-full transition-transform duration-300 group-hover:translate-y-0 bg-gradient-to-t from-white/80 to-transparent">
          
                {goToResolve && (
                    <Button 
                        className="flex-1 h-8 text-xs gap-2"
                        onClick={() => goToResolve(item.id)}
                    >
                        <CheckCircle2 size={14} /> Resolver
                    </Button>
                )}
                {goToDetails && (
                    <Button onClick={() => goToDetails(item.id)} variant="outline" className="h-8 text-xs">
                        Detalhes
                    </Button>
                )}   
                </div>
            </CardFooter>
        </Card>
    )
}