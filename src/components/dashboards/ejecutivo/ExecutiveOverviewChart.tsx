"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/ui/Card';
import type { StrategicTrendData } from '@/lib/types';

interface ExecutiveOverviewChartProps {
    data: StrategicTrendData[];
}

export default function ExecutiveOverviewChart({ data }: ExecutiveOverviewChartProps) {
    return (
        <Card className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-2">
                    Tendencias Estratégicas
                </h3>
                <p className="text-sm text-slate-400">
                    Evolución de métricas clave del negocio
                </p>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="date"
                            stroke="#9CA3AF"
                            fontSize={12}
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
                                name === 'revenue' ? 'Ingresos' :
                                    name === 'users' ? 'Usuarios' :
                                        name === 'efficiency' ? 'Eficiencia' :
                                            name === 'satisfaction' ? 'Satisfacción' : name
                            ]}
                        />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#10B981"
                            strokeWidth={2}
                            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="users"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="efficiency"
                            stroke="#F59E0B"
                            strokeWidth={2}
                            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="satisfaction"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-300">Ingresos</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-300">Usuarios</span>
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