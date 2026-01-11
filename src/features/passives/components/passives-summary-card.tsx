import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SummaryCard({ title, value, sub, icon, alert }: {
    title: string;
    value: number | string;
    sub: string;
    icon: React.ReactNode;
    alert?: boolean;
}) {
  return (
    <Card className={`border-none shadow-sm ${alert ? 'bg-red-50/50' : 'bg-white'}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p className="text-[10px] text-slate-400 mt-1 font-medium">{sub}</p>
      </CardContent>
    </Card>
  );
}