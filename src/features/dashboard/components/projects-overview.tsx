import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { projects } from "@/features/projects/data/projects-mock";

const months = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export function ProjectsOverview() {
  const data = useMemo(() => {
    const criados = new Array(12).fill(0);
    const concluidos = new Array(12).fill(0);

    for (const p of projects) {
      const startMonth = new Date(p.startDate).getMonth();
      criados[startMonth]++;
      if (p.status === "finished") {
        const endMonth = new Date(p.endDate).getMonth();
        concluidos[endMonth]++;
      }
    }

    return months.map((name, i) => ({
      name,
      criados: criados[i],
      concluidos: concluidos[i],
    }));
  }, [projects]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="criados"
          name="Criados"
          fill="var(--primary)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="concluidos"
          name="Concluídos"
          fill="var(--chart-2)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
