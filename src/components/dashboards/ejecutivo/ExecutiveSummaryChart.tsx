"use client";

import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import Card from "@/components/ui/Card";
import ChartDetailOverlay from "@/components/ui/ChartDetailOverlay";
import type { BusinessMetric } from "@/lib/types";

interface ExecutiveSummaryChartProps {
    data: BusinessMetric[];
}

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

export default function ExecutiveSummaryChart({ data }: ExecutiveSummaryChartProps) {
    const [showOverlay, setShowOverlay] = useState(false);

    const chartData = data.map((metric, index) => ({
        name: metric.name,
        achievement: metric.achievement,
        value: metric.value,
        target: metric.target,
        color: COLORS[index % COLORS.length],
    }));

    const insights = [
        `Mejor métrica: ${data.reduce((max, item) =>
            item.achievement > max.achievement ? item : max, data[0])?.name || 'N/A'}`,
        `Promedio de cumplimiento: ${Math.round(
            data.reduce((sum, item) => sum + item.achievement, 0) / data.length
        )}%`,
        `Métricas sobre objetivo: ${data.filter(item => item.achievement >= 100).length}/${data.length}`
    ];

    const recommendations = [
        "Analizar las mejores prácticas de las métricas que superan el objetivo",
        "Implementar planes de mejora para métricas por debajo del 90%",
        "Revisar objetivos para asegurar que sean desafiantes pero alcanzables"
    ];

    return (
        <>
            <Card
                title="Métricas de Negocio"
                tooltipText="Cumplimiento de objetivos estratégicos del negocio"
                onClick={() => setShowOverlay(true)}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fadeIn"
            >
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                className="stroke-slate-200 dark:stroke-slate-700"
                            />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                tick={{ fill: "#94a3b8" }}
                                label={{ value: 'Cumplimiento (%)', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #334155",
                                    borderRadius: "0.5rem",
                                }}
                                labelStyle={{ color: "#e2e8f0" }}
                                formatter={(value: number, name: string) => [
                                    `${value.toFixed(1)}%`,
                                    name === "achievement" ? "Cumplimiento" : name,
                                ]}
                            />
                            <Bar dataKey="achievement" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <ChartDetailOverlay
                isOpen={showOverlay}
                onClose={() => setShowOverlay(false)}
                title="Métricas de Negocio - Análisis Detallado"
                data={chartData}
                chartType="bar"
                insights={insights}
                recommendations={recommendations}
            />
        </>
    );
}