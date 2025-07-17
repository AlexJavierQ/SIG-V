"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeProvider";
import React from "react"; // Importamos React para usar React.ReactNode

interface ChartProps {
  data: { channel: string; nuevosUsuarios: number; cac: number }[];
}

export default function AcquisitionChannelChart({ data }: ChartProps) {
  const { isDarkMode } = useTheme();
  const tickColor = isDarkMode ? "#94a3b8" : "#374151";

  return (
    <Card
      title="Rendimiento de Canales de Adquisición"
      tooltipText="Compara el volumen de nuevos usuarios contra el costo de adquisición (CAC) por canal."
    >
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 30, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <XAxis
              dataKey="channel"
              tick={{ fill: tickColor }}
              className="text-xs"
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#8884d8"
              tick={{ fill: tickColor }}
              className="text-xs"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#82ca9d"
              unit="$"
              tick={{ fill: tickColor }}
              className="text-xs"
            />
            <Tooltip
              contentStyle={
                isDarkMode
                  ? {
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                    }
                  : {}
              }
              labelStyle={isDarkMode ? { color: "#e2e8f0" } : {}}
            />
            <Legend wrapperStyle={isDarkMode ? { color: "#94a3b8" } : {}} />
            <Bar
              yAxisId="left"
              dataKey="nuevosUsuarios"
              name="Nuevos Usuarios"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
            >
              {/* --- CORRECCIÓN AQUÍ --- */}
              <LabelList
                dataKey="nuevosUsuarios"
                position="top"
                formatter={(label: React.ReactNode) =>
                  typeof label === "number" ? label.toLocaleString() : label
                }
                className="fill-slate-600 dark:fill-slate-300 text-xs"
              />
            </Bar>
            <Bar
              yAxisId="right"
              dataKey="cac"
              name="CAC"
              fill="#82ca9d"
              radius={[4, 4, 0, 0]}
            >
              {/* --- Y TAMBIÉN AQUÍ --- */}
              <LabelList
                dataKey="cac"
                position="top"
                formatter={(label: React.ReactNode) =>
                  typeof label === "number" ? `$${label.toFixed(2)}` : label
                }
                className="fill-slate-600 dark:fill-slate-300 text-xs"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
