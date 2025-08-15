"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/ui/Card';

interface DriverData {
    name: string;
    viajes: number;
    cancelacion: number;
}

interface LowPerformanceDriversChartProps {
    data: DriverData[];
}

export default function LowPerformanceDriversChart({ data }: LowPerformanceDriversChartProps) {
    // Crear datos para los gráficos de bajo rendimiento
    const lowTripsDrivers = [...data]
        .sort((a, b) => a.viajes - b.viajes)
        .slice(0, 5)
        .map(driver => ({
            name: driver.name.split(' ')[0],
            viajes: driver.viajes,
            fullName: driver.name
        }));

    const lowRevenueDrivers = [...data]
        .map(driver => ({
            name: driver.name.split(' ')[0],
            ingresos: Math.floor(driver.viajes * (50 + Math.random() * 100)), // Simular ingresos
            fullName: driver.name
        }))
        .sort((a, b) => a.ingresos - b.ingresos)
        .slice(0, 5);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conductores con Menos Viajes */}
            <Card className="p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">
                        Conductores con Menos Viajes
                    </h3>
                    <p className="text-sm text-slate-400">
                        Conductores que requieren atención por bajo volumen
                    </p>
                </div>

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={lowTripsDrivers}
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
                                fill="#8B5CF6"
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 text-center text-sm text-slate-400">
                    Promedio: {Math.floor(lowTripsDrivers.reduce((sum, driver) => sum + driver.viajes, 0) / lowTripsDrivers.length)} viajes
                </div>
            </Card>

            {/* Conductores con Menos Ingresos */}
            <Card className="p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">
                        Conductores con Menos Ingresos
                    </h3>
                    <p className="text-sm text-slate-400">
                        Conductores con menor generación de ingresos
                    </p>
                </div>

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={lowRevenueDrivers}
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
                                    `$${value}`,
                                    props.payload.fullName
                                ]}
                                labelFormatter={() => ''}
                            />
                            <Bar
                                dataKey="ingresos"
                                fill="#8B5CF6"
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 text-center text-sm text-slate-400">
                    Promedio: ${Math.floor(lowRevenueDrivers.reduce((sum, driver) => sum + driver.ingresos, 0) / lowRevenueDrivers.length)}
                </div>
            </Card>
        </div>
    );
}