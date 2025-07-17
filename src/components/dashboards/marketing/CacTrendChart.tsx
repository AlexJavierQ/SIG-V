"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeProvider";

interface ChartProps {
  data: { date: string; cac: number }[];
}

export default function CacTrendChart({ data }: ChartProps) {
  const { isDarkMode } = useTheme();
  const tickColor = isDarkMode ? "#94a3b8" : "#64748b";

  return (
    <Card
      title="Evolución del CAC"
      tooltipText="Muestra cómo ha variado el costo de adquisición promedio a lo largo del tiempo."
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <XAxis
              dataKey="date"
              tick={{ fill: tickColor }}
              className="text-xs"
            />
            <YAxis
              unit="$"
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              tick={{ fill: tickColor }}
              className="text-xs"
            />
            <Tooltip
              formatter={(value: number) => [
                `$${value.toFixed(2)}`,
                "CAC Promedio",
              ]}
              contentStyle={
                isDarkMode
                  ? { backgroundColor: "#1e293b", border: "1px solid #334155" }
                  : {}
              }
            />
            <Line
              type="monotone"
              dataKey="cac"
              stroke="#ef4444"
              strokeWidth={2.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
