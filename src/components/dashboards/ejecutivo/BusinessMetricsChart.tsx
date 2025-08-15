"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/ui/Card';
import type { BusinessMetric } from '@/lib/types';

interface BusinessMetricsChartProps {
    data: BusinessMetric[];
}

export default function BusinessMetricsChart({ data }: BusinessMetricsChartProps) {
    // Transformar datos para el gráfico
    const chartData = data.map(metric => ({
        name: metric.name,
        value: metric.value,
        target: metric.target,
        achievement: metric.achievement,
        category: metric.category
    }));

    const getBarColor = (category: string) => {
        switch (category) {
            case 'revenue': return '#10B981';
            case 'growth': return '#3B82F6';
            case 'efficiency': return '#F59E0B';
            case 'satisfaction': return '#8B5CF6';
            default: return '#6B7280';
        }
    };

    return (
        <Card className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-2">
                    Métricas de Negocio
                </h3>
                <p className="text-sm text-slate-400">
                    Rendimiento vs objetivos establecidos
                </p>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="name"
                            stroke="#9CA3AF"
                            fontSize={12}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F3F4F6'
                            }}
                            formatter={(value: any, name: string) => [
                                typeof value === 'number' ? value.toLocaleString() : value,
                                name === 'value' ? 'Valor Actual' :
                                    name === 'target' ? 'Objetivo' :
                                        name === 'achievement' ? 'Logro %' : name
                            ]}
                        />
                        <Bar
                            dataKey="value"
                            fill={(entry: any) => getBarColor(entry.category)}
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="target"
                            fill="#374151"
                            opacity={0.3}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-300">Ingresos</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-300">Crecimiento</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-slate-300">Eficiencia</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-300">Satisfacción</span>
                </div>
            </div>
        </Card>
    );
}