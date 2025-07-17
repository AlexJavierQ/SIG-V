// src/components/charts/SolicitudesChart.tsx
"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme } from "@/contexts/ThemeProvider";

interface SolicitudesChartProps {
  exitosos: number;
  fallidos: number;
}

export default function SolicitudesChart({
  exitosos,
  fallidos,
}: SolicitudesChartProps) {
  const { isDarkMode } = useTheme();
  const data = [
    { name: "Exitosos", value: exitosos, color: "#22c55e" },
    { name: "Fallidos", value: fallidos, color: "#ef4444" },
  ];
  const total = exitosos + fallidos;
  const porcentajeExito = total > 0 ? Math.round((exitosos / total) * 100) : 0;

  return (
    // El componente ahora devuelve directamente el gráfico, sin el Card
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.color}
                stroke={isDarkMode ? "#0f172a" : "#fff"}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [value.toLocaleString(), "Viajes"]}
            contentStyle={
              isDarkMode
                ? { backgroundColor: "#1e293b", border: "1px solid #334155" }
                : {}
            }
            labelStyle={isDarkMode ? { color: "#e2e8f0" } : {}}
          />
          <Legend wrapperStyle={isDarkMode ? { color: "#94a3b8" } : {}} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {porcentajeExito}%
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            de Éxito
          </div>
        </div>
      </div>
    </div>
  );
}
