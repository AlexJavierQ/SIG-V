"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '@/components/ui/Card';

interface TrendData {
    mes: string;
    conductoresActivos: number;
    eficiencia: number;
    solicitudes: number;
}

interface HistoricalTrendsChartProps {
    data: TrendData[];
}

export default function HistoricalTrendsChart({ data }: HistoricalTrendsChartProps) {
    return (
        <Card className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-2">
                    Tendencia de KPIs Principales
                </h3>
                <p className="text-sm text-slate-400">
                    Evolución histórica de métricas operacionales clave
                </p>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="mes"
                            stroke="#9CA3AF"
                            fontSize={12}
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="#9CA3AF"
                            fontSize={12}
                            domain={['dataMin - 100', 'dataMax + 100']}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#9CA3AF"
                            fontSize={12}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F3F4F6'
                            }}
                            formatter={(value: any, name: string) => [
                                name === 'eficiencia' ? `${value}%` : value.toLocaleString(),
                                name === 'conductoresActivos' ? 'Conductores Activos' :
                                    name === 'eficiencia' ? 'Eficiencia' :
                                        name === 'solicitudes' ? 'Solicitudes' : name
                            ]}
                        />
                        <Legend
                            wrapperStyle={{ color: '#F3F4F6' }}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="conductoresActivos"
                            stroke="#10B981"
                            strokeWidth={3}
                            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                            name="Conductores Activos"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="eficiencia"
                            stroke="#F59E0B"
                            strokeWidth={3}
                            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
                            name="Eficiencia"
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="solicitudes"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                            name="Solicitudes"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                    <div className="text-lg font-semibold text-green-400">
                        {data[data.length - 1]?.conductoresActivos || 0}
                    </div>
                    <div className="text-slate-400">Conductores Activos</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-semibold text-yellow-400">
                        {data[data.length - 1]?.eficiencia || 0}%
                    </div>
                    <div className="text-slate-400">Eficiencia Actual</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-semibold text-blue-400">
                        {data[data.length - 1]?.solicitudes?.toLocaleString() || 0}
                    </div>
                    <div className="text-slate-400">Solicitudes</div>
                </div>
            </div>
        </Card>
    );
}