"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '@/components/ui/Card';

interface DistributionData {
    exitosos: number;
    fallidos: number;
    percentage: number;
}

interface OperationalDistributionChartProps {
    data: DistributionData;
}

export default function OperationalDistributionChart({ data }: OperationalDistributionChartProps) {
    const chartData = [
        { name: 'Exitosos', value: data.exitosos, color: '#10B981' },
        { name: 'Fallidos', value: data.fallidos, color: '#EF4444' }
    ];

    const COLORS = ['#10B981', '#EF4444'];

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={14}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Card className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-2">
                    Distribución de Viajes
                </h3>
                <p className="text-sm text-slate-400">
                    Porcentaje de viajes exitosos vs fallidos
                </p>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F3F4F6'
                            }}
                            formatter={(value: any) => [value.toLocaleString(), 'Viajes']}
                        />
                        <Legend
                            wrapperStyle={{ color: '#F3F4F6' }}
                            formatter={(value, entry) => (
                                <span style={{ color: entry.color }}>{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                    {data.percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-slate-400">de Éxito</div>
            </div>
        </Card>
    );
}