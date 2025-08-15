"use client";

import { useState, useEffect, useCallback } from "react";
import { getSalesData } from "@/lib/data";
import type { SalesDashboardData } from "@/lib/types";
import { Activity, TrendingUp, ShoppingCart, BarChart3, MapPin, Users } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
import { useVentasData } from "@/hooks/useApiData";
import ApiDebugPanel from "@/components/ui/ApiDebugPanel";

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

export default function VentasPage() {
  const [data, setData] = useState<SalesDashboardData | null>(null);
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
  } = useVentasData(true); // Auto-fetch enabled

  const fetchData = useCallback(() => {
    setIsLoading(true);
    // Convert global filters to the format expected by getSalesData
    const apiFilters = {
      aplicativo: filters.app,
      pais: filters.country,
      ciudad: filters.city,
      fechaInicio: "2025-07-01",
      fechaFin: "2025-07-31",
      establecimiento: filters.establishment,
      transaccional: !filters.includeNonTransactional,
    };

    Promise.resolve(getSalesData(apiFilters))
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sales data:", error);
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
          <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-slate-300">Cargando Dashboard de Ventas...</p>
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
  const getTopZones = () => {
    if (!apiData || apiData.length === 0) {
      return [
        { name: 'Centro Histórico', trips: 2400, color: '#8B5CF6' },
        { name: 'La Mariscal', trips: 1800, color: '#10B981' },
        { name: 'Cumbayá', trips: 1600, color: '#F59E0B' },
        { name: 'Parque La Carolina', trips: 1200, color: '#EF4444' },
        { name: 'González Suárez', trips: 800, color: '#3B82F6' }
      ];
    }

    // Agrupar datos por ciudad y calcular totales
    const cityData = {};
    apiData.forEach(record => {
      const city = record[6] || 'Sin especificar'; // ciudad
      const assignments = parseFloat(record[4]) || 0; // asignaciones_clean

      if (!cityData[city]) {
        cityData[city] = 0;
      }
      cityData[city] += assignments;
    });

    // Convertir a array y ordenar por cantidad
    const sortedCities = Object.entries(cityData)
      .map(([name, trips], index) => ({
        name,
        trips: trips,
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.trips - a.trips)
      .slice(0, 5);

    return sortedCities.length > 0 ? sortedCities : [
      { name: 'Centro Histórico', trips: 2400, color: '#8B5CF6' },
      { name: 'La Mariscal', trips: 1800, color: '#10B981' },
      { name: 'Cumbayá', trips: 1600, color: '#F59E0B' },
      { name: 'Parque La Carolina', trips: 1200, color: '#EF4444' },
      { name: 'González Suárez', trips: 800, color: '#3B82F6' }
    ];
  };

  const getSalesChannels = () => {
    if (!apiData || apiData.length === 0) {
      return [
        { name: 'App', value: 82, color: '#8B5CF6' },
        { name: 'Presencial', value: 15, color: '#10B981' },
        { name: 'Aeropuerto', value: 3, color: '#F59E0B' }
      ];
    }

    // Agrupar por canal de ventas
    const channelData = {};
    let total = 0;

    apiData.forEach(record => {
      const channel = record[9] || 'App'; // ventas_canal
      const assignments = parseFloat(record[4]) || 0; // asignaciones_clean

      if (!channelData[channel]) {
        channelData[channel] = 0;
      }
      channelData[channel] += assignments;
      total += assignments;
    });

    // Convertir a porcentajes
    const channels = Object.entries(channelData)
      .map(([name, count], index) => ({
        name: name === 'app' ? 'App' : name === 'presencial' ? 'Presencial' : name === 'aeropuerto' ? 'Aeropuerto' : name,
        value: total > 0 ? Math.round((count / total) * 100) : 0,
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);

    return channels.length > 0 ? channels : [
      { name: 'App', value: 82, color: '#8B5CF6' },
      { name: 'Presencial', value: 15, color: '#10B981' },
      { name: 'Aeropuerto', value: 3, color: '#F59E0B' }
    ];
  };

  const getDemandHours = () => {
    // Simular distribución horaria basada en asignaciones totales
    const totalAssignments = apiData ? getValue(apiData, 4) : 5650; // asignaciones_clean

    return [
      { hour: '06:00', demand: Math.round(totalAssignments * 0.21) },
      { hour: '12:00', demand: Math.round(totalAssignments * 0.17) },
      { hour: '18:00', demand: Math.round(totalAssignments * 0.29) },
      { hour: '22:00', demand: Math.round(totalAssignments * 0.33) }
    ];
  };

  // Datos dinámicos basados en el endpoint
  const topZones = getTopZones();
  const salesChannels = getSalesChannels();
  const demandHours = getDemandHours();

  // Prepare export data
  const exportData = apiData ? apiData.map((record, index) => ({
    tipo: 'Ventas',
    indice: index,
    ventasActivas: getValue(apiData, 4),
    solicitudes: getValue(apiData, 5),
    efectividad: getValue(apiData, 6),
    ticketPromedio: getValue(apiData, 7),
    conversion: getValue(apiData, 8),
    satisfaccion: getValue(apiData, 11)
  })) : [];

  // Prepare KPI data for alerts
  const kpiData = apiData ? {
    ventasActivas: getValue(apiData, 4),
    solicitudes: getValue(apiData, 5),
    efectividad: getValue(apiData, 6),
    ticketPromedio: getValue(apiData, 7),
    conversion: getValue(apiData, 8),
    satisfaccion: getValue(apiData, 11)
  } : {};

  return (
    <DashboardLayout
      title="Dashboard de Ventas y Uso"
      subtitle="Análisis de actividad comercial y patrones de uso"
      exportData={exportData}
      dashboardType="ventas"
      kpiData={kpiData}
    >
      <div className="space-y-8">
        {/* Compact Filters */}
        <CompactFilters />

        {/* Mostrar mensaje de error si hay error */}
        {apiError && (
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-6 text-red-400">⚠️</div>
              <span className="text-red-400 font-medium">Error al cargar datos de ventas</span>
            </div>
            <p className="text-slate-300 mb-4">
              Error de conexión: {apiError}. Verifique que el endpoint de ventas esté disponible.
            </p>
            <button
              onClick={apiRefetch}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
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
              <span className="text-slate-300 font-medium">No hay datos de ventas disponibles</span>
            </div>
            <p className="text-slate-300 mb-4">
              No se encontraron datos en el endpoint de ventas. Verifique los filtros aplicados o intente actualizar.
            </p>
            <button
              onClick={apiRefetch}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              Actualizar datos
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-300 font-medium">
                Actualizando datos de ventas...
              </span>
            </div>
          </div>
        ) : null}

        {/* Mostrar contenido solo si hay datos del endpoint o usar datos mock */}
        <div className="space-y-8">
          {/* Análisis Geográfico de Zonas Populares */}
          <DashboardSection
            title="Análisis Geográfico de Zonas Populares"
            subtitle="Distribución de viajes por ubicaciones más demandadas"
            icon={MapPin}
          >
            {/* Top 5 Zonas de Origen/Destino - Miniatura Mejorada */}
            <div
              className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-2 hover:border-purple-400 hover:shadow-purple-400/20 relative group"
              onClick={() => setActiveOverlay('top-zones')}
            >
              <div className="absolute top-4 right-4 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-semibold text-white">Top 5 Zonas de Origen/Destino</h3>
                <div className="w-4 h-4 text-blue-400">ℹ️</div>
              </div>

              {/* Gráfico de barras mejorado con etiquetas */}
              <div className="space-y-4">
                {topZones.map((zone, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-right">
                      <div className="text-sm font-medium text-white truncate">{zone.name}</div>
                    </div>
                    <div className="flex-1 relative">
                      <div className="w-full bg-slate-700/50 rounded-full h-6 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out relative"
                          style={{
                            backgroundColor: zone.color,
                            width: `${(zone.trips / Math.max(...topZones.map(z => z.trips))) * 100}%`,
                            boxShadow: `0 0 10px ${zone.color}40`
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        </div>
                      </div>
                      <div className="absolute right-2 top-0 h-6 flex items-center">
                        <span className="text-xs font-semibold text-white drop-shadow-lg">
                          {zone.trips.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="w-12 text-right">
                      <span className="text-xs text-slate-400">
                        {((zone.trips / topZones.reduce((sum, z) => sum + z.trips, 0)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen estadístico */}
              <div className="mt-6 pt-4 border-t border-slate-600/50">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total de viajes</span>
                  <span className="text-white font-semibold">
                    {topZones.reduce((sum, zone) => sum + zone.trips, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-center mt-4">
                <span className="text-xs text-slate-400 group-hover:text-purple-400 transition-colors">
                  Click para expandir análisis detallado
                </span>
              </div>
            </div>
          </DashboardSection>

          {/* Resumen de Actividad y Ventas */}
          <DashboardSection
            title="Resumen de Actividad y Ventas"
            subtitle="Indicadores clave de rendimiento comercial"
            icon={Activity}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg relative">
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 text-lg">🚶</span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-sm text-slate-400 mb-1">Usuarios Activos</div>
                  <div className="text-xs text-slate-500">Usuarios activos durante 7 días en el período</div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {apiData ? getValue(apiData, 10).toLocaleString() : '8750'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg relative">
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-lg">✅</span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-sm text-slate-400 mb-1">Solicitudes Atendidas</div>
                  <div className="text-xs text-slate-500">Solicitudes completadas exitosamente</div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {apiData ? getValue(apiData, 4).toLocaleString() : '15230'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg relative">
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 text-lg">💲</span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-sm text-slate-400 mb-1">Ticket Promedio por Viaje</div>
                  <div className="text-xs text-slate-500">Valor promedio en USD por cada viaje</div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  4
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg relative">
                <div className="mb-2">
                  <div className="text-sm text-slate-400 mb-1">Efectividad de Ventas</div>
                  <div className="text-xs text-slate-500">% de solicitudes que terminan en viajes exitosos</div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {apiData ? (getValue(apiData, 13) * 100).toFixed(0) : '85'}
                </div>
              </div>
            </div>
          </DashboardSection>

          {/* Análisis de Canales y Demanda */}
          <DashboardSection
            title="Análisis de Canales y Demanda"
            subtitle="Distribución de ventas y patrones de demanda temporal"
            icon={BarChart3}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ventas por Canal - Miniatura */}
              <div
                className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-2 hover:border-blue-400 hover:shadow-blue-400/20 relative group"
                onClick={() => setActiveOverlay('sales-channels')}
              >
                <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-white">Ventas por Canal</h3>
                  <div className="w-4 h-4 text-blue-400">ℹ️</div>
                </div>
                <div className="h-48 flex items-center justify-center">
                  <div className="relative w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={salesChannels}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name} (${value}%)`}
                          labelLine={false}
                        >
                          {salesChannels.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <span className="text-xs text-slate-400 group-hover:text-blue-400 transition-colors">
                    Click para expandir
                  </span>
                </div>
              </div>

              {/* Top Horas de Mayor Demanda - Miniatura */}
              <div
                className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-2 hover:border-green-400 hover:shadow-green-400/20 relative group"
                onClick={() => setActiveOverlay('demand-hours')}
              >
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-white">Top Horas de Mayor Demanda</h3>
                  <div className="w-4 h-4 text-blue-400">ℹ️</div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={demandHours}>
                      <XAxis dataKey="hour" fontSize={12} />
                      <YAxis hide />
                      <Bar dataKey="demand" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                  <span className="text-xs text-slate-400 group-hover:text-green-400 transition-colors">
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
              {/* Top Zones Overlay */}
              {activeOverlay === 'top-zones' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Top 5 Zonas de Origen/Destino</h2>
                    <button
                      onClick={() => setActiveOverlay(null)}
                      className="text-slate-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topZones} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9CA3AF" />
                        <YAxis type="category" dataKey="name" stroke="#9CA3AF" width={150} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="trips" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Análisis por Zona</h3>
                      <div className="space-y-3">
                        {topZones.map((zone, index) => (
                          <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white font-medium">{zone.name}</span>
                              <span className="text-purple-400 font-semibold">{zone.trips.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  backgroundColor: zone.color,
                                  width: `${(zone.trips / Math.max(...topZones.map(z => z.trips))) * 100}%`
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              {((zone.trips / topZones.reduce((sum, z) => sum + z.trips, 0)) * 100).toFixed(1)}% del total
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Insights Geográficos</h3>
                      <div className="space-y-4">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400 mb-1">Centro Histórico</div>
                            <div className="text-sm text-slate-300">Zona más demandada</div>
                            <div className="text-xs text-slate-400 mt-1">2,400 viajes mensuales</div>
                          </div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400 mb-1">8,800</div>
                            <div className="text-sm text-slate-300">Total de viajes</div>
                            <div className="text-xs text-slate-400 mt-1">En las top 5 zonas</div>
                          </div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400 mb-1">73%</div>
                            <div className="text-sm text-slate-300">Concentración</div>
                            <div className="text-xs text-slate-400 mt-1">Del total de viajes</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="text-purple-400 font-semibold mb-2">Estrategias de Optimización</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Aumentar disponibilidad de conductores en Centro Histórico</li>
                      <li>• Implementar tarifas dinámicas en zonas de alta demanda</li>
                      <li>• Desarrollar rutas optimizadas entre zonas populares</li>
                      <li>• Considerar puntos de espera estratégicos</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Sales Channels Overlay */}
              {activeOverlay === 'sales-channels' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Análisis de Ventas por Canal</h2>
                    <button
                      onClick={() => setActiveOverlay(null)}
                      className="text-slate-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-center">
                      <div className="relative w-64 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={salesChannels}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, value }) => `${name}\n${value}%`}
                              labelLine={false}
                            >
                              {salesChannels.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Distribución por Canal</h3>
                      <div className="space-y-4">
                        {salesChannels.map((channel, index) => (
                          <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: channel.color }}
                              ></div>
                              <span className="text-white font-medium">{channel.name}</span>
                              <span className="text-lg font-bold ml-auto" style={{ color: channel.color }}>
                                {channel.value}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  backgroundColor: channel.color,
                                  width: `${channel.value}%`
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              {channel.name === 'App' && 'Canal principal de ventas digitales'}
                              {channel.name === 'Presencial' && 'Solicitudes directas en la calle'}
                              {channel.name === 'Aeropuerto' && 'Servicios especializados de aeropuerto'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center bg-slate-700/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-400 mb-1">82%</div>
                      <div className="text-sm text-slate-300">App Móvil</div>
                      <div className="text-xs text-slate-400 mt-1">Canal dominante</div>
                    </div>
                    <div className="text-center bg-slate-700/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400 mb-1">15%</div>
                      <div className="text-sm text-slate-300">Presencial</div>
                      <div className="text-xs text-slate-400 mt-1">Mercado tradicional</div>
                    </div>
                    <div className="text-center bg-slate-700/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-yellow-400 mb-1">3%</div>
                      <div className="text-sm text-slate-300">Aeropuerto</div>
                      <div className="text-xs text-slate-400 mt-1">Nicho especializado</div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-blue-400 font-semibold mb-2">Estrategias por Canal</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• <strong>App:</strong> Optimizar UX y añadir funcionalidades premium</li>
                      <li>• <strong>Presencial:</strong> Mejorar visibilidad en zonas de alta demanda</li>
                      <li>• <strong>Aeropuerto:</strong> Expandir servicios especializados</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Demand Hours Overlay */}
              {activeOverlay === 'demand-hours' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Top Horas de Mayor Demanda</h2>
                    <button
                      onClick={() => setActiveOverlay(null)}
                      className="text-slate-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={demandHours}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="hour" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="demand" fill="#10B981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Picos de Demanda</h3>
                      <div className="space-y-3">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">22:00 - Noche</span>
                            <span className="text-green-400 font-semibold">1,850 solicitudes</span>
                          </div>
                          <div className="text-sm text-slate-400 mt-1">Pico máximo - Vida nocturna</div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">18:00 - Tarde</span>
                            <span className="text-blue-400 font-semibold">1,650 solicitudes</span>
                          </div>
                          <div className="text-sm text-slate-400 mt-1">Salida del trabajo</div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">06:00 - Mañana</span>
                            <span className="text-purple-400 font-semibold">1,200 solicitudes</span>
                          </div>
                          <div className="text-sm text-slate-400 mt-1">Inicio de jornada laboral</div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">12:00 - Mediodía</span>
                            <span className="text-yellow-400 font-semibold">950 solicitudes</span>
                          </div>
                          <div className="text-sm text-slate-400 mt-1">Hora de almuerzo</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Análisis Temporal</h3>
                      <div className="space-y-4">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400 mb-1">5,650</div>
                            <div className="text-sm text-slate-300">Total de solicitudes</div>
                            <div className="text-xs text-slate-400 mt-1">En horas pico</div>
                          </div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400 mb-1">95%</div>
                            <div className="text-sm text-slate-300">Tasa de atención</div>
                            <div className="text-xs text-slate-400 mt-1">En horarios pico</div>
                          </div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400 mb-1">3.2 min</div>
                            <div className="text-sm text-slate-300">Tiempo promedio</div>
                            <div className="text-xs text-slate-400 mt-1">De espera en picos</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-2">Optimizaciones Recomendadas</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Aumentar flota disponible entre 18:00-22:00</li>
                      <li>• Implementar tarifas dinámicas en horas pico</li>
                      <li>• Pre-posicionar conductores en zonas de alta demanda</li>
                      <li>• Ofrecer incentivos para conductores en horarios críticos</li>
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