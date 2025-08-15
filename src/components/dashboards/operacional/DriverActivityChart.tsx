"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/ui/Card';

interface DriverData {
    name: string;
    viajes: number;
    cancelacion: number;
}

interface DriverActivityChartProps {
    data: DriverData[];
}

export default function DriverActivityChart({ data }: DriverActivityChartProps) {
    // Simular datos de actividad por hora basados en los conductores
    const activityData = [
        { hora: '6:00', atendieron: Math.floor(data.length * 0.3), noAtendieron: Math.floor(data.length * 0.1) },
        { hora: '8:00', atendieron: Math.floor(data.length * 0.6), noAtendieron: Math.floor(data.length * 0.2) },
        { hora: '10:00', atendieron: Math.floor(data.length * 0.8), noAtendieron: Math.floor(data.length * 0.15) },
        { hora: '12:00', atendieron: Math.floor(data.length * 0.9), noAtendieron: Math.floor(data.length * 0.1) },
        { hora: '14:00', atendieron: Math.floor(data.length * 0.85), noAtendieron: Math.floor(data.length * 0.12) },
        { hora: '16:00', atendieron: Math.floor(data.length * 0.95), noAtendieron: Math.floor(data.length * 0.08) },
        { hora: '18:00', atendieron: Math.floor(data.length * 1.0), noAtendieron: Math.floor(data.length * 0.05) },
        { hora: '20:00', atendieron: Math.floor(data.length * 0.7), noAtendieron: Math.floor(data.length * 0.15) },
        { hora: '22:00', atendieron: Math.floor(data.length * 0.4), noAtendieron: Math.floor(data.length * 0.2) }
    ];

    return (
        <Card className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-2">
                    Actividad de Conductores
                </h3>
                <p className="text-sm text-slate-400">
                    Conductores que atendieron vs no atendieron por hora
                </p>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="hora"
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
                                value,
                                name === 'atendieron' ? 'Atendieron' : 'No Atendieron'
                            ]}
                        />
                        <Bar
                            dataKey="atendieron"
                            fill="#10B981"
                            radius={[4, 4, 0, 0]}
                            name="Atendieron"
                        />
                        <Bar
                            dataKey="noAtendieron"
                            fill="#F59E0B"
                            radius={[4, 4, 0, 0]}
                            name="No Atendieron"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-300">Atendieron</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-slate-300">No Atendieron</span>
                </div>
            </div>
        </Card>
    );
}