"use client";

import { useState } from "react";
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
import ChartDetailOverlay from "@/components/ui/ChartDetailOverlay";

import type { RankingData } from "@/lib/types";

interface RankingChartProps {
  data: RankingData[];
  title: string;
  dataKey: string;
  unit?: string;
  order?: "top" | "bottom";
}

// Paleta de colores para las barras - Blue theme
const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"];

export default function RankingChart({
  data,
  title,
  dataKey,
  unit = "",
  order = "top",
}: RankingChartProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const tickColor = "#94a3b8";

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

  const insights = [
    `El ${order === "top" ? "mejor" : "peor"} performer tiene ${sortedData[sortedData.length - 1]?.[dataKey]} ${unit}`,
    `Diferencia entre el ${order === "top" ? "mejor y peor" : "peor y mejor"}: ${Math.abs((sortedData[sortedData.length - 1]?.[dataKey] || 0) - (sortedData[0]?.[dataKey] || 0))} ${unit}`,
    `Promedio del grupo: ${Math.round(sortedData.reduce((sum, item) => sum + (item[dataKey] as number), 0) / sortedData.length)} ${unit}`
  ];

  const recommendations = [
    order === "top"
      ? "Analizar las mejores prácticas de los top performers para replicarlas"
      : "Implementar programas de mejora para los conductores con menor rendimiento",
    "Establecer metas individualizadas basadas en el rendimiento histórico",
    "Crear programas de incentivos para mejorar la motivación"
  ];

  return (
    <>
      <Card
        title={title}
        tooltipText={`Muestra los 5 conductores con ${order === "top" ? "mayor" : "menor"
          } rendimiento en ${dataKey}.`}
        onClick={() => setShowOverlay(true)}
        className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fadeIn"
      >
        <div className="h-[350px]">
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
                  value={`Total de ${unit || dataKey}`}
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
                cursor={{ fill: "rgba(37, 99, 235, 0.1)" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--card-foreground))"
                }}
                labelStyle={{ color: "hsl(var(--card-foreground))" }}
                formatter={(value: number) => [
                  `${unit === "$" ? "$" : ""}${value.toLocaleString()}${unit !== "$" && unit ? ` ${unit}` : ""
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

      <ChartDetailOverlay
        isOpen={showOverlay}
        onClose={() => setShowOverlay(false)}
        title={title}
        data={sortedData}
        chartType="bar"
        insights={insights}
        recommendations={recommendations}
      />
    </>
  );
}