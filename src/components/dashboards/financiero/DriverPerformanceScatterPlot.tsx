"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ZAxis,
} from "recharts";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeProvider";

interface ChartProps {
  data: { name: string; viajes: number; ingresos: number }[];
}

export default function DriverPerformanceScatterPlot({ data }: ChartProps) {
  const { isDarkMode } = useTheme();
  const tickColor = isDarkMode ? "#94a3b8" : "#64748b";

  return (
    <Card
      title="Rendimiento de Conductores"
      tooltipText="Relación entre los viajes realizados y los ingresos generados por cada conductor."
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <XAxis
              type="number"
              dataKey="viajes"
              name="Viajes"
              unit=" viajes"
              tick={{ fill: tickColor }}
              className="text-xs"
            />
            <YAxis
              type="number"
              dataKey="ingresos"
              name="Ingresos"
              unit="$"
              tickFormatter={(val) => `$${val}`}
              tick={{ fill: tickColor }}
              className="text-xs"
            />
            <ZAxis dataKey="name" name="Conductor" />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={
                isDarkMode
                  ? { backgroundColor: "#1e293b", border: "1px solid #334155" }
                  : {}
              }
            />
            <Scatter name="Conductores" data={data} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
