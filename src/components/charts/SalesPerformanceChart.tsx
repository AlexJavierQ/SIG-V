"use client";

import React from 'react';
import { ShoppingCart, TrendingUp } from 'lucide-react';

export default function SalesPerformanceChart() {
    // Datos simulados para rendimiento de ventas
    const salesData = [
        { period: 'Ene', sales: 145000, target: 140000, units: 2340, conversion: 3.2 },
        { period: 'Feb', sales: 162000, target: 150000, units: 2580, conversion: 3.5 },
        { period: 'Mar', sales: 178000, target: 165000, units: 2890, conversion: 3.8 },
        { period: 'Abr', sales: 195000, target: 180000, units: 3120, conversion: 4.1 },
        { period: 'May', sales: 210000, target: 195000, units: 3350, conversion: 4.3 },
        { period: 'Jun', sales: 225000, target: 210000, units: 3580, conversion: 4.6 },
    ];

    const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
    const totalUnits = salesData.reduce((sum, item) => sum + item.units, 0);
    const avgConversion = salesData.reduce((sum, item) => sum + item.conversion, 0) / salesData.length;
    const maxValue = Math.max(...salesData.map(d => Math.max(d.sales, d.target)));

    return (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-orange-400" />
                        Rendimiento de Ventas
                    </h3>
                    <p className="text-slate-400 text-sm">Evolución mensual vs objetivos</p>
                </div>
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">+24.5%</span>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                {salesData.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-medium">{item.period}</span>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-slate-400">
                                    Meta: ${(item.target / 1000).toFixed(0)}K
                                </span>
                                <span className="text-orange-400 font-semibold">
                                    ${(item.sales / 1000).toFixed(0)}K
                                </span>
                                <span className="text-blue-400 text-xs">
                                    {item.conversion}% conv.
                                </span>
                            </div>
                        </div>

                        <div className="relative">
                            {/* Barra de ventas */}
                            <div className="w-full bg-slate-700 rounded-full h-3 mb-1">
                                <div
                                    className="bg-orange-400 h-3 rounded-full transition-all duration-1000"
                                    style={{ width: `${(item.sales / maxValue) * 100}%` }}
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
                                    {item.units.toLocaleString()} unidades
                                </span>
                                <span className="text-slate-400">
                                    Ticket: ${(item.sales / item.units).toFixed(0)}
                                </span>
                            </div>
                            <span className={`font-medium ${item.sales >= item.target ? 'text-green-400' : 'text-yellow-400'
                                }`}>
                                {item.sales >= item.target ? 'Objetivo cumplido' :
                                    `${(((item.sales - item.target) / item.target) * 100).toFixed(1)}%`}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Métricas de resumen */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400 mb-1">
                            ${(totalSales / 1000).toFixed(0)}K
                        </div>
                        <div className="text-slate-400 text-sm">Ventas Totales</div>
                        <div className="text-green-400 text-xs mt-1">
                            +{(((salesData[salesData.length - 1].sales - salesData[0].sales) / salesData[0].sales) * 100).toFixed(1)}% crecimiento
                        </div>
                    </div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-1">
                            {avgConversion.toFixed(1)}%
                        </div>
                        <div className="text-slate-400 text-sm">Conversión Promedio</div>
                        <div className="text-green-400 text-xs mt-1">
                            {totalUnits.toLocaleString()} unidades vendidas
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-600/50">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                        <div className="text-slate-400">Ticket Promedio</div>
                        <div className="text-emerald-400 font-semibold text-lg">
                            ${(totalSales / totalUnits).toFixed(0)}
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400">Objetivos Cumplidos</div>
                        <div className="text-green-400 font-semibold text-lg">
                            {salesData.filter(item => item.sales >= item.target).length}/6
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400">Mejor Mes</div>
                        <div className="text-purple-400 font-semibold text-lg">
                            {salesData.reduce((best, current) =>
                                current.sales > best.sales ? current : best
                            ).period}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                        <span>Ventas Reales</span>
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