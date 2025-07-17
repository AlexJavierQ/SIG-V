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
  LabelList,
} from "recharts";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeProvider";
import React from "react"; // Importamos React para usar React.ReactNode

interface ChartProps {
  retencion7dias: number;
  retencion30dias: number;
}

export default function RetentionBarChart({
  retencion7dias,
  retencion30dias,
}: ChartProps) {
  const { isDarkMode } = useTheme();
  const tickColor = isDarkMode ? "#94a3b8" : "#374151";

  const data = [
    { name: "Retención 7 Días", porcentaje: retencion7dias, color: "#34d399" },
    {
      name: "Retención 30 Días",
      porcentaje: retencion30dias,
      color: "#fbbf24",
    },
  ];

  return (
    <Card
      title="Comparativa de Retención"
      tooltipText="Porcentaje de nuevos usuarios que regresan después de 7 y 30 días."
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
              dataKey="name"
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
            <Bar dataKey="porcentaje" radius={[4, 4, 0, 0]}>
              {/* --- CORRECCIÓN AQUÍ --- */}
              <LabelList
                dataKey="porcentaje"
                position="top"
                formatter={(label: React.ReactNode) =>
                  typeof label === "number" ? `${label}%` : label
                }
                className="text-sm font-semibold fill-slate-700 dark:fill-slate-300"
              />
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
