"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, TrendingUp, Target, DollarSign, Activity, BarChart3, MapPin, Clock } from "lucide-react";

// --- Optimized Components ---
import DashboardLayout from "@/components/ui/DashboardLayout";
import DashboardSection from "@/components/ui/DashboardSection";
import CompactFilters from "@/components/ui/CompactFilters";

import { useFilters } from "@/contexts/FiltersContext";
import { useOperationalData, useMarketingData, useFinancialData } from "@/hooks/useApiData";

export default function ExecutiveTaxisPage() {
    const { filters } = useFilters();

    // Hooks para datos de múltiples endpoints
    const {
        data: operationalData,
        loading: operationalLoading,
        error: operationalError,
        refetch: operationalRefetch
    } = useOperationalData(true);

    const {
        data: marketingData,
        loading: marketingLoading,
        error: marketingError,
        refetch: marketingRefetch
    } = useMarketingData(true);

    const {
        data: financialData,
        loading: financialLoading,
        error: financialError,
        refetch: financialRefetch
    } = useFinancialData(true);

    const isLoading = operationalLoading || marketingLoading || financialLoading;
    const hasError = operationalError || marketingError || financialError;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-900">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-lg text-slate-300">Cargando Dashboard Ejecutivo de Taxis...</p>
                </div>
            </div>
        );
    }

    // Funciones auxiliares para procesar datos
    const getValue = (dataArray: any[], index: number, defaultValue: number = 0): number => {
        if (!dataArray || dataArray.length === 0) return defaultValue;
        const record = dataArray[0];
        return parseFloat(record[index]) || defaultValue;
    };

    const calculateTrend = (dataArray: unknown[], index: number): number => {
        if (!dataArray || dataArray.length < 2) return 0;
        const current = getValue(dataArray, index);
        const previous = parseFloat(dataArray[1][index]) || 0;
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    };

    // Funciones para calcular datos agregados correctamente
    const getTotalIngresos = () => {
        if (!financialData || financialData.length === 0) return 12500000;
        return financialData.reduce((sum, record) => sum + (parseFloat(String(record[14])) || 0), 0);
    };

    const getTotalUsuarios = () => {
        if (!marketingData || marketingData.length === 0) return 35000;
        return marketingData.reduce((sum, record) => sum + (parseFloat(String(record[12])) || 0), 0);
    };

    const getPromedioEficiencia = () => {
        if (!operationalData || operationalData.length === 0) return 78;
        const promedio = operationalData.reduce((sum, record) => sum + (parseFloat(String(record[21])) || 0), 0) / operationalData.length;
        return promedio > 1 ? promedio : promedio * 100; // Convertir a porcentaje si está en decimal
    };

    const getMargenNeto = () => {
        if (!financialData || financialData.length === 0) return 15.5;
        const totalIngresos = getTotalIngresos();
        const totalCostos = financialData.reduce((sum, record) =>
            sum + (parseFloat(String(record[9])) || 0) + (parseFloat(String(record[10])) || 0), 0
        );
        return totalIngresos > 0 ? ((totalIngresos - totalCostos) / totalIngresos) * 100 : 0;
    };





    // Prepare export data
    const exportData = {
        tipo: 'Ejecutivo Taxis',
        fecha: new Date().toISOString(),
        totalIngresos: getTotalIngresos(),
        totalUsuarios: getTotalUsuarios(),
        promedioEficiencia: getPromedioEficiencia(),
        margenNeto: getMargenNeto()
    };

    return (
        <DashboardLayout
            title="Dashboard Ejecutivo - Taxis"
            subtitle="Vista estratégica y análisis ejecutivo del servicio de taxis"
            exportData={[exportData]}
            dashboardType="ejecutivo-taxis"
        >
            <div className="space-y-8">
                {/* Compact Filters */}
                <CompactFilters />

                {/* Mostrar mensaje de error si hay error */}
                {hasError && (
                    <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center shadow-lg">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-6 h-6 text-red-400">⚠️</div>
                            <span className="text-red-400 font-medium">Error al cargar datos ejecutivos</span>
                        </div>
                        <p className="text-slate-300 mb-4">
                            Error de conexión con uno o más endpoints. Verifique la conectividad.
                        </p>
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={operationalRefetch}
                                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
                            >
                                Operacional
                            </button>
                            <button
                                onClick={marketingRefetch}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                            >
                                Marketing
                            </button>
                            <button
                                onClick={financialRefetch}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                            >
                                Financiero
                            </button>
                        </div>
                    </div>
                )}

                {/* Accesos Directos a Dashboards - Destacados y Amplios */}
                <DashboardSection
                    title="Dashboards Disponibles"
                    subtitle="Selecciona el área de análisis que necesitas"
                    icon={Target}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Dashboard Operacional */}
                        <a
                            href="/taxis/operacional"
                            className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 backdrop-blur-sm border-2 border-purple-500/30 rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:border-purple-400 hover:scale-105 relative group cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <TrendingUp className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-purple-400 mb-1">
                                        {getPromedioEficiencia().toFixed(1)}%
                                    </div>
                                    <div className="text-sm text-purple-300">Eficiencia Promedio</div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white mb-3">Dashboard Operacional</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Monitoreo en tiempo real de operaciones, eficiencia de conductores,
                                    métricas de servicio y análisis de rendimiento operativo.
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
                                <div className="flex items-center gap-2 text-purple-300">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">Cobertura completa</span>
                                </div>
                                <div className="flex items-center gap-2 text-purple-300 group-hover:text-white transition-colors">
                                    <span className="text-sm font-medium">Acceder al dashboard</span>
                                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                                        <span className="text-xs">→</span>
                                    </div>
                                </div>
                            </div>
                        </a>

                        {/* Dashboard Financiero */}
                        <a
                            href="/taxis/financiero"
                            className="bg-gradient-to-br from-green-900/40 to-green-800/30 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl p-8 shadow-2xl hover:shadow-green-500/20 transition-all duration-300 hover:border-green-400 hover:scale-105 relative group cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <DollarSign className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-green-400 mb-1">
                                        ${getTotalIngresos().toLocaleString()}
                                    </div>
                                    <div className="text-sm text-green-300">Ingresos Totales</div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white mb-3">Dashboard Financiero</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Análisis completo de ingresos, costos operativos, rentabilidad por zona,
                                    análisis de churn y proyecciones financieras.
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-green-500/20">
                                <div className="flex items-center gap-2 text-green-300">
                                    <Activity className="w-4 h-4" />
                                    <span className="text-sm">Análisis en tiempo real</span>
                                </div>
                                <div className="flex items-center gap-2 text-green-300 group-hover:text-white transition-colors">
                                    <span className="text-sm font-medium">Acceder al dashboard</span>
                                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-colors">
                                        <span className="text-xs">→</span>
                                    </div>
                                </div>
                            </div>
                        </a>

                        {/* Dashboard Marketing */}
                        <a
                            href="/taxis/marketing"
                            className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm border-2 border-blue-500/30 rounded-2xl p-8 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:border-blue-400 hover:scale-105 relative group cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-blue-400 mb-1">
                                        {(marketingData && marketingData.length > 0
                                            ? marketingData.reduce((sum, record) => sum + (parseFloat(String(record[13])) || 0), 0)
                                            : 1250
                                        ).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-blue-300">Nuevos Usuarios</div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white mb-3">Dashboard Marketing</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Estrategias de adquisición, análisis de conversión, CAC por canal,
                                    efectividad de campañas y métricas de engagement.
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-blue-500/20">
                                <div className="flex items-center gap-2 text-blue-300">
                                    <Target className="w-4 h-4" />
                                    <span className="text-sm">Campañas activas</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-300 group-hover:text-white transition-colors">
                                    <span className="text-sm font-medium">Acceder al dashboard</span>
                                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                                        <span className="text-xs">→</span>
                                    </div>
                                </div>
                            </div>
                        </a>

                        {/* Dashboard Ventas */}
                        <a
                            href="/taxis/ventas"
                            className="bg-gradient-to-br from-orange-900/40 to-orange-800/30 backdrop-blur-sm border-2 border-orange-500/30 rounded-2xl p-8 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:border-orange-400 hover:scale-105 relative group cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Activity className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-orange-400 mb-1">
                                        85%
                                    </div>
                                    <div className="text-sm text-orange-300">Efectividad</div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white mb-3">Dashboard Ventas</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Patrones de uso por zona, análisis de demanda, canales de venta,
                                    comportamiento del usuario y oportunidades de crecimiento.
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-orange-500/20">
                                <div className="flex items-center gap-2 text-orange-300">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">Datos actualizados</span>
                                </div>
                                <div className="flex items-center gap-2 text-orange-300 group-hover:text-white transition-colors">
                                    <span className="text-sm font-medium">Acceder al dashboard</span>
                                    <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                                        <span className="text-xs">→</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </DashboardSection>


            </div>
        </DashboardLayout>
    );
}