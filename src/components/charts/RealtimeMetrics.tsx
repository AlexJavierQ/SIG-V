"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, Users } from 'lucide-react';

export default function RealtimeMetrics() {
    const [metrics, setMetrics] = useState([
        { label: 'Usuarios Online', value: 1247, change: 0, icon: Users, color: 'text-emerald-400' },
        { label: 'Transacciones/min', value: 89, change: 0, icon: Zap, color: 'text-blue-400' },
        { label: 'Tiempo Respuesta', value: 245, change: 0, icon: Clock, color: 'text-purple-400' },
        { label: 'CPU Usage', value: 67, change: 0, icon: Activity, color: 'text-orange-400' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => prev.map(metric => {
                const change = (Math.random() - 0.5) * 10;
                const newValue = Math.max(0, metric.value + change);
                return {
                    ...metric,
                    value: Math.round(newValue),
                    change: change
                };
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        Métricas en Tiempo Real
                    </h3>
                    <p className="text-slate-400 text-sm">Actualización automática cada 3s</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Live</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {metrics.map((metric, index) => {
                    const IconComponent = metric.icon;
                    return (
                        <div key={index} className="bg-slate-700/30 rounded-lg p-4 transition-all duration-300 hover:bg-slate-700/50">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2 bg-slate-600/50 rounded-lg`}>
                                    <IconComponent className={`w-4 h-4 ${metric.color}`} />
                                </div>
                                <div className={`text-xs font-medium ${metric.change > 0 ? 'text-green-400' :
                                        metric.change < 0 ? 'text-red-400' : 'text-slate-400'
                                    }`}>
                                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className={`text-xl font-bold ${metric.color} transition-all duration-500`}>
                                    {metric.label === 'Tiempo Respuesta' ? `${metric.value}ms` :
                                        metric.label === 'CPU Usage' ? `${metric.value}%` :
                                            metric.value.toLocaleString()}
                                </div>
                                <div className="text-slate-400 text-xs">{metric.label}</div>
                            </div>

                            {/* Mini progress bar for percentage metrics */}
                            {(metric.label === 'CPU Usage') && (
                                <div className="mt-3">
                                    <div className="w-full bg-slate-600 rounded-full h-1">
                                        <div
                                            className={`h-1 rounded-full transition-all duration-500 ${metric.value > 80 ? 'bg-red-400' :
                                                    metric.value > 60 ? 'bg-yellow-400' :
                                                        'bg-green-400'
                                                }`}
                                            style={{ width: `${metric.value}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-600/50">
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Última actualización: {new Date().toLocaleTimeString()}</span>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Conectado</span>
                    </div>
                </div>
            </div>
        </div>
    );
}