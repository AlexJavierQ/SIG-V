"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeProvider";

interface DriverActivityBarChartProps {
  activos: number;
  atendieron: number;
}

export default function DriverActivityBarChart({
  activos,
  atendieron,
}: DriverActivityBarChartProps) {
  const { isDarkMode } = useTheme();
  const tickColor = isDarkMode ? "#94a3b8" : "#64748b";

  const noAtendieron = activos - atendieron;

  const data = [
    { name: "Atendieron", conductores: atendieron, color: "#22c55e" },
    { name: "No Atendieron", conductores: noAtendieron, color: "#f59e0b" },
  ];

  return (
    <Card
      title="Actividad de Conductores"
      tooltipText={`Del total de ${activos} conductores activos, ${atendieron} atendieron viajes y ${noAtendieron} no lo hicieron.`}
    >
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: tickColor }}
              className="text-xs"
            />
            <YAxis tick={{ fill: tickColor }} className="text-xs" />
            <Tooltip
              cursor={{ fill: "rgba(240, 240, 240, 0.2)" }}
              contentStyle={
                isDarkMode
                  ? {
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "0.5rem",
                    }
                  : {}
              }
              labelStyle={isDarkMode ? { color: "#e2e8f0" } : {}}
              formatter={(value: number) => [
                value.toLocaleString(),
                "Conductores",
              ]}
            />
            <Bar dataKey="conductores" radius={[4, 4, 0, 0]}>
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
