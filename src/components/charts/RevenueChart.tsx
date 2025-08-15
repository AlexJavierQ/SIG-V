"use client";

import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';

export default function RevenueChart() {
    // Datos simulados para ingresos
    const monthlyData = [
        { month: 'Ene', revenue: 180000, target: 175000, growth: 12.5 },
        { month: 'Feb', revenue: 195000, target: 185000, growth: 8.3 },
        { month: 'Mar', revenue: 210000, target: 200000, growth: 7.7 },
        { month: 'Abr', revenue: 225000, target: 215000, growth: 7.1 },
        { month: 'May', revenue: 240000, target: 230000, growth: 6.7 },
        { month: 'Jun', revenue: 255000, target: 245000, growth: 6.3 },
    ];

    const maxValue = Math.max(...monthlyData.map(d => Math.max(d.revenue, d.target)));
    const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
    const avgGrowth = monthlyData.reduce((sum, item) => sum + item.growth, 0) / monthlyData.length;

    return (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        Evolución de Ingresos
                    </h3>
                    <p className="text-slate-400 text-sm">Comparativa vs objetivos mensuales</p>
                </div>
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">+{avgGrowth.toFixed(1)}%</span>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                {monthlyData.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-medium">{item.month}</span>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-slate-400">
                                    Meta: ${(item.target / 1000).toFixed(0)}K
                                </span>
                                <span className="text-emerald-400 font-semibold">
                                    ${(item.revenue / 1000).toFixed(0)}K
                                </span>
                                <span className={`font-medium ${item.growth >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {item.growth >= 0 ? '+' : ''}{item.growth}%
                                </span>
                            </div>
                        </div>

                        <div className="relative">
                            {/* Barra de ingresos reales */}
                            <div className="w-full bg-slate-700 rounded-full h-3 mb-1">
                                <div
                                    className="bg-emerald-400 h-3 rounded-full transition-all duration-1000"
                                    style={{ width: `${(item.revenue / maxValue) * 100}%` }}
                                />
                            </div>
                            {/* Línea de objetivo */}
                            <div
                                className="absolute top-0 h-3 w-1 bg-blue-400 rounded-full"
                                style={{ left: `${(item.target / maxValue) * 100}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-4">
                                <span className="text-slate-400">
                                    Diferencia: ${((item.revenue - item.target) / 1000).toFixed(0)}K
                                </span>
                            </div>
                            <span className={`font-medium ${item.revenue >= item.target ? 'text-green-400' : 'text-yellow-400'
                                }`}>
                                {item.revenue >= item.target ? 'Objetivo cumplido' : 'Por debajo del objetivo'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-slate-600/50">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                        <div className="text-slate-400">Ingresos Totales</div>
                        <div className="text-emerald-400 font-semibold text-lg">
                            ${(totalRevenue / 1000).toFixed(0)}K
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400">Promedio Mensual</div>
                        <div className="text-blue-400 font-semibold text-lg">
                            ${(totalRevenue / monthlyData.length / 1000).toFixed(0)}K
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400">Crecimiento Promedio</div>
                        <div className="text-green-400 font-semibold text-lg">
                            +{avgGrowth.toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                        <span>Ingresos Reales</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-1 bg-blue-400 rounded-full"></div>
                        <span>Objetivo</span>
                    </div>
                </div>
                <span>Último semestre</span>
            </div>
        </div>
    );
}