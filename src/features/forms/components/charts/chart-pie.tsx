import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ChartDataItem } from "./chart-bar";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface ChartPieLabelProps {
  data: ChartDataItem[];
  textAnswers?: string[];
}

export function ChartPieLabel({ data, textAnswers = [] }: ChartPieLabelProps) {
  if (!data.length && textAnswers.length) {
    return (
      <ul className="divide-y text-sm">
        {textAnswers.map((answer, i) => (
          <li key={i} className="py-2 px-1 text-foreground">
            {answer}
          </li>
        ))}
      </ul>
    );
  }

  if (!data.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Sem dados para exibir.
      </p>
    );
  }

  const chartConfig = Object.fromEntries(
    data.map((item, i) => [
      item.label,
      { label: item.label, color: COLORS[i % COLORS.length] },
    ]),
  ) satisfies ChartConfig;

  const chartData = data.map((item, i) => ({
    name: item.label,
    value: item.value,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto max-h-[300px] w-full [&_.recharts-pie-label-text]:fill-foreground"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={chartData} dataKey="value" nameKey="name" label>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  );
}
