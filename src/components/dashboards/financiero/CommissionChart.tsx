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
} from "recharts";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeProvider";

interface ChartProps {
  data: { ciudad: string; regular: number; ejecutivo: number; vip: number }[];
}

export default function CommissionChart({ data }: ChartProps) {
  const { isDarkMode } = useTheme();
  const tickColor = isDarkMode ? "#94a3b8" : "#64748b";

  return (
    <Card
      title="% Comisiones por Ciudad y Segmento"
      tooltipText="Porcentaje de comisión que la plataforma cobra por cada tipo de servicio en diferentes ciudades."
    >
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <XAxis
              dataKey="ciudad"
              tick={{ fill: tickColor }}
              className="text-xs"
            />
            <YAxis unit="%" tick={{ fill: tickColor }} className="text-xs" />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Comisión"]}
              cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
              contentStyle={
                isDarkMode
                  ? { backgroundColor: "#1e293b", border: "1px solid #334155" }
                  : {}
              }
              labelStyle={isDarkMode ? { color: "#e2e8f0" } : {}}
            />
            <Legend wrapperStyle={isDarkMode ? { color: "#94a3b8" } : {}} />
            <Bar
              dataKey="regular"
              name="Regular"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="ejecutivo"
              name="Ejecutivo"
              fill="#82ca9d"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="vip"
              name="VIP"
              fill="#ffc658"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
