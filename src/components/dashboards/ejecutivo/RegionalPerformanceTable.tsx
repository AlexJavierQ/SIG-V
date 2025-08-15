"use client";

import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';
import Card from '@/components/ui/Card';
import type { RegionalPerformanceData } from '@/lib/types';

interface RegionalPerformanceTableProps {
    data: RegionalPerformanceData[];
}

export default function RegionalPerformanceTable({ data }: RegionalPerformanceTableProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return value.toLocaleString('es-EC');
    };

    const formatPercentage = (value: number) => {
        return `${value.toFixed(1)}%`;
    };

    const getTrendIcon = (value: number) => {
        return value >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
        ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
        );
    };

    const getTrendColor = (value: number) => {
        return value >= 0 ? 'text-green-400' : 'text-red-400';
    };

    return (
        <Card className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-2">
                    Rendimiento por Región
                </h3>
                <p className="text-sm text-slate-400">
                    Análisis comparativo de métricas clave por mercado
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                                Región
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-slate-300">
                                <div className="flex items-center justify-end gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    Ingresos
                                </div>
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-slate-300">
                                <div className="flex items-center justify-end gap-2">
                                    <Users className="w-4 h-4" />
                                    Usuarios
                                </div>
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-slate-300">
                                Crecimiento
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-slate-300">
                                Market Share
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((region, index) => (
                            <tr
                                key={region.region}
                                className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                            >
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                                            <span className="text-sm font-semibold text-blue-400">
                                                {region.region.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-200">
                                                {region.region}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                Región #{index + 1}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="font-semibold text-slate-200">
                                        {formatCurrency(region.revenue)}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="font-semibold text-slate-200">
                                        {formatNumber(region.users)}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className={`flex items-center justify-end gap-1 font-semibold ${getTrendColor(region.growth)}`}>
                                        {getTrendIcon(region.growth)}
                                        {formatPercentage(Math.abs(region.growth))}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="font-semibold text-slate-200">
                                            {formatPercentage(region.marketShare)}
                                        </div>
                                        <div className="w-16 bg-slate-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min(region.marketShare, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data.length === 0 && (
                <div className="text-center py-8">
                    <div className="text-slate-400 mb-2">No hay datos disponibles</div>
                    <div className="text-sm text-slate-500">
                        Los datos regionales se mostrarán cuando estén disponibles
                    </div>
                </div>
            )}

            <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                <div>
                    Mostrando {data.length} regiones
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span>Crecimiento positivo</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <span>Crecimiento negativo</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}