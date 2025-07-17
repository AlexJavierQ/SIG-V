"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeProvider";

interface ChartProps {
  data: { date: string; promedio: number }[];
}

export default function AverageRevenueChart({ data }: ChartProps) {
  const { isDarkMode } = useTheme();
  const tickColor = isDarkMode ? "#94a3b8" : "#64748b";

  return (
    <Card
      title="Ingreso Promedio por Solicitud (Histórico)"
      tooltipText="Evolución del ingreso promedio generado por cada viaje atendido a lo largo del tiempo."
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIngreso" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              tick={{ fill: tickColor }}
              className="text-xs"
            />
            <Tooltip
              formatter={(value: number) => [
                `$${value.toFixed(2)}`,
                "Promedio",
              ]}
              contentStyle={
                isDarkMode
                  ? { backgroundColor: "#1e293b", border: "1px solid #334155" }
                  : {}
              }
            />
            <Area
              type="monotone"
              dataKey="promedio"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorIngreso)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
