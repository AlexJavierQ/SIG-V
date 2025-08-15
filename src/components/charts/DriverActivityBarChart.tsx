"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Card from "@/components/ui/Card";
import ChartDetailOverlay from "@/components/ui/ChartDetailOverlay";

interface DriverActivityBarChartProps {
  data: any[];
  title: string;
}

export default function DriverActivityBarChart({
  data,
  title,
}: DriverActivityBarChartProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const tickColor = "#94a3b8";

  // Transform data for the chart
  const chartData = data && data.length > 0 ? data : [
    { name: "00:00", activos: 45, atendieron: 32 },
    { name: "06:00", activos: 78, atendieron: 65 },
    { name: "12:00", activos: 125, atendieron: 102 },
    { name: "18:00", activos: 98, atendieron: 85 },
    { name: "23:00", activos: 56, atendieron: 41 },
  ];

  const insights = [
    `Hora pico: ${chartData.reduce((max, item) =>
      item.activos > max.activos ? item : max, chartData[0])?.name || 'N/A'}`,
    `Eficiencia promedio: ${Math.round(
      chartData.reduce((sum, item) => sum + (item.atendieron / item.activos * 100), 0) / chartData.length
    )}%`,
    `Total conductores únicos: ${Math.max(...chartData.map(item => item.activos))}`
  ];

  const recommendations = [
    "Optimizar la distribución de conductores en horas pico",
    "Implementar incentivos para mejorar la tasa de atención",
    "Analizar patrones de demanda para mejor planificación"
  ];

  return (
    <>
      <Card
        title={title}
        tooltipText="Actividad de conductores por franja horaria mostrando conductores activos vs que atendieron viajes"
        onClick={() => setShowOverlay(true)}
        className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fadeIn"
      >
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
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
                cursor={{ fill: "rgba(37, 99, 235, 0.1)" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--card-foreground))"
                }}
                labelStyle={{ color: "hsl(var(--card-foreground))" }}
                formatter={(value: number, name: string) => [
                  value.toLocaleString(),
                  name === "activos" ? "Activos" : "Atendieron",
                ]}
              />
              <Bar dataKey="activos" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="atendieron" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <ChartDetailOverlay
        isOpen={showOverlay}
        onClose={() => setShowOverlay(false)}
        title={title}
        data={chartData}
        chartType="bar"
        insights={insights}
        recommendations={recommendations}
      />
    </>
  );
}