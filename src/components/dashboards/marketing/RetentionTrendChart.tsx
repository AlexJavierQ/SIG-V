"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeProvider";
import React from "react"; // Importamos React

interface ChartProps {
  data: { mes: string; retencion: number }[];
}

export default function RetentionTrendChart({ data }: ChartProps) {
  const { isDarkMode } = useTheme();
  const tickColor = isDarkMode ? "#94a3b8" : "#374151";

  return (
    <Card
      title="Tendencia de Retención a 7 Días"
      tooltipText="Evolución mensual del porcentaje de nuevos usuarios que regresan en su primera semana."
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 30, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-slate-300 dark:stroke-slate-700"
            />
            <XAxis
              dataKey="mes"
              tick={{ fill: tickColor }}
              className="text-sm font-medium"
            />
            <YAxis
              unit="%"
              tick={{ fill: tickColor }}
              className="text-sm font-medium"
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Retención"]}
              cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
              contentStyle={
                isDarkMode
                  ? { backgroundColor: "#1e293b", border: "1px solid #334155" }
                  : {}
              }
            />
            <Bar dataKey="retencion" fill="#22c55e" radius={[4, 4, 0, 0]}>
              {/* --- CORRECCIÓN AQUÍ --- */}
              <LabelList
                dataKey="retencion"
                position="top"
                formatter={(label: React.ReactNode) =>
                  typeof label === "number" ? `${label}%` : label
                }
                className="text-sm font-semibold fill-slate-700 dark:fill-slate-300"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
