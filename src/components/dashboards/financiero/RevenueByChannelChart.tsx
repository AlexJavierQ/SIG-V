"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeProvider";

interface ChartProps {
  data: { name: string; ingresos: number }[];
}

const COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc"];

export default function RevenueByChannelChart({ data }: ChartProps) {
  const { isDarkMode } = useTheme();
  const tickColor = isDarkMode ? "#94a3b8" : "#64748b";

  return (
    <Card
      title="Ingresos por Canal de Venta"
      tooltipText="Desglose de los ingresos totales según el canal de adquisición del viaje."
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 30 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <XAxis
              type="number"
              tick={{ fill: tickColor }}
              className="text-xs"
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: tickColor }}
              className="text-xs"
              width={100}
            />
            <Tooltip
              formatter={(value: number) => [
                `$${value.toLocaleString()}`,
                "Ingresos",
              ]}
              cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
              contentStyle={
                isDarkMode
                  ? { backgroundColor: "#1e293b", border: "1px solid #334155" }
                  : {}
              }
              labelStyle={isDarkMode ? { color: "#e2e8f0" } : {}}
            />
            <Bar dataKey="ingresos" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
