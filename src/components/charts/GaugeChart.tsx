"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import ChartDetailOverlay from "@/components/ui/ChartDetailOverlay";

interface GaugeChartProps {
    value: number;
    max?: number;
    title: string;
    subtitle?: string;
    color?: string;
    unit?: string;
}

export default function GaugeChart({
    value,
    max = 100,
    title,
    subtitle,
    color = "#3b82f6",
    unit = "%"
}: GaugeChartProps) {
    const [showOverlay, setShowOverlay] = useState(false);

    const percentage = Math.min((value / max) * 100, 100);
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (percentage >= 80) return "#10b981"; // green
        if (percentage >= 60) return "#3b82f6"; // blue (primary)
        if (percentage >= 40) return "#f59e0b"; // yellow
        return "#ef4444"; // red
    };

    const finalColor = color === "#3b82f6" ? getColor() : color;

    const insights = [
        `Rendimiento actual: ${percentage.toFixed(1)}%`,
        `Estado: ${percentage >= 80 ? 'Excelente' : percentage >= 60 ? 'Bueno' : percentage >= 40 ? 'Regular' : 'Crítico'}`,
        `Margen de mejora: ${(100 - percentage).toFixed(1)} puntos`
    ];

    const recommendations = [
        percentage < 60 ? "Implementar plan de mejora inmediato" : "Mantener el buen rendimiento",
        "Establecer metas incrementales para optimización continua",
        "Monitorear tendencias para detectar cambios tempranos"
    ];

    const mockData = [
        { name: "Valor Actual", value: value },
        { name: "Objetivo", value: max },
        { name: "Rendimiento", value: percentage }
    ];

    return (
        <>
            <Card
                title={title}
                tooltipText={`Medidor de rendimiento: ${value}${unit} de ${max}${unit}`}
                onClick={() => setShowOverlay(true)}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fadeIn"
            >
                <div className="flex flex-col items-center justify-center h-[300px] p-6">
                    {/* SVG Gauge */}
                    <div className="relative w-36 h-36 mb-4">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Background circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="6"
                                className="text-slate-200/60 dark:text-slate-600/60 transition-colors duration-300"
                            />
                            {/* Progress circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke={finalColor}
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-1000 ease-out"
                                style={{
                                    filter: `drop-shadow(0 0 8px ${finalColor}60)`
                                }}
                            />
                            {/* Subtle inner glow */}
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                stroke={finalColor}
                                strokeWidth="1"
                                opacity="0.3"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        {/* Center value */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div
                                className="text-3xl font-bold transition-colors duration-300"
                                style={{ color: finalColor }}
                            >
                                {value}{unit}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
                                de {max}{unit}
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full max-w-xs mb-4">
                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-2 transition-colors duration-300">
                            <span>0{unit}</span>
                            <span>{max}{unit}</span>
                        </div>
                        <div className="w-full bg-slate-200/80 dark:bg-slate-600/80 rounded-full h-2.5 shadow-inner transition-colors duration-300">
                            <div
                                className="h-2.5 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: finalColor,
                                    boxShadow: `0 0 12px ${finalColor}50`
                                }}
                            >
                                {/* Subtle shimmer effect */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
                                    style={{ animationDuration: '2s' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="text-center">
                        {subtitle && (
                            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                {subtitle}
                            </div>
                        )}
                        <div
                            className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold shadow-sm border transition-all duration-300 hover:scale-105"
                            style={{
                                backgroundColor: `${finalColor}15`,
                                color: finalColor,
                                borderColor: `${finalColor}30`
                            }}
                        >
                            {percentage >= 80 ? '🎯 Excelente' :
                                percentage >= 60 ? '✅ Bueno' :
                                    percentage >= 40 ? '⚠️ Regular' : '🚨 Crítico'}
                        </div>
                    </div>
                </div>
            </Card>

            <ChartDetailOverlay
                isOpen={showOverlay}
                onClose={() => setShowOverlay(false)}
                title={`${title} - Análisis de Rendimiento`}
                data={mockData}
                chartType="pie"
                insights={insights}
                recommendations={recommendations}
            />
        </>
    );
}