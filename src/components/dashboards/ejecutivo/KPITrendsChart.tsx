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
import type { StrategicTrendData } from "@/lib/types";

interface KPITrendsChartProps {
    data: StrategicTrendData[];
}

export default function KPITrendsChart({ data }: KPITrendsChartProps) {
    const [showOverlay, setShowOverlay] = useState(false);

    const insights = [
        `Crecimiento de usuarios: ${(
            ((data[data.length - 1]?.users || 0) - (data[0]?.users || 0)) /
            (data[0]?.users || 1) * 100
        ).toFixed(1)}%`,
        `Mejora en eficiencia: ${(
            (data[data.length - 1]?.efficiency || 0) - (data[0]?.efficiency || 0)
        ).toFixed(1)} puntos`,
        `Satisfacción actual: ${data[data.length - 1]?.satisfaction || 0}/5.0`
    ];

    const recommendations = [
        "Mantener el crecimiento sostenido de usuarios activos",
        "Continuar mejorando la eficiencia operativa",
        "Implementar programas para aumentar la satisfacción del cliente"
    ];

    return (
        <>
            <Card
                title="Tendencias Estratégicas"
                tooltipText="Evolución de KPIs críticos para el crecimiento del negocio"
                onClick={() => setShowOverlay(true)}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fadeIn"
            >
                <div className="h-[400px]">
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
                                dataKey="date"
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
                                    switch (name) {
                                        case "revenue":
                                            return [`$${(value / 1000).toFixed(0)}K`, "Ingresos"];
                                        case "users":
                                            return [`${(value / 1000).toFixed(1)}K`, "Usuarios"];
                                        case "efficiency":
                                            return [`${value.toFixed(1)}%`, "Eficiencia"];
                                        case "satisfaction":
                                            return [`${value.toFixed(1)}/5.0`, "Satisfacción"];
                                        default:
                                            return [value, name];
                                    }
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
                                dataKey="users"
                                name="Usuarios"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="efficiency"
                                name="Eficiencia"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="satisfaction"
                                name="Satisfacción"
                                stroke="#8b5cf6"
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
                title="Tendencias Estratégicas - Análisis Completo"
                data={data}
                chartType="line"
                insights={insights}
                recommendations={recommendations}
            />
        </>
    );
}