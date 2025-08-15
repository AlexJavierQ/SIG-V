"use client";

import { useState } from "react";
import {
    LineChart,
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
import type { ProfitabilityData } from "@/lib/types";

interface ROIChartProps {
    data: ProfitabilityData[];
}

export default function ROIChart({ data }: ROIChartProps) {
    const [showOverlay, setShowOverlay] = useState(false);

    const insights = [
        `Mejor margen: ${Math.max(...data.map(d => d.margin)).toFixed(1)}%`,
        `Crecimiento promedio: ${(
            ((data[data.length - 1]?.profit || 0) - (data[0]?.profit || 0)) /
            (data[0]?.profit || 1) * 100
        ).toFixed(1)}%`,
        `Tendencia: ${data.length > 1 && data[data.length - 1]?.margin > data[0]?.margin ? 'Positiva' : 'Estable'}`
    ];

    const recommendations = [
        "Mantener la tendencia positiva de crecimiento de márgenes",
        "Optimizar costos operativos para mejorar la rentabilidad",
        "Diversificar fuentes de ingresos para reducir riesgos"
    ];

    return (
        <>
            <Card
                title="Análisis de Rentabilidad"
                tooltipText="Evolución de ingresos, costos y márgenes de rentabilidad"
                onClick={() => setShowOverlay(true)}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fadeIn"
            >
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                className="stroke-slate-200 dark:stroke-slate-700"
                            />
                            <XAxis
                                dataKey="period"
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
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #334155",
                                    borderRadius: "0.5rem",
                                }}
                                labelStyle={{ color: "#e2e8f0" }}
                                formatter={(value: number, name: string) => {
                                    if (name === "margin") {
                                        return [`${value.toFixed(1)}%`, "Margen"];
                                    }
                                    return [`$${(value / 1000).toFixed(0)}K`,
                                    name === "revenue" ? "Ingresos" :
                                        name === "costs" ? "Costos" : "Utilidad"];
                                }}
                            />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="revenue"
                                name="Ingresos"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="costs"
                                name="Costos"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="profit"
                                name="Utilidad"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="margin"
                                name="Margen %"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <ChartDetailOverlay
                isOpen={showOverlay}
                onClose={() => setShowOverlay(false)}
                title="Análisis de Rentabilidad - Detalle"
                data={data}
                chartType="line"
                insights={insights}
                recommendations={recommendations}
            />
        </>
    );
}