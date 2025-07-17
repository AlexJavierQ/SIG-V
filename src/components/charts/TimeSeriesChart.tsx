"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeProvider";

interface TimeSeriesChartProps {
  data: {
    date: string;
    solicitudes: number;
    activos: number;
    eficiencia: number;
  }[];
}

export default function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  // Hook para detectar el modo oscuro
  const { isDarkMode } = useTheme();
  const tickColor = isDarkMode ? "#94a3b8" : "#64748b"; // Color para el texto de los ejes
  const labelColor = isDarkMode ? "#cbd5e1" : "#475569"; // Color para las etiquetas de los ejes

  return (
    <Card
      title="Tendencia de KPIs Principales"
      tooltipText="Evolución mensual de los indicadores clave de la operación."
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
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
              yAxisId="left"
              tick={{ fill: tickColor }}
              className="text-xs"
            >
              <Label
                value="Cantidad"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle", fill: labelColor }}
              />
            </YAxis>
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: tickColor }}
              className="text-xs"
            >
              <Label
                value="Eficiencia (%)"
                angle={90}
                position="insideRight"
                style={{ textAnchor: "middle", fill: labelColor }}
              />
            </YAxis>
            <Tooltip
              contentStyle={
                isDarkMode
                  ? {
                      backgroundColor: "#1e293b", // Usamos backgroundColor en lugar de background
                      border: "1px solid #334155",
                      borderRadius: "0.5rem",
                    }
                  : {}
              }
              labelStyle={isDarkMode ? { color: "#e2e8f0" } : {}}
            />
            <Legend wrapperStyle={isDarkMode ? { color: "#e2e8f0" } : {}} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="solicitudes"
              name="Solicitudes"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="activos"
              name="Conductores Activos"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="eficiencia"
              name="Eficiencia"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
