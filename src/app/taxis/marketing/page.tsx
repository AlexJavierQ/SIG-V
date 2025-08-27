"use client";

import { useState, useEffect, useCallback } from "react";
import { getMarketingData } from "@/lib/data";
import type { MarketingDashboardData } from "@/lib/types";
import { Users, TrendingUp, Target, UserPlus, Activity, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

// --- Optimized Components ---
import DashboardLayout from "@/components/ui/DashboardLayout";
import DashboardSection from "@/components/ui/DashboardSection";
import MetricCard from "@/components/ui/MetricCard";
import CompactFilters from "@/components/ui/CompactFilters";
import { useFilters } from "@/contexts/FiltersContext";
import { useMarketingData } from "@/hooks/useApiData";
import ApiDebugPanel from "@/components/ui/ApiDebugPanel";

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

export default function MarketingPage() {
  const [data, setData] = useState<MarketingDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const { filters } = useFilters();

  // Hook para datos del endpoint real
  const {
    data: apiData,
    loading: apiLoading,
    error: apiError,
    refetch: apiRefetch,
    buildCurrentUrl
  } = useMarketingData(true); // Auto-fetch enabled

  const fetchData = useCallback(() => {
    setIsLoading(true);
    // Convert global filters to the format expected by getMarketingData
    const apiFilters = {
      aplicativo: filters.app,
      pais: filters.country,
      ciudad: filters.city,
      fechaInicio: "2025-07-01",
      fechaFin: "2025-07-31",
      establecimiento: filters.establishment,
      transaccional: !filters.includeNonTransactional,
    };

    Promise.resolve(getMarketingData(apiFilters))
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching marketing data:", error);
        setIsLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (apiLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-slate-300">Cargando Dashboard de Marketing...</p>
        </div>
      </div>
    );
  }

  // Funciones auxiliares para procesar datos del endpoint
  const getValue = (dataArray: any[], index: number, defaultValue: number = 0): number => {
    if (!dataArray || dataArray.length === 0) return defaultValue;
    const record = dataArray[0];
    return parseFloat(record[index]) || defaultValue;
  };

  const calculateTrend = (dataArray: unknown[], index: number): number => {
    if (!dataArray || dataArray.length < 2) return 0;
    const current = getValue(dataArray as unknown[], index);
    const previous = parseFloat((dataArray[1] as unknown)[index]) || 0;
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Datos procesados del endpoint para los gráficos
  const getActivityData = () => {
    if (!apiData || apiData.length === 0) {
      return [
        { time: 'Madrugada (00-06)', value: 800 },
        { time: 'Mañana (06-12)', value: 2100 },
        { time: 'Tarde (12-18)', value: 3200 },
        { time: 'Noche (18-24)', value: 3800 }
      ];
    }

    // Simular distribución horaria basada en registrados_totales_clean
    const totalUsers = getValue(apiData, 12); // registrados_totales_clean
    return [
      { time: 'Madrugada (00-06)', value: Math.round(totalUsers * 0.15) },
      { time: 'Mañana (06-12)', value: Math.round(totalUsers * 0.25) },
      { time: 'Tarde (12-18)', value: Math.round(totalUsers * 0.35) },
      { time: 'Noche (18-24)', value: Math.round(totalUsers * 0.25) }
    ];
  };

  const getAcquisitionChannels = () => {
    if (!apiData || apiData.length === 0) {
      return [
        { name: 'Facebook Ads', cac: 6.50, users: 450, color: '#8B5CF6' },
        { name: 'Google Search', cac: 8.20, users: 360, color: '#10B981' },
        { name: 'Referidos', cac: 1.50, users: 300, color: '#F59E0B' },
        { name: 'Orgánico', cac: 0.50, users: 160, color: '#EF4444' }
      ];
    }

    const newUsers = getValue(apiData, 13); // registrados_nuevos_clean
    return [
      { name: 'Facebook Ads', cac: 6.50, users: Math.round(newUsers * 0.40), color: '#8B5CF6' },
      { name: 'Google Search', cac: 8.20, users: Math.round(newUsers * 0.30), color: '#10B981' },
      { name: 'Referidos', cac: 1.50, users: Math.round(newUsers * 0.20), color: '#F59E0B' },
      { name: 'Orgánico', cac: 0.50, users: Math.round(newUsers * 0.10), color: '#EF4444' }
    ];
  };

  const getCacEvolution = () => {
    // Simular evolución del CAC con tendencia descendente
    return [
      { month: 'Ene', value: 9.00 },
      { month: 'Feb', value: 8.50 },
      { month: 'Mar', value: 8.80 },
      { month: 'Abr', value: 8.20 },
      { month: 'May', value: 7.90 },
      { month: 'Jun', value: 6.50 }
    ];
  };

  const getConversionFunnel = () => {
    if (!apiData || apiData.length === 0) {
      return [
        { stage: 'Registro', value: 100, color: '#8B5CF6' },
        { stage: 'Solicitud', value: 46.4, color: '#10B981' },
        { stage: 'Viaje Atendido', value: 39.2, color: '#3B82F6' }
      ];
    }

    const totalRegistered = getValue(apiData, 12); // registrados_totales_clean
    const newRequests = getValue(apiData, 14); // solicitaron_nuevos_clean
    const effectiveness = getValue(apiData, 9) * 100; // efectividad_nuevos

    return [
      { stage: 'Registro', value: 100, color: '#8B5CF6' },
      { stage: 'Solicitud', value: totalRegistered > 0 ? (newRequests / totalRegistered) * 100 : 0, color: '#10B981' },
      { stage: 'Viaje Atendido', value: effectiveness, color: '#3B82F6' }
    ];
  };

  // Datos dinámicos basados en el endpoint
  const activityData = getActivityData();
  const acquisitionChannels = getAcquisitionChannels();
  const cacEvolution = getCacEvolution();
  const conversionFunnel = getConversionFunnel();

  // Prepare export data
  const exportData = apiData ? apiData.map((record, index) => ({
    tipo: 'Marketing',
    indice: index,
    registradosTotales: getValue(apiData, 4), // registrados_totales
    registradosNuevos: getValue(apiData, 5), // registrados_nuevos
    solicitaronNuevos: getValue(apiData, 6), // solicitaron_nuevos
    noSolicitaron: getValue(apiData, 7), // no_solicitaron
    abrenYNoPiden: getValue(apiData, 8), // abren_y_no_piden
    efectividadNuevos: getValue(apiData, 9), // efectividad_nuevos
    efectividadUsuarios: getValue(apiData, 10), // efectividad_usuarios
    efectividadSolicitudes: getValue(apiData, 11) // efectividad_solicitudes
  })) : [];

  return (
    <DashboardLayout
      title="Dashboard de Marketing"
      subtitle="Análisis de adquisición, retención y campañas"
      exportData={exportData}
      dashboardType="marketing"
    >
      <div className="space-y-8">
        {/* Compact Filters */}
        <CompactFilters />

        {/* Mostrar mensaje de error si hay error */}
        {apiError && (
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-6 text-red-400">⚠️</div>
              <span className="text-red-400 font-medium">Error al cargar datos de marketing</span>
            </div>
            <p className="text-slate-300 mb-4">
              Error de conexión: {apiError}. Verifique que el endpoint de marketing esté disponible.
            </p>
            <button
              onClick={apiRefetch}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Actualizar datos
            </button>
          </div>
        )}

        {/* Mostrar mensaje de no datos si no hay error pero tampoco datos */}
        {!apiError && !apiData && !isLoading && (
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-6 text-slate-400">📊</div>
              <span className="text-slate-300 font-medium">No hay datos de marketing disponibles</span>
            </div>
            <p className="text-slate-300 mb-4">
              No se encontraron datos en el endpoint de marketing. Verifique los filtros aplicados o intente actualizar.
            </p>
            <button
              onClick={apiRefetch}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Actualizar datos
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-300 font-medium">
                Actualizando datos de marketing...
              </span>
            </div>
          </div>
        ) : null}

        {/* Mostrar contenido solo si hay datos del endpoint o usar datos mock */}
        <div className="space-y-8">
          {/* KPIs de Marketing - PRIMERA SECCIÓN */}
          <DashboardSection
            title="Indicadores Clave de Marketing"
            subtitle="Métricas principales de adquisición y efectividad"
            icon={Users}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg relative">
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 text-lg">✨</span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-sm text-slate-400 mb-1">Nuevos Usuarios (Período)</div>
                  <div className="text-xs text-slate-500">Usuarios que se registran en el período</div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {apiData ? getValue(apiData, 13).toLocaleString() : '1250'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg relative">
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-lg">🚀</span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-sm text-slate-400 mb-1">Costo por Adquisición (CAC)</div>
                  <div className="text-xs text-slate-500">Costo promedio para adquirir un nuevo usuario</div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  6
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg relative">
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 text-lg">⚡</span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-sm text-slate-400 mb-1">Efectividad Nuevos</div>
                  <div className="text-xs text-slate-500">% de nuevos usuarios que solicitan al menos un viaje</div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {apiData ? (getValue(apiData, 9) * 100).toFixed(0) : '46'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg relative">
                <div className="mb-2">
                  <div className="text-sm text-slate-400 mb-1">Abren y No Piden</div>
                  <div className="text-xs text-slate-500">Usuarios que abren la app y no solicitan</div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {apiData ? getValue(apiData, 8).toLocaleString() : '225'}
                </div>
              </div>
            </div>
          </DashboardSection>

          {/* Análisis de Comportamiento e Interacción */}
          <DashboardSection
            title="Análisis de Comportamiento e Interacción"
            subtitle="Patrones de uso y engagement de usuarios"
            icon={Activity}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Actividad por Franja Horaria - Miniatura */}
              <div
                className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-2 hover:border-purple-400 hover:shadow-purple-400/20 relative group"
                onClick={() => setActiveOverlay('activity-hours')}
              >
                <div className="absolute top-4 right-4 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-white">Actividad por Franja Horaria</h3>
                  <div className="w-4 h-4 text-blue-400">ℹ️</div>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8B5CF6"
                        fill="url(#colorGradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                  <span className="text-xs text-slate-400 group-hover:text-purple-400 transition-colors">
                    Click para expandir
                  </span>
                </div>
              </div>

              {/* Tasa de Interacción - Miniatura */}
              <div
                className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-2 hover:border-blue-400 hover:shadow-blue-400/20 relative group"
                onClick={() => setActiveOverlay('interaction-rate')}
              >
                <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-white">Tasa de Interacción</h3>
                  <div className="w-4 h-4 text-blue-400">ℹ️</div>
                </div>
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeDasharray="43, 100"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-400">
                        {apiData && getValue(apiData, 12) > 0 ? Math.round((getValue(apiData, 14) / getValue(apiData, 12)) * 100) : 43}%
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">
                    {apiData ? `${getValue(apiData, 14).toLocaleString()} solicitudes de ${getValue(apiData, 12).toLocaleString()} registros` : '6,500 interacciones de 15,000 aperturas'}
                  </div>
                </div>
                <div className="text-center mt-4">
                  <span className="text-xs text-slate-400 group-hover:text-blue-400 transition-colors">
                    Click para expandir
                  </span>
                </div>
              </div>
            </div>
          </DashboardSection>

          {/* Análisis de Costo de Adquisición (CAC) */}
          <DashboardSection
            title="Análisis de Costo de Adquisición (CAC)"
            subtitle="Eficiencia y evolución de canales de marketing"
            icon={TrendingUp}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rendimiento de Canales de Adquisición - Miniatura Mejorada */}
              <div
                className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-2 hover:border-green-400 hover:shadow-green-400/20 relative group"
                onClick={() => setActiveOverlay('acquisition-channels')}
              >
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-lg font-semibold text-white">Rendimiento de Canales de Adquisición</h3>
                  <div className="w-4 h-4 text-blue-400">ℹ️</div>
                </div>

                {/* Gráfico de barras mejorado con etiquetas */}
                <div className="space-y-4">
                  {acquisitionChannels.map((channel, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-20 text-right">
                        <div className="text-sm font-medium text-white truncate">{channel.name}</div>
                      </div>
                      <div className="flex-1 relative">
                        <div className="w-full bg-slate-700/50 rounded-full h-6 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out relative"
                            style={{
                              backgroundColor: channel.color,
                              width: `${(channel.users / Math.max(...acquisitionChannels.map(c => c.users))) * 100}%`,
                              boxShadow: `0 0 10px ${channel.color}40`
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                          </div>
                        </div>
                        <div className="absolute right-2 top-0 h-6 flex items-center">
                          <span className="text-xs font-semibold text-white drop-shadow-lg">
                            {channel.users.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="w-16 text-right">
                        <div className="text-xs text-slate-400">
                          CAC: ${channel.cac}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumen estadístico */}
                <div className="mt-6 pt-4 border-t border-slate-600/50">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total usuarios adquiridos</span>
                    <span className="text-white font-semibold">
                      {acquisitionChannels.reduce((sum, channel) => sum + channel.users, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-slate-400">CAC promedio ponderado</span>
                    <span className="text-green-400 font-semibold">
                      ${(acquisitionChannels.reduce((sum, channel) => sum + (channel.cac * channel.users), 0) /
                        acquisitionChannels.reduce((sum, channel) => sum + channel.users, 0)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <span className="text-xs text-slate-400 group-hover:text-green-400 transition-colors">
                    Click para expandir análisis detallado
                  </span>
                </div>
              </div>

              {/* Evolución del CAC - Miniatura */}
              <div
                className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-2 hover:border-red-400 hover:shadow-red-400/20 relative group"
                onClick={() => setActiveOverlay('cac-evolution')}
              >
                <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-white">Evolución del CAC</h3>
                  <div className="w-4 h-4 text-blue-400">ℹ️</div>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cacEvolution}>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#EF4444"
                        fill="url(#redGradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                  <span className="text-xs text-slate-400 group-hover:text-red-400 transition-colors">
                    Click para expandir
                  </span>
                </div>
              </div>
            </div>
          </DashboardSection>



          {/* Análisis de Conversión y Retención */}
          <DashboardSection
            title="Análisis de Conversión y Retención"
            subtitle="Embudo de conversión y métricas de retención"
            icon={BarChart3}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Embudo de Conversión - Miniatura */}
              <div
                className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-2 hover:border-purple-400 hover:shadow-purple-400/20 relative group"
                onClick={() => setActiveOverlay('conversion-funnel')}
              >
                <div className="absolute top-4 right-4 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-white">Embudo de Conversión</h3>
                  <div className="w-4 h-4 text-blue-400">ℹ️</div>
                </div>
                <div className="flex items-center justify-center h-32">
                  <div className="relative">
                    <div className="w-24 h-32 bg-gradient-to-b from-purple-500 via-green-500 to-blue-500 opacity-80"
                      style={{ clipPath: 'polygon(20% 0%, 80% 0%, 60% 100%, 40% 100%)' }}>
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-between items-center py-2 text-xs text-white font-semibold">
                      <span>100%</span>
                      <span>46.4%</span>
                      <span>39.2%</span>
                    </div>
                  </div>
                  <div className="ml-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded"></div>
                      <span className="text-slate-300">Registro (100%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-slate-300">Solicitud (46.4%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span className="text-slate-300">Viaje Atendido (39.2%)</span>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <span className="text-xs text-slate-400 group-hover:text-purple-400 transition-colors">
                    Click para expandir
                  </span>
                </div>
              </div>

              {/* Comparativa de Retención - Miniatura */}
              <div
                className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-2 hover:border-yellow-400 hover:shadow-yellow-400/20 relative group"
                onClick={() => setActiveOverlay('retention-comparison')}
              >
                <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-white">Comparativa de Retención</h3>
                  <div className="w-4 h-4 text-blue-400">ℹ️</div>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Retención 7 Días', value: 45, color: '#10B981' },
                      { name: 'Retención 30 Días', value: 25, color: '#F59E0B' }
                    ]}>
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">45%</div>
                    <div className="text-xs text-slate-400">7 Días</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">25%</div>
                    <div className="text-xs text-slate-400">30 Días</div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <span className="text-xs text-slate-400 group-hover:text-yellow-400 transition-colors">
                    Click para expandir
                  </span>
                </div>
              </div>
            </div>
          </DashboardSection>
        </div>

        {/* Overlays Detallados */}
        {activeOverlay && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setActiveOverlay(null)}
          >
            <div
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-600"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Activity Hours Overlay */}
              {activeOverlay === 'activity-hours' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Actividad por Franja Horaria</h2>
                    <button
                      onClick={() => setActiveOverlay(null)}
                      className="text-slate-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#8B5CF6"
                          fill="url(#colorGradient)"
                          strokeWidth={3}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Picos de Actividad</h3>
                      <div className="space-y-3">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Noche (18-24h)</span>
                            <span className="text-purple-400 font-semibold">3,800 usuarios</span>
                          </div>
                          <div className="text-sm text-slate-400 mt-1">Pico máximo de actividad</div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Tarde (12-18h)</span>
                            <span className="text-blue-400 font-semibold">3,200 usuarios</span>
                          </div>
                          <div className="text-sm text-slate-400 mt-1">Segundo pico de actividad</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Insights de Comportamiento</h3>
                      <div className="space-y-2 text-sm text-slate-300">
                        <div>• Mayor actividad en horarios nocturnos (18-24h)</div>
                        <div>• Actividad moderada en horarios laborales</div>
                        <div>• Baja actividad en madrugada (00-06h)</div>
                        <div>• Patrón consistente de uso urbano</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="text-purple-400 font-semibold mb-2">Recomendaciones</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Aumentar disponibilidad de conductores en horarios nocturnos</li>
                      <li>• Implementar tarifas dinámicas en horas pico</li>
                      <li>• Campañas promocionales en horarios de baja demanda</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Interaction Rate Overlay */}
              {activeOverlay === 'interaction-rate' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Análisis de Tasa de Interacción</h2>
                    <button
                      onClick={() => setActiveOverlay(null)}
                      className="text-slate-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="relative w-48 h-48 mx-auto mb-6">
                        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#374151"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            strokeDasharray="43, 100"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-blue-400">43%</div>
                            <div className="text-sm text-slate-400">Tasa de Interacción</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="text-sm text-slate-400 mb-2">Desglose de Interacciones</div>
                        <div className="text-lg text-blue-400 font-semibold">6,500 de 15,000</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Métricas de Engagement</h3>
                      <div className="space-y-4">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-300">Sesiones por usuario</span>
                            <span className="text-green-400 font-semibold">2.8</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="bg-green-400 h-2 rounded-full" style={{ width: '70%' }}></div>
                          </div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-300">Tiempo promedio en app</span>
                            <span className="text-blue-400 font-semibold">4.2 min</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="bg-blue-400 h-2 rounded-full" style={{ width: '84%' }}></div>
                          </div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-300">Tasa de rebote</span>
                            <span className="text-yellow-400 font-semibold">32%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '32%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-blue-400 font-semibold mb-2">Oportunidades de Mejora</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Optimizar onboarding para reducir tasa de rebote</li>
                      <li>• Implementar notificaciones push personalizadas</li>
                      <li>• Mejorar UX para aumentar tiempo de sesión</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Acquisition Channels Overlay */}
              {activeOverlay === 'acquisition-channels' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Rendimiento de Canales de Adquisición</h2>
                    <button
                      onClick={() => setActiveOverlay(null)}
                      className="text-slate-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={acquisitionChannels} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9CA3AF" />
                        <YAxis type="category" dataKey="name" stroke="#9CA3AF" width={120} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="users" fill="#10B981" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Análisis por Canal</h3>
                      <div className="space-y-3">
                        {acquisitionChannels.map((channel, index) => (
                          <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white font-medium">{channel.name}</span>
                              <span className="text-green-400 font-semibold">${channel.cac}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-400">
                              <span>{channel.users} usuarios</span>
                              <span>CAC: ${channel.cac}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Eficiencia por Canal</h3>
                      <div className="space-y-4">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400 mb-1">$1.50</div>
                            <div className="text-sm text-slate-300">CAC más bajo - Referidos</div>
                          </div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400 mb-1">450</div>
                            <div className="text-sm text-slate-300">Mayor volumen - Facebook Ads</div>
                          </div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400 mb-1">$8.20</div>
                            <div className="text-sm text-slate-300">Mayor calidad - Google Search</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-2">Recomendaciones de Optimización</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Aumentar inversión en programa de referidos (CAC más bajo)</li>
                      <li>• Optimizar campañas de Facebook Ads para reducir CAC</li>
                      <li>• Expandir presencia en Google Search (alta calidad)</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* CAC Evolution Overlay */}
              {activeOverlay === 'cac-evolution' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Evolución del CAC</h2>
                    <button
                      onClick={() => setActiveOverlay(null)}
                      className="text-slate-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cacEvolution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#EF4444"
                          fill="url(#redGradient)"
                          strokeWidth={3}
                        />
                        <defs>
                          <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center bg-slate-700/30 rounded-lg p-4">
                      <div className="text-3xl font-bold text-green-400 mb-2">$6.50</div>
                      <div className="text-slate-300 text-sm">CAC Actual</div>
                      <div className="text-xs text-green-400 mt-1">-27.8% vs. Enero</div>
                    </div>
                    <div className="text-center bg-slate-700/30 rounded-lg p-4">
                      <div className="text-3xl font-bold text-red-400 mb-2">$9.00</div>
                      <div className="text-slate-300 text-sm">CAC Máximo</div>
                      <div className="text-xs text-slate-400 mt-1">Enero 2025</div>
                    </div>
                    <div className="text-center bg-slate-700/30 rounded-lg p-4">
                      <div className="text-3xl font-bold text-blue-400 mb-2">$7.65</div>
                      <div className="text-slate-300 text-sm">CAC Promedio</div>
                      <div className="text-xs text-slate-400 mt-1">Últimos 6 meses</div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h4 className="text-red-400 font-semibold mb-2">Factores de Mejora</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Optimización de campañas publicitarias</li>
                      <li>• Mejora en targeting y segmentación</li>
                      <li>• Incremento en conversiones orgánicas</li>
                      <li>• Programa de referidos más efectivo</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Conversion Funnel Overlay */}
              {activeOverlay === 'conversion-funnel' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Embudo de Conversión</h2>
                    <button
                      onClick={() => setActiveOverlay(null)}
                      className="text-slate-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <div className="w-48 h-64 bg-gradient-to-b from-purple-500 via-green-500 to-blue-500 opacity-80"
                          style={{ clipPath: 'polygon(15% 0%, 85% 0%, 70% 50%, 55% 100%, 45% 100%, 30% 50%)' }}>
                        </div>
                        <div className="absolute inset-0 flex flex-col justify-between items-center py-4 text-white font-semibold">
                          <div className="text-center">
                            <div className="text-2xl">100%</div>
                            <div className="text-sm">Registro</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl">46.4%</div>
                            <div className="text-sm">Solicitud</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg">39.2%</div>
                            <div className="text-sm">Viaje Atendido</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Análisis de Conversión</h3>
                      <div className="space-y-4">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-4 h-4 bg-purple-500 rounded"></div>
                            <span className="text-white font-medium">Registro (100%)</span>
                          </div>
                          <div className="text-sm text-slate-400">Base de usuarios registrados</div>
                          <div className="text-lg text-purple-400 font-semibold">1,250 usuarios</div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-white font-medium">Solicitud (46.4%)</span>
                          </div>
                          <div className="text-sm text-slate-400">Usuarios que solicitan viaje</div>
                          <div className="text-lg text-green-400 font-semibold">580 usuarios</div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span className="text-white font-medium">Viaje Atendido (39.2%)</span>
                          </div>
                          <div className="text-sm text-slate-400">Viajes completados exitosamente</div>
                          <div className="text-lg text-blue-400 font-semibold">490 viajes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <h4 className="text-green-400 font-semibold mb-2">Fortalezas</h4>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Alta tasa de conversión registro → solicitud</li>
                        <li>• Buen ratio de viajes completados</li>
                        <li>• Proceso de onboarding efectivo</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <h4 className="text-yellow-400 font-semibold mb-2">Oportunidades</h4>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Reducir abandono entre solicitud y viaje</li>
                        <li>• Mejorar disponibilidad de conductores</li>
                        <li>• Optimizar tiempos de respuesta</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Retention Comparison Overlay */}
              {activeOverlay === 'retention-comparison' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Comparativa de Retención</h2>
                    <button
                      onClick={() => setActiveOverlay(null)}
                      className="text-slate-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Retención 7 Días', value: 45, color: '#10B981' },
                        { name: 'Retención 30 Días', value: 25, color: '#F59E0B' }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Métricas de Retención</h3>
                      <div className="space-y-4">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-300">Retención 7 días</span>
                            <span className="text-green-400 font-semibold">45%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="bg-green-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">563 de 1,250 usuarios</div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-300">Retención 30 días</span>
                            <span className="text-yellow-400 font-semibold">25%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '25%' }}></div>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">313 de 1,250 usuarios</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Benchmarks del Sector</h3>
                      <div className="space-y-3">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-sm text-slate-400 mb-1">Promedio del sector</div>
                            <div className="text-lg text-blue-400 font-semibold">7 días: 38%</div>
                            <div className="text-lg text-blue-400 font-semibold">30 días: 22%</div>
                          </div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="text-center text-green-400 text-sm">
                            ✓ Por encima del promedio del sector
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <h4 className="text-yellow-400 font-semibold mb-2">Estrategias de Mejora</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Implementar programa de fidelización</li>
                      <li>• Notificaciones push personalizadas</li>
                      <li>• Ofertas especiales para usuarios inactivos</li>
                      <li>• Mejorar experiencia de usuario en primeros usos</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Panel de depuración de API */}
        {process.env.NODE_ENV === 'development' && (
          <ApiDebugPanel
            url={buildCurrentUrl()}
            data={apiData}
            loading={apiLoading}
            error={apiError}
            onRefetch={apiRefetch}
          />
        )}
      </div>
    </DashboardLayout>
  );
}