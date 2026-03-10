import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ChartDataItem } from "./chart-bar";

interface ChartRadarProps {
  data: ChartDataItem[];
  textAnswers?: string[];
}

const chartConfig = {
  value: {
    label: "Respostas",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartRadar({ data, textAnswers = [] }: ChartRadarProps) {
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
    <ChartContainer
      config={chartConfig}
      className="mx-auto max-h-[300px] w-full"
    >
      <RadarChart data={data}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="label" />
        <PolarGrid />
        <Radar
          dataKey="value"
          fill="var(--color-value)"
          fillOpacity={0.6}
          dot={{ r: 4, fillOpacity: 1 }}
        />
      </RadarChart>
    </ChartContainer>
  );
}
