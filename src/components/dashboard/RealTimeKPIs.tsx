"use client";

import React from 'react';
import { Activity, TrendingUp, Users, Star, Gauge, Clock } from 'lucide-react';
import MetricCard from '@/components/ui/MetricCard';
import DataContainer from '@/components/ui/DataContainer';
import { AVAILABLE_TABLES } from '@/lib/api-service';

interface KPIData {
    title: string;
    value: number;
    trend: number;
    format: "currency" | "number" | "percentage" | "rating";
    icon?: React.ComponentType<any>;
}

// Función para procesar datos del endpoint y calcular KPIs
function processDataToKPIs(data: any[], tabla: string): KPIData[] {
    if (!data || data.length === 0) {
        return [];
    }

    // Los datos vienen como array de arrays: [fecha, pais, ciudad, aplicativo, valor1, valor2, ...]
    const totalRecords = data.length;
    const latestRecord = data[0]; // El primer registro es el más reciente
    const previousRecord = data[1] || latestRecord; // Para calcular tendencias

    // Función para calcular tendencia entre dos valores
    const calculateTrend = (current: number, previous: number): number => {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    };

    // Función para obtener valor seguro de un array
    const getValue = (record: any[], index: number): number => {
        return parseFloat(record[index]) || 0;
    };

    // Procesar según el tipo de tabla - basado en la estructura de datos real
    switch (tabla) {
        case 'marketing':
            // Estructura esperada: [fecha, pais, ciudad, aplicativo, usuarios_activos, nuevos_usuarios, campanas, ctr, conversion, costo_adq, valor_vida, ...]
            return [
                {
                    title: "Usuarios Activos",
                    value: getValue(latestRecord, 4),
                    trend: calculateTrend(getValue(latestRecord, 4), getValue(previousRecord, 4)),
                    format: "number" as const,
                    icon: Users
                },
                {
                    title: "Nuevos Usuarios",
                    value: getValue(latestRecord, 5),
                    trend: calculateTrend(getValue(latestRecord, 5), getValue(previousRecord, 5)),
                    format: "number" as const,
                    icon: TrendingUp
                },
                {
                    title: "Campañas Activas",
                    value: getValue(latestRecord, 6),
                    trend: calculateTrend(getValue(latestRecord, 6), getValue(previousRecord, 6)),
                    format: "number" as const,
                    icon: Activity
                },
                {
                    title: "CTR",
                    value: getValue(latestRecord, 7),
                    trend: calculateTrend(getValue(latestRecord, 7), getValue(previousRecord, 7)),
                    format: "number" as const,
                    icon: Gauge
                },
                {
                    title: "Conversión",
                    value: getValue(latestRecord, 8) * 100,
                    trend: calculateTrend(getValue(latestRecord, 8), getValue(previousRecord, 8)),
                    format: "percentage" as const,
                    icon: Clock
                },
                {
                    title: "Eficiencia",
                    value: getValue(latestRecord, 11) * 100,
                    trend: calculateTrend(getValue(latestRecord, 11), getValue(previousRecord, 11)),
                    format: "percentage" as const,
                    icon: Star
                }
            ];

        case 'finanzas':
            // Estructura para finanzas
            return [
                {
                    title: "Ingresos Totales",
                    value: getValue(latestRecord, 4),
                    trend: calculateTrend(getValue(latestRecord, 4), getValue(previousRecord, 4)),
                    format: "currency" as const,
                    icon: TrendingUp
                },
                {
                    title: "Transacciones",
                    value: getValue(latestRecord, 5),
                    trend: calculateTrend(getValue(latestRecord, 5), getValue(previousRecord, 5)),
                    format: "number" as const,
                    icon: Activity
                },
                {
                    title: "Ticket Promedio",
                    value: getValue(latestRecord, 6),
                    trend: calculateTrend(getValue(latestRecord, 6), getValue(previousRecord, 6)),
                    format: "currency" as const,
                    icon: Star
                },
                {
                    title: "Comisiones",
                    value: getValue(latestRecord, 7),
                    trend: calculateTrend(getValue(latestRecord, 7), getValue(previousRecord, 7)),
                    format: "currency" as const,
                    icon: Clock
                },
                {
                    title: "Margen",
                    value: getValue(latestRecord, 9) * 100,
                    trend: calculateTrend(getValue(latestRecord, 9), getValue(previousRecord, 9)),
                    format: "percentage" as const,
                    icon: Gauge
                },
                {
                    title: "ROI",
                    value: getValue(latestRecord, 10) * 100,
                    trend: calculateTrend(getValue(latestRecord, 10), getValue(previousRecord, 10)),
                    format: "percentage" as const,
                    icon: Users
                }
            ];

        case 'df_operativos_prueba':
            return [
                {
                    title: "Operaciones",
                    value: getValue(latestRecord, 4),
                    trend: calculateTrend(getValue(latestRecord, 4), getValue(previousRecord, 4)),
                    format: "number" as const,
                    icon: Activity
                },
                {
                    title: "Completadas",
                    value: getValue(latestRecord, 5),
                    trend: calculateTrend(getValue(latestRecord, 5), getValue(previousRecord, 5)),
                    format: "number" as const,
                    icon: TrendingUp
                },
                {
                    title: "Canceladas",
                    value: getValue(latestRecord, 6),
                    trend: calculateTrend(getValue(latestRecord, 6), getValue(previousRecord, 6)),
                    format: "number" as const,
                    icon: Clock
                },
                {
                    title: "Tiempo Promedio",
                    value: getValue(latestRecord, 7),
                    trend: calculateTrend(getValue(latestRecord, 7), getValue(previousRecord, 7)),
                    format: "number" as const,
                    icon: Gauge
                },
                {
                    title: "Eficiencia",
                    value: getValue(latestRecord, 9) * 100,
                    trend: calculateTrend(getValue(latestRecord, 9), getValue(previousRecord, 9)),
                    format: "percentage" as const,
                    icon: Star
                },
                {
                    title: "Satisfacción",
                    value: getValue(latestRecord, 10),
                    trend: calculateTrend(getValue(latestRecord, 10), getValue(previousRecord, 10)),
                    format: "rating" as const,
                    icon: Users
                }
            ];

        case 'df_ventas_prueba':
            return [
                {
                    title: "Ventas Totales",
                    value: getValue(latestRecord, 4),
                    trend: calculateTrend(getValue(latestRecord, 4), getValue(previousRecord, 4)),
                    format: "currency" as const,
                    icon: TrendingUp
                },
                {
                    title: "Unidades",
                    value: getValue(latestRecord, 5),
                    trend: calculateTrend(getValue(latestRecord, 5), getValue(previousRecord, 5)),
                    format: "number" as const,
                    icon: Activity
                },
                {
                    title: "Precio Promedio",
                    value: getValue(latestRecord, 6),
                    trend: calculateTrend(getValue(latestRecord, 6), getValue(previousRecord, 6)),
                    format: "currency" as const,
                    icon: Star
                },
                {
                    title: "Descuentos",
                    value: getValue(latestRecord, 7),
                    trend: calculateTrend(getValue(latestRecord, 7), getValue(previousRecord, 7)),
                    format: "currency" as const,
                    icon: Clock
                },
                {
                    title: "Conversión",
                    value: getValue(latestRecord, 9) * 100,
                    trend: calculateTrend(getValue(latestRecord, 9), getValue(previousRecord, 9)),
                    format: "percentage" as const,
                    icon: Gauge
                },
                {
                    title: "Abandono",
                    value: getValue(latestRecord, 10) * 100,
                    trend: calculateTrend(getValue(latestRecord, 10), getValue(previousRecord, 10)),
                    format: "percentage" as const,
                    icon: Users
                }
            ];

        default:
            return [];
    }
}

