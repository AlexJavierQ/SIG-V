"use client";

import React from 'react';
import { X, TrendingUp, TrendingDown, BarChart3, Info } from 'lucide-react';

interface ChartDetailOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    data: any;
    chartType: 'bar' | 'line' | 'pie' | 'area';
    insights?: string[];
    recommendations?: string[];
}

export default function ChartDetailOverlay({
    isOpen,
    onClose,
    title,
    data,
    chartType,
    insights = [],
    recommendations = []
}: ChartDetailOverlayProps) {
    if (!isOpen) return null;

    const getChartIcon = () => {
        switch (chartType) {
            case 'bar':
                return <BarChart3 className="w-6 h-6 text-blue-400" />;
            case 'line':
                return <TrendingUp className="w-6 h-6 text-green-400" />;
            case 'pie':
                return <div className="w-6 h-6 rounded-full bg-purple-400" />;
            case 'area':
                return <TrendingUp className="w-6 h-6 text-orange-400" />;
            default:
                return <BarChart3 className="w-6 h-6 text-blue-400" />;
        }
    };

    const formatValue = (value: any) => {
        if (typeof value === 'number') {
            return value.toLocaleString();
        }
        return value;
    };

    const calculateStats = (data: any[]) => {
        if (!Array.isArray(data) || data.length === 0) return null;

        const values = data.map(item => {
            const numericValue = Object.values(item).find(val => typeof val === 'number');
            return numericValue || 0;
        }) as number[];

        const total = values.reduce((sum, val) => sum + val, 0);
        const average = total / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);

        return { total, average, max, min };
    };

    const stats = calculateStats(data);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                    <div className="flex items-center gap-3">
                        {getChartIcon()}
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                {title}
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Análisis detallado de datos
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 hover:scale-110"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Estadísticas Generales */}
                        {stats && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Info className="w-5 h-5 text-blue-400" />
                                    Estadísticas Generales
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700/50">
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {formatValue(stats.total)}
                                        </div>
                                        <div className="text-sm text-blue-700 dark:text-blue-300">Total</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-700/50">
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {formatValue(Math.round(stats.average))}
                                        </div>
                                        <div className="text-sm text-green-700 dark:text-green-300">Promedio</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-700/50">
                                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                            {formatValue(stats.max)}
                                        </div>
                                        <div className="text-sm text-purple-700 dark:text-purple-300">Máximo</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl border border-orange-200 dark:border-orange-700/50">
                                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                            {formatValue(stats.min)}
                                        </div>
                                        <div className="text-sm text-orange-700 dark:text-orange-300">Mínimo</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Datos Detallados */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-green-400" />
                                Datos Detallados
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 max-h-80 overflow-y-auto">
                                <div className="space-y-2">
                                    {Array.isArray(data) && data.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow">
                                            <div className="font-medium text-slate-900 dark:text-white">
                                                {item.name || item.label || `Item ${index + 1}`}
                                            </div>
                                            <div className="text-slate-600 dark:text-slate-300">
                                                {Object.entries(item)
                                                    .filter(([key]) => key !== 'name' && key !== 'label')
                                                    .map(([key, value]) => (
                                                        <span key={key} className="ml-2">
                                                            {key}: {formatValue(value)}
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Insights */}
                    {insights.length > 0 && (
                        <div className="mt-6 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-yellow-400" />
                                Insights Clave
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {insights.map((insight, index) => (
                                    <div key={index} className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-700/50">
                                        <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                            {insight}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recomendaciones */}
                    {recommendations.length > 0 && (
                        <div className="mt-6 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <TrendingDown className="w-5 h-5 text-red-400" />
                                Recomendaciones
                            </h3>
                            <div className="space-y-3">
                                {recommendations.map((recommendation, index) => (
                                    <div key={index} className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl border border-red-200 dark:border-red-700/50">
                                        <div className="text-sm text-red-800 dark:text-red-200">
                                            {recommendation}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}