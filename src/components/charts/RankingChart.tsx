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
  Label,
} from "recharts";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeProvider";

// Interfaz genérica para que el gráfico acepte diferentes tipos de datos
export interface RankingData {
  name: string;
  [key: string]: string | number;
}

interface RankingChartProps {
  data: RankingData[];
  title: string;
  dataKey: string;
  unit: string;
  order?: "top" | "bottom"; // Prop para controlar el orden del ranking
}

// Paleta de colores para las barras
const COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];

export default function RankingChart({
  data,
  title,
  dataKey,
  unit,
  order = "top",
}: RankingChartProps) {
  const { isDarkMode } = useTheme();
  const tickColor = isDarkMode ? "#94a3b8" : "#64748b";
  const labelColor = isDarkMode ? "#cbd5e1" : "#475569";

  // Lógica de ordenamiento y filtrado para mostrar solo el Top/Bottom 5
  const sortedData = [...data]
    .sort((a, b) => {
      // Para 'top', ordenamos de mayor a menor. Para 'bottom', de menor a mayor.
      return order === "top"
        ? (b[dataKey] as number) - (a[dataKey] as number)
        : (a[dataKey] as number) - (b[dataKey] as number);
    })
    .slice(0, 5) // Tomamos solo los 5 primeros del array ya ordenado
    .reverse(); // Invertimos para que Recharts lo muestre con el valor más alto arriba

  return (
    <Card
      title={title}
      tooltipText={`Muestra los 5 conductores con ${
        order === "top" ? "mayor" : "menor"
      } rendimiento en ${dataKey}.`}
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <XAxis type="number" tick={{ fill: tickColor }} className="text-xs">
              <Label
                value={`Total de ${unit}`}
                offset={-15}
                position="insideBottom"
                className="fill-slate-600 dark:fill-slate-400"
              />
            </XAxis>
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              width={100}
              tick={{ fill: tickColor }}
              className="text-xs"
            />
            <Tooltip
              cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
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
                `${unit === "$" ? "$" : ""}${value.toLocaleString()}${
                  unit !== "$" ? ` ${unit}` : ""
                }`,
                "Total",
              ]}
            />
            <Bar dataKey={dataKey} radius={[0, 4, 4, 0]}>
              {sortedData.map((entry, index) => (
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