interface RealTimeKPIsProps {
    tabla: string;
    onNavigate?: (path: string) => void;
    showDebugPanel?: boolean;
}

export default function RealTimeKPIs({
    tabla,
    onNavigate,
    showDebugPanel = false
}: RealTimeKPIsProps) {
    const handleCardClick = () => {
        if (onNavigate) {
            onNavigate("/clipp-executive");
        }
    };

    return (
        <DataContainer
            tabla={tabla}
            showDebugPanel={showDebugPanel}
            fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 animate-pulse">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>
                            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-20 mb-2"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                        </div>
                    ))}
                </div>
            }
        >
            {(data) => {
                const kpis = processDataToKPIs(data, tabla);

                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {kpis.map((kpi, index) => (
                            <MetricCard
                                key={index}
                                {...kpi}
                                onClick={handleCardClick}
                            />
                        ))}
                    </div>
                );
            }}
        </DataContainer>
    );
}

// Componente específico para datos de marketing
export function MarketingKPIs({ onNavigate, showDebugPanel }: { onNavigate?: (path: string) => void; showDebugPanel?: boolean }) {
    return (
        <RealTimeKPIs
            tabla={AVAILABLE_TABLES.MARKETING}
            onNavigate={onNavigate}
            showDebugPanel={showDebugPanel}
        />
    );
}

// Componente específico para datos de finanzas
export function FinanzasKPIs({ onNavigate, showDebugPanel }: { onNavigate?: (path: string) => void; showDebugPanel?: boolean }) {
    return (
        <RealTimeKPIs
            tabla={AVAILABLE_TABLES.FINANZAS}
            onNavigate={onNavigate}
            showDebugPanel={showDebugPanel}
        />
    );
}

// Componente específico para datos operativos
export function OperativosKPIs({ onNavigate, showDebugPanel }: { onNavigate?: (path: string) => void; showDebugPanel?: boolean }) {
    return (
        <RealTimeKPIs
            tabla={AVAILABLE_TABLES.OPERATIVOS}
            onNavigate={onNavigate}
            showDebugPanel={showDebugPanel}
        />
    );
}

// Componente específico para datos de ventas
export function VentasKPIs({ onNavigate, showDebugPanel }: { onNavigate?: (path: string) => void; showDebugPanel?: boolean }) {
    return (
        <RealTimeKPIs
            tabla={AVAILABLE_TABLES.VENTAS}
            onNavigate={onNavigate}
            showDebugPanel={showDebugPanel}
        />
    );
}