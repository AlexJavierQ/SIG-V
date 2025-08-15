"use client";

import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';

export default function OperationalEfficiencyChart() {
    // Datos simulados para eficiencia operacional
    const efficiencyData = [
        { process: 'Procesamiento de Pagos', current: 96.2, target: 95.0, trend: 2.1 },
        { process: 'Verificación de Usuarios', current: 94.8, target: 92.0, trend: 1.5 },
        { process: 'Soporte al Cliente', current: 89.3, target: 90.0, trend: -0.7 },
        { process: 'Mantenimiento Sistema', current: 92.1, target: 88.0, trend: 4.2 },
        { process: 'Gestión de Incidencias', current: 87.5, target: 85.0, trend: 2.8 },
    ];

    const avgEfficiency = efficiencyData.reduce((sum, item) => sum + item.current, 0) / efficiencyData.length;

    return (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        Eficiencia Operacional
                    </h3>
                    <p className="text-slate-400 text-sm">Rendimiento por proceso crítico</p>
                </div>
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">{avgEfficiency.toFixed(1)}%</span>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                {efficiencyData.map((item, index) => (
                    <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-medium">{item.process}</span>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-slate-400">
                                    Meta: {item.target}%
                                </span>
                                <span className={`font-semibold ${item.current >= item.target ? 'text-green-400' : 'text-yellow-400'
                                    }`}>
                                    {item.current}%
                                </span>
                                <span className={`font-medium text-xs ${item.trend >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {item.trend >= 0 ? '+' : ''}{item.trend}%
                                </span>
                            </div>
                        </div>

                        <div className="relative">
                            {/* Barra de progreso */}
                            <div className="w-full bg-slate-700 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-1000 ${item.current >= 95 ? 'bg-green-400' :
                                            item.current >= 90 ? 'bg-blue-400' :
                                                item.current >= 85 ? 'bg-yellow-400' :
                                                    'bg-red-400'
                                        }`}
                                    style={{ width: `${item.current}%` }}
                                />
                            </div>
                            {/* Línea de objetivo */}
                            <div
                                className="absolute top-0 h-3 w-1 bg-white rounded-full opacity-80"
                                style={{ left: `${item.target}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${item.current >= item.target ? 'bg-green-500/20 text-green-400' :
                                    item.current >= item.target - 5 ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                }`}>
                                {item.current >= item.target ? 'Objetivo cumplido' :
                                    item.current >= item.target - 5 ? 'Cerca del objetivo' :
                                        'Por debajo del objetivo'}
                            </div>
                            <span className="text-slate-400">
                                Diferencia: {(item.current - item.target).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-slate-600/50">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                        <div className="text-slate-400">Eficiencia Promedio</div>
                        <div className="text-purple-400 font-semibold text-lg">
                            {avgEfficiency.toFixed(1)}%
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400">Procesos Óptimos</div>
                        <div className="text-green-400 font-semibold text-lg">
                            {efficiencyData.filter(item => item.current >= item.target).length}/5
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400">Mejora Promedio</div>
                        <div className="text-blue-400 font-semibold text-lg">
                            +{(efficiencyData.reduce((sum, item) => sum + item.trend, 0) / efficiencyData.length).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        <span>Eficiencia Actual</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-1 bg-white rounded-full"></div>
                        <span>Objetivo</span>
                    </div>
                </div>
                <span>Última semana</span>
            </div>
        </div>
    );
}