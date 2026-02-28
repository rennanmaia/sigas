import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useLiabilitiesStore } from "@/stores/passives-store";

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

export function PassivesChart() {
  const { liabilities } = useLiabilitiesStore();

  const data = useMemo(() => {
    const ambiental = new Array(12).fill(0);
    const social = new Array(12).fill(0);

    for (const l of liabilities) {
      const month = new Date(l.dataIdentificacao).getMonth();
      if (l.tipo === "Ambiental") {
        ambiental[month]++;
      } else {
        social[month]++;
      }
    }

    return months.map((name, i) => ({
      name,
      ambiental: ambiental[i],
      social: social[i],
    }));
  }, [liabilities]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
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
        <Area
          type="monotone"
          dataKey="ambiental"
          name="Ambiental"
          stroke="var(--primary)"
          fill="var(--primary)"
          fillOpacity={0.15}
        />
        <Area
          type="monotone"
          dataKey="social"
          name="Social"
          stroke="var(--chart-2)"
          fill="var(--chart-2)"
          fillOpacity={0.08}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
