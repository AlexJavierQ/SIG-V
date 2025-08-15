"use client";

import React from 'react';
import { PieChart, TrendingUp } from 'lucide-react';

export default function ProfitabilityChart() {
    // Datos simulados para análisis de rentabilidad
    const profitData = [
        { category: 'Servicios Premium', profit: 85000, margin: 68.5, color: 'bg-emerald-400' },
        { category: 'Servicios Básicos', profit: 45000, margin: 35.2, color: 'bg-blue-400' },
        { category: 'Comisiones', profit: 32000, margin: 78.9, color: 'bg-purple-400' },
        { category: 'Suscripciones', profit: 28000, margin: 82.1, color: 'bg-orange-400' },
    ];

    const totalProfit = profitData.reduce((sum, item) => sum + item.profit, 0);
    const avgMargin = profitData.reduce((sum, item) => sum + item.margin, 0) / profitData.length;

    return (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-purple-400" />
                        Análisis de Rentabilidad
                    </h3>
                    <p className="text-slate-400 text-sm">Márgenes por categoría de servicio</p>
                </div>
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">{avgMargin.toFixed(1)}%</span>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                {profitData.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                <span className="text-slate-300 font-medium">{item.category}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-slate-400">
                                    {((item.profit / totalProfit) * 100).toFixed(1)}%
                                </span>
                                <span className="text-emerald-400 font-semibold">
                                    ${item.profit.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="w-full bg-slate-700 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-1000 ${item.color}`}
                                    style={{ width: `${(item.profit / Math.max(...profitData.map(d => d.profit))) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">
                                Margen: {item.margin}%
                            </span>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${item.margin >= 70 ? 'bg-green-500/20 text-green-400' :
                                    item.margin >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                }`}>
                                {item.margin >= 70 ? 'Excelente' :
                                    item.margin >= 50 ? 'Bueno' : 'Mejorable'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Gráfico circular visual */}
            <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                            className="text-slate-700"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        {profitData.map((item, index) => {
                            const percentage = (item.profit / totalProfit) * 100;
                            const offset = profitData.slice(0, index).reduce((sum, prev) =>
                                sum + (prev.profit / totalProfit) * 100, 0
                            );
                            return (
                                <path
                                    key={index}
                                    className={`${index === 0 ? 'text-emerald-400' :
                                            index === 1 ? 'text-blue-400' :
                                                index === 2 ? 'text-purple-400' :
                                                    'text-orange-400'
                                        }`}
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="transparent"
                                    strokeDasharray={`${percentage}, 100`}
                                    strokeDashoffset={-offset}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-lg font-bold text-white">
                                ${(totalProfit / 1000).toFixed(0)}K
                            </div>
                            <div className="text-xs text-slate-400">Total</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-600/50">
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                        <div className="text-slate-400">Ganancia Total</div>
                        <div className="text-emerald-400 font-semibold text-lg">
                            ${totalProfit.toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400">Margen Promedio</div>
                        <div className="text-purple-400 font-semibold text-lg">
                            {avgMargin.toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}