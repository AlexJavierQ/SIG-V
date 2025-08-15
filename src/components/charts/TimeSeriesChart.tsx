"use client";

import { useState } from "react";
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
import ChartDetailOverlay from "@/components/ui/ChartDetailOverlay";

interface TimeSeriesChartProps {
  data: any[];
  title: string;
  metrics: string[];
}

export default function TimeSeriesChart({ data, title, metrics }: TimeSeriesChartProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const tickColor = "#94a3b8";
  const labelColor = "#cbd5e1";

  const insights = [
    `Tendencia general: ${data.length > 1 ?
      (data[data.length - 1]?.solicitudes > data[0]?.solicitudes ? 'Creciente' : 'Decreciente') : 'Estable'}`,
    `Mejor mes: ${data.reduce((max, item) =>
      (item.solicitudes > max.solicitudes ? item : max), data[0] || {})?.date || 'N/A'}`,
    `Eficiencia promedio: ${Math.round(data.reduce((sum, item) => sum + (item.eficiencia || 0), 0) / data.length)}%`
  ];

  const recommendations = [
    "Analizar los factores que contribuyen a los picos de demanda",
    "Implementar estrategias para mantener la eficiencia operativa",
    "Planificar recursos basándose en las tendencias históricas"
  ];

  return (
    <>
      <Card
        title={title}
        tooltipText="Evolución mensual de los indicadores clave de la operación."
        onClick={() => setShowOverlay(true)}
        className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fadeIn"
      >
        <div className="h-[400px]">
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
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--card-foreground))"
                }}
                labelStyle={{ color: "hsl(var(--card-foreground))" }}
              />
              <Legend wrapperStyle={{ color: "hsl(var(--card-foreground))" }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="solicitudes"
                name="Solicitudes"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4, fill: "#2563eb" }}
                activeDot={{ r: 8, fill: "#1d4ed8" }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="activos"
                name="Conductores Activos"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4, fill: "#10b981" }}
                activeDot={{ r: 8, fill: "#059669" }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="eficiencia"
                name="Eficiencia"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, fill: "#3b82f6" }}
                activeDot={{ r: 8, fill: "#2563eb" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <ChartDetailOverlay
        isOpen={showOverlay}
        onClose={() => setShowOverlay(false)}
        title={title}
        data={data}
        chartType="line"
        insights={insights}
        recommendations={recommendations}
      />
    </>
  );
}