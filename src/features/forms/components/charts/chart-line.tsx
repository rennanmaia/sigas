import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ChartDataItem } from "./chart-bar";

interface ChartLineInteractiveProps {
  data: ChartDataItem[];
  textAnswers?: string[];
}

const chartConfig = {
  value: {
    label: "Respostas",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartLineInteractive({
  data,
  textAnswers = [],
}: ChartLineInteractiveProps) {
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

  return (
    <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
        />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="value"
          type="monotone"
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
