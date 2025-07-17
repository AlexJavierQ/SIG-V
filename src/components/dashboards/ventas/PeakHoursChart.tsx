"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeProvider";

interface ChartProps {
  data: { hora: string; solicitudes: number }[];
}

export default function PeakHoursChart({ data }: ChartProps) {
  const { isDarkMode } = useTheme();
  const tickColor = isDarkMode ? "#94a3b8" : "#64748b";

  return (
    <Card
      title="Top Horas de Mayor Demanda"
      tooltipText="Horas del día con el mayor número de solicitudes de viaje."
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <XAxis
              dataKey="hora"
              tick={{ fill: tickColor }}
              className="text-xs"
            />
            <YAxis tick={{ fill: tickColor }} className="text-xs" />
            <Tooltip
              formatter={(value: number) => [
                value.toLocaleString(),
                "Solicitudes",
              ]}
              cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
              contentStyle={
                isDarkMode
                  ? { backgroundColor: "#1e293b", border: "1px solid #334155" }
                  : {}
              }
            />
            <Bar dataKey="solicitudes" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
