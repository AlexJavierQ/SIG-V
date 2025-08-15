"use client";

import { useState } from "react";
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import Card from "@/components/ui/Card";
import ChartDetailOverlay from "@/components/ui/ChartDetailOverlay";

interface SummaryChartProps {
    data: any[];
    title: string;
    barKey: string;
    lineKey: string;
    barName: string;
    lineName: string;
}

export default function SummaryChart({
    data,
    title,
    barKey,
    lineKey,
    barName,
    lineName,
}: SummaryChartProps) {
    const [showOverlay, setShowOverlay] = useState(false);

    const insights = [
        `Tendencia ${lineName}: ${data.length > 1 ?
            (data[data.length - 1]?.[lineKey] > data[0]?.[lineKey] ? 'Creciente' : 'Decreciente') : 'Estable'}`,
        `Pico de ${barName}: ${Math.max(...data.map(d => d[barKey]))}`,
        `Promedio ${lineName}: ${(data.reduce((sum, item) => sum + (item[lineKey] || 0), 0) / data.length).toFixed(1)}`
    ];

    const recommendations = [
        "Analizar correlación entre métricas para optimizar rendimiento",
        "Identificar patrones estacionales para mejor planificación",
        "Implementar alertas automáticas para valores críticos"
    ];

    return (
        <>
            <Card
                title={title}
                tooltipText="Análisis combinado de métricas clave con tendencias"
                onClick={() => setShowOverlay(true)}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fadeIn"
            >
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                className="stroke-slate-200 dark:stroke-slate-700"
                            />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "#94a3b8" }}
                                className="text-xs"
                            />
                            <YAxis
                                yAxisId="left"
                                tick={{ fill: "#94a3b8" }}
                                className="text-xs"
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={{ fill: "#94a3b8" }}
                                className="text-xs"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "0.5rem",
                                    color: "hsl(var(--card-foreground))"
                                }}
                                labelStyle={{ color: "hsl(var(--card-foreground))" }}
                            />
                            <Legend />
                            <Bar
                                yAxisId="left"
                                dataKey={barKey}
                                name={barName}
                                fill="#2563eb"
                                radius={[4, 4, 0, 0]}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey={lineKey}
                                name={lineName}
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 5, fill: "#2563eb" }}
                                activeDot={{ r: 8, fill: "#1d4ed8" }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <ChartDetailOverlay
                isOpen={showOverlay}
                onClose={() => setShowOverlay(false)}
                title={`${title} - Análisis Detallado`}
                data={data}
                chartType="bar"
                insights={insights}
                recommendations={recommendations}
            />
        </>
    );
}