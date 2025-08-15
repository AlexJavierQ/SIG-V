"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/ui/Card';

interface DriverData {
    name: string;
    viajes: number;
    cancelacion: number;
}

interface TopDriversChartProps {
    data: DriverData[];
}

export default function TopDriversChart({ data }: TopDriversChartProps) {
    // Ordenar conductores por número de viajes (descendente) y tomar los top 5
    const topDrivers = [...data]
        .sort((a, b) => b.viajes - a.viajes)
        .slice(0, 5)
        .map(driver => ({
            name: driver.name.split(' ')[0], // Solo el primer nombre para mejor visualización
            viajes: driver.viajes,
            fullName: driver.name
        }));

    return (
        <Card className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-2">
                    Top 5 Conductores por Viajes
                </h3>
                <p className="text-sm text-slate-400">
                    Conductores con mayor número de viajes completados
                </p>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={topDrivers}
                        layout="horizontal"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            type="number"
                            stroke="#9CA3AF"
                            fontSize={12}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            stroke="#9CA3AF"
                            fontSize={12}
                            width={80}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F3F4F6'
                            }}
                            formatter={(value: any, name: string, props: any) => [
                                `${value} viajes`,
                                props.payload.fullName
                            ]}
                            labelFormatter={() => ''}
                        />
                        <Bar
                            dataKey="viajes"
                            fill="#3B82F6"
                            radius={[0, 4, 4, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 text-center text-sm text-slate-400">
                Total de viajes: {topDrivers.reduce((sum, driver) => sum + driver.viajes, 0).toLocaleString()}
            </div>
        </Card>
    );
}