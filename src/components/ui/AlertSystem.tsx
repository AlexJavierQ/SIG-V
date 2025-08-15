"use client";

import React, { useEffect, useState } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

interface Alert {
    id: string;
    name: string;
    message: string;
    severity: 'critical' | 'high';
    type: 'operational' | 'financial';
}

interface AlertSystemProps {
    data: {
        eficienciaOperativa?: number;
        efectividad?: number;
        ingresosTotales?: number;
    };
    onAlert: (alert: Alert) => void;
}

export function AlertSystem({ data, onAlert }: AlertSystemProps) {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        const newAlerts: Alert[] = [];

        // Check for critical KPIs
        if (data.eficienciaOperativa && data.eficienciaOperativa < 70) {
            newAlerts.push({
                id: 'efficiency-low',
                name: 'Eficiencia Operativa Baja',
                message: `La eficiencia operativa está en ${data.eficienciaOperativa}%, por debajo del umbral crítico de 70%`,
                severity: 'critical',
                type: 'operational'
            });
        }

        if (data.efectividad && data.efectividad < 60) {
            newAlerts.push({
                id: 'effectiveness-low',
                name: 'Efectividad Crítica',
                message: `La efectividad está en ${data.efectividad}%, requiere atención inmediata`,
                severity: 'high',
                type: 'operational'
            });
        }

        if (data.ingresosTotales && data.ingresosTotales < 10000) {
            newAlerts.push({
                id: 'revenue-low',
                name: 'Ingresos Bajos',
                message: `Los ingresos totales están por debajo del objetivo mensual`,
                severity: 'high',
                type: 'financial'
            });
        }

        // Only update if alerts have changed
        setAlerts(prevAlerts => {
            const hasChanged = newAlerts.length !== prevAlerts.length ||
                newAlerts.some(alert => !prevAlerts.find(existing => existing.id === alert.id));

            if (hasChanged) {
                // Trigger alerts for new issues
                newAlerts.forEach(alert => {
                    if (!prevAlerts.find(existing => existing.id === alert.id)) {
                        onAlert(alert);
                    }
                });
                return newAlerts;
            }
            return prevAlerts;
        });
    }, [data, onAlert]);

    if (alerts.length === 0) return null;

    return (
        <div className="
            bg-red-50/80 dark:bg-red-950/30 
            border border-red-200/60 dark:border-red-800/40 
            rounded-xl p-4 mb-6 
            backdrop-blur-sm
            shadow-sm hover:shadow-md
            transition-all duration-300
        ">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-xl pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-red-100/80 dark:bg-red-900/40 rounded-lg transition-colors duration-300 shadow-sm">
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 transition-colors duration-300" />
                    </div>
                    <h3 className="text-base font-semibold text-red-900 dark:text-red-100 transition-colors duration-300">
                        Alertas del Sistema
                    </h3>
                    <div className="ml-auto">
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-200/60 dark:bg-red-800/40 rounded-full">
                            {alerts.length}
                        </span>
                    </div>
                </div>
                <div className="space-y-2">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="
                                flex items-center gap-3 p-3 
                                bg-white/80 dark:bg-slate-800/60 
                                rounded-lg 
                                border border-red-100/60 dark:border-red-800/20
                                hover:bg-red-50/60 dark:hover:bg-slate-700/40
                                hover:border-red-200/80 dark:hover:border-red-700/40
                                hover:scale-[1.01]
                                transition-all duration-300
                                backdrop-blur-sm
                                shadow-sm hover:shadow-md
                            "
                        >
                            {alert.severity === 'critical' ? (
                                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 transition-colors duration-300" />
                            ) : (
                                <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 transition-colors duration-300" />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm transition-colors duration-300">
                                    {alert.name}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300 mt-0.5">
                                    {alert.message}
                                </div>
                            </div>
                            <span className={`
                                px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0 transition-colors duration-300 shadow-sm
                                ${alert.severity === 'critical'
                                    ? 'bg-red-100/80 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200/50 dark:border-red-800/30'
                                    : 'bg-orange-100/80 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border border-orange-200/50 dark:border-orange-800/30'
                                }
                            `}>
                                {alert.severity === 'critical' ? 'Crítico' : 'Alto'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}