"use client";

import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

export default function OverviewChart() {
    // Datos simulados para el gráfico de resumen
    const data = [
        { month: 'Ene', value: 65, target: 70 },
        { month: 'Feb', value: 78, target: 75 },
        { month: 'Mar', value: 82, target: 80 },
        { month: 'Abr', value: 88, target: 85 },
        { month: 'May', value: 95, target: 90 },
        { month: 'Jun', value: 92, target: 95 },
    ];

    const maxValue = Math.max(...data.map(d => Math.max(d.value, d.target)));

    return (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-emerald-400" />
                        Rendimiento General
                    </h3>
                    <p className="text-slate-400 text-sm">Comparativa vs objetivos</p>
                </div>
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">+12.5%</span>
                </div>
            </div>

            <div className="space-y-4">
                {data.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300 font-medium">{item.month}</span>
                            <div className="flex items-center gap-4">
                                <span className="text-slate-400">Meta: {item.target}%</span>
                                <span className="text-emerald-400 font-semibold">{item.value}%</span>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="w-full bg-slate-700 rounded-full h-3">
                                <div
                                    className="bg-emerald-400 h-3 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                                />
                            </div>
                            <div
                                className="absolute top-0 h-3 w-1 bg-blue-400 rounded-full"
                                style={{ left: `${(item.target / maxValue) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-600/50">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                            <span className="text-slate-400">Actual</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-1 bg-blue-400 rounded-full"></div>
                            <span className="text-slate-400">Objetivo</span>
                        </div>
                    </div>
                    <span className="text-slate-400">Último semestre</span>
                </div>
            </div>
        </div>
    );
}