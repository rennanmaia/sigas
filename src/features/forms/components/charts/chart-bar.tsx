import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface ChartDataItem {
  label: string;
  value: number;
}

interface ChartBarDefaultProps {
  data: ChartDataItem[];
  textAnswers?: string[];
}

const chartConfig = {
  value: {
    label: "Respostas",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartBarDefault({
  data,
  textAnswers = [],
}: ChartBarDefaultProps) {
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
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="value" fill="var(--color-value)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
