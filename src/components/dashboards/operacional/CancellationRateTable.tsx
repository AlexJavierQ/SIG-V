"use client";

import React from 'react';
import { AlertTriangle, User } from 'lucide-react';
import Card from '@/components/ui/Card';

interface DriverData {
    name: string;
    viajes: number;
    cancelacion: number;
}

interface CancellationRateTableProps {
    data: DriverData[];
}

export default function CancellationRateTable({ data }: CancellationRateTableProps) {
    const getCancellationColor = (rate: number) => {
        if (rate >= 50) return 'text-red-400';
        if (rate >= 25) return 'text-yellow-400';
        if (rate >= 15) return 'text-orange-400';
        return 'text-green-400';
    };

    const getCancellationBg = (rate: number) => {
        if (rate >= 50) return 'bg-red-500/20';
        if (rate >= 25) return 'bg-yellow-500/20';
        if (rate >= 15) return 'bg-orange-500/20';
        return 'bg-green-500/20';
    };

    return (
        <Card className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-2">
                    Tasa de Cancelación
                </h3>
                <p className="text-sm text-slate-400">
                    Conductores ordenados por tasa de cancelación
                </p>
            </div>

            <div className="space-y-3">
                {data.map((driver) => (
                    <div
                        key={driver.name}
                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                                <div className="font-medium text-slate-200">{driver.name}</div>
                                <div className="text-sm text-slate-400">{driver.viajes} viajes asignados</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCancellationBg(driver.cancelacion)} ${getCancellationColor(driver.cancelacion)}`}>
                                {driver.cancelacion}%
                            </div>
                            {driver.cancelacion >= 25 && (
                                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                <div>
                    Mostrando {data.length} conductores
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Alto riesgo (&ge;50%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Medio riesgo (25-49%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Bajo riesgo (&lt;25%)</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}