"use client";

import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

export default function ServiceLevelChart() {
    // Datos simulados para niveles de servicio
    const serviceData = [
        {
            service: 'Tiempo de Respuesta',
            current: 1.8,
            target: 2.0,
            unit: 's',
            status: 'excellent',
            improvement: -12.3
        },
        {
            service: 'Resolución Primer Contacto',
            current: 87.5,
            target: 85.0,
            unit: '%',
            status: 'good',
            improvement: 5.2
        },
        {
            service: 'Disponibilidad Sistema',
            current: 99.2,
            target: 99.0,
            unit: '%',
            status: 'excellent',
            improvement: 0.3
        },
        {
            service: 'Satisfacción Cliente',
            current: 4.6,
            target: 4.5,
            unit: '/5',
            status: 'good',
            improvement: 8.7
        },
        {
            service: 'Tiempo Resolución',
            current: 2.5,
            target: 3.0,
            unit: 'h',
            status: 'excellent',
            improvement: -16.7
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'excellent': return 'text-green-400 bg-green-400/20 border-green-400/30';
            case 'good': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
            case 'warning': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
            default: return 'text-red-400 bg-red-400/20 border-red-400/30';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'excellent': return 'Excelente';
            case 'good': return 'Bueno';
            case 'warning': return 'Atención';
            default: return 'Crítico';
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        Niveles de Servicio
                    </h3>
                    <p className="text-slate-400 text-sm">SLA y métricas de calidad</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Operativo</span>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                {serviceData.map((item, index) => (
                    <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-300 font-medium">{item.service}</span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                {getStatusText(item.status)}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                                <div className="text-slate-400 text-xs mb-1">Actual</div>
                                <div className="text-white font-semibold text-lg">
                                    {item.current}{item.unit}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-slate-400 text-xs mb-1">Objetivo</div>
                                <div className="text-blue-400 font-semibold text-lg">
                                    {item.target}{item.unit}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-slate-400 text-xs mb-1">Mejora</div>
                                <div className={`font-semibold text-lg ${item.improvement >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {item.improvement >= 0 ? '+' : ''}{item.improvement}%
                                </div>
                            </div>
                        </div>

                        {/* Barra de progreso visual */}
                        <div className="mt-3">
                            <div className="w-full bg-slate-600 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-1000 ${item.status === 'excellent' ? 'bg-green-400' :
                                            item.status === 'good' ? 'bg-blue-400' :
                                                item.status === 'warning' ? 'bg-yellow-400' :
                                                    'bg-red-400'
                                        }`}
                                    style={{
                                        width: item.unit === '%' ? `${item.current}%` :
                                            item.unit === '/5' ? `${(item.current / 5) * 100}%` :
                                                item.unit === 's' ? `${Math.min((3 - item.current) / 3 * 100, 100)}%` :
                                                    `${Math.min((4 - item.current) / 4 * 100, 100)}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-slate-600/50">
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                        <div className="text-slate-400">SLA Cumplidos</div>
                        <div className="text-green-400 font-semibold text-lg">
                            {serviceData.filter(item => item.status === 'excellent' || item.status === 'good').length}/5
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400">Mejora Promedio</div>
                        <div className="text-blue-400 font-semibold text-lg">
                            +{(serviceData.reduce((sum, item) => sum + Math.abs(item.improvement), 0) / serviceData.length).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">
                        Todos los SLA dentro de los parámetros aceptables
                    </span>
                </div>
            </div>
        </div>
    );
}