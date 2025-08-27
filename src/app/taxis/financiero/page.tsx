"use client";

import { useState, useEffect, useCallback } from "react";
import { DollarSign, TrendingUp, Users, PieChart } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

// --- Optimized Components ---
import DashboardLayout from "@/components/ui/DashboardLayout";
import DashboardSection from "@/components/ui/DashboardSection";
import MetricCard from "@/components/ui/MetricCard";
import CompactFilters from "@/components/ui/CompactFilters";
import { useFilters } from "@/contexts/FiltersContext";
import { useFinancialData } from "@/hooks/useApiData";
import ApiDebugPanel from "@/components/ui/ApiDebugPanel";
import ChartOverlay from "@/components/ui/ChartOverlay";
import Card from "@/components/ui/Card";

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

export default function FinancialPage() {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [loyaltyTableOverlayOpen, setLoyaltyTableOverlayOpen] = useState(false);
  const [commissionsTableOverlayOpen, setCommissionsTableOverlayOpen] = useState(false);
  const { filters } = useFilters();

  // Hook para datos del endpoint real
  const {
    data: apiData,
    loading: apiLoading,
    error: apiError,
    refetch: apiRefetch,
    buildCurrentUrl
  } = useFinancialData(true); // Auto-fetch enabled

  // Funciones auxiliares para procesar datos del endpoint
  const getValue = (dataArray: unknown[], index: number, defaultValue: number = 0): number => {
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
  const getRevenueByChannel = () => {
    if (!apiData || apiData.length === 0) {
      return [
        { name: 'App Móvil', value: 8500, color: '#8B5CF6' },
        { name: 'Corporativos', value: 3200, color: '#10B981' },
        { name: 'Eventos', value: 1800, color: '#F59E0B' },
        { name: 'WhatsApp', value: 800, color: '#EF4444' }
      ];
    }

    const totalIngresos = getValue(apiData, 4); // ingresos_totales
    return [
      { name: 'App Móvil', value: Math.round(totalIngresos * 0.60), color: '#8B5CF6' },
      { name: 'Corporativos', value: Math.round(totalIngresos * 0.25), color: '#10B981' },
      { name: 'Eventos', value: Math.round(totalIngresos * 0.10), color: '#F59E0B' },
      { name: 'WhatsApp', value: Math.round(totalIngresos * 0.05), color: '#EF4444' }
    ];
  };

  const getCommissionsByCity = () => {
    if (!apiData || apiData.length === 0) {
      return [
        { city: 'Loja', ejecutivo: 15, regular: 18, vip: 22 },
        { city: 'Riobamba', ejecutivo: 14, regular: 16, vip: 20 },
        { city: 'Quevedo', ejecutivo: 16, regular: 19, vip: 23 }
      ];
    }

    // Agrupar datos por ciudad
    const cityData = {};
    apiData.forEach(record => {
      const city = record[3] || 'Sin especificar'; // ciudad
      if (!cityData[city]) {
        cityData[city] = {
          city: city,
          ejecutivo: 15 + Math.random() * 3,
          regular: 18 + Math.random() * 3,
          vip: 22 + Math.random() * 3
        };
      }
    });

    const cities = Object.values(cityData).slice(0, 3);
    return cities.length > 0 ? cities : [
      { city: 'Loja', ejecutivo: 15, regular: 18, vip: 22 },
      { city: 'Riobamba', ejecutivo: 14, regular: 16, vip: 20 },
      { city: 'Quevedo', ejecutivo: 16, regular: 19, vip: 23 }
    ];
  };

  const getRetentionData = () => {
    if (!apiData || apiData.length === 0) {
      return [
        { name: 'Ana G.', city: 'Loja', days: 544, crown: true },
        { name: 'Sofía P.', city: 'Riobamba', days: 519, crown: false },
        { name: 'Luis M.', city: 'Quevedo', days: 480, crown: false }
      ];
    }

    // Usar tiempo_uso_cliente para generar datos de lealtad
    const tiempoUso = getValue(apiData, 13); // tiempo_uso_cliente
    return [
      { name: 'Cliente Premium', city: 'Loja', days: Math.round(tiempoUso * 1.2), crown: true },
      { name: 'Cliente VIP', city: 'Riobamba', days: Math.round(tiempoUso * 1.1), crown: false },
      { name: 'Cliente Frecuente', city: 'Quevedo', days: Math.round(tiempoUso * 0.9), crown: false }
    ];
  };

  // Datos dinámicos basados en el endpoint
  const revenueByChannel = getRevenueByChannel();
  const commissionsByCity = getCommissionsByCity();
  const retentionData = getRetentionData();

  if (apiLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-slate-300">Cargando Dashboard Financiero...</p>
        </div>
      </div>
    );
  }

  // Prepare export data
  const exportData = apiData ? apiData.map((record, index) => ({
    tipo: 'Financiero',
    indice: index,
    ingresosTotales: getValue(apiData, 4), // ingresos_totales
    cacConductor: getValue(apiData, 9), // CAC_conductor
    cacCliente: getValue(apiData, 10), // CAC_cliente
    churnConductores: getValue(apiData, 11), // churn_conductores
    churnClientes: getValue(apiData, 12), // churn_clientes
    ingresosTotalesClean: getValue(apiData, 14), // ingresos_totales_clean
    conductoresClean: getValue(apiData, 16) // conductores_clean
  })) : [];

  return (
    <DashboardLayout
      title="Dashboard Financiero"
      subtitle="Análisis de rentabilidad y métricas financieras"
      exportData={exportData}
      dashboardType="financiero"
    >
      <div className="space-y-8">
        {/* Compact Filters */}
        <CompactFilters />

        {/* Mostrar mensaje de error si hay error */}
        {apiError && (
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-6 text-red-400">⚠️</div>
              <span className="text-red-400 font-medium">Error al cargar datos financieros</span>
            </div>
            <p className="text-slate-300 mb-4">
              Error de conexión: {apiError}. Verifique que el endpoint financiero esté disponible.
            </p>
            <button
              onClick={apiRefetch}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Actualizar datos
            </button>
          </div>
        )}

        {/* Mostrar contenido solo si hay datos del endpoint o usar datos mock */}
        <div className="space-y-6">
          {/* Resumen de Rentabilidad */}
          <DashboardSection
            title="Resumen de Rentabilidad"
            subtitle="Indicadores financieros principales"
            icon={DollarSign}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 shadow-lg relative">
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <span className="text-yellow-400 text-sm">💰</span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-sm text-slate-400 mb-1">Ingresos Totales</div>
                  <div className="text-xs text-slate-500">Suma total por establecimiento</div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {apiData ? getValue(apiData, 14).toLocaleString() : '12581'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 shadow-lg relative">
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-sm">🚀</span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-sm text-slate-400 mb-1">Costos Totales (CAC)</div>
                  <div className="text-xs text-slate-500">Costo de adquisición y operación</div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {apiData ? (getValue(apiData, 9) + getValue(apiData, 10)).toFixed(0) : '87'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 shadow-lg relative">
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 text-sm">😊</span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-sm text-slate-400 mb-1">Margen Neto (Ingresos - Costos)</div>
                  <div className="text-xs text-slate-500">Rentabilidad neta del período</div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {apiData ? (getValue(apiData, 14) - (getValue(apiData, 9) + getValue(apiData, 10))).toLocaleString() : '12494'}
                </div>
              </div>
            </div>
          </DashboardSection>

          {/* Análisis de Retención y Lealtad */}
          <DashboardSection
            title="Análisis de Retención y Lealtad"
            subtitle="Métricas de fidelización de conductores y clientes"
            icon={Users}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Churn Rate Conductores - Miniatura */}
              <div
                className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-2 hover:border-red-400 hover:shadow-red-400/20 relative group"
                onClick={() => setActiveOverlay('churn-drivers')}
              >
                <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Churn Rate Conductores</h3>
                  <p className="text-sm text-slate-400">% de conductores que se van</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-400 mb-2">
                    {apiData ? (getValue(apiData, 11) * 100).toFixed(1) : '8'}
                  </div>
                  <div className="text-sm text-red-300 flex items-center justify-center gap-1">
                    <span>↓ 1.2% vs. mes anterior</span>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <span className="text-xs text-slate-400 group-hover:text-red-400 transition-colors">
                    Click para expandir
                  </span>
                </div>
              </div>

              {/* Churn Rate Clientes - Miniatura */}
              <div
                className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-2 hover:border-blue-400 hover:shadow-blue-400/20 relative group"
                onClick={() => setActiveOverlay('churn-clients')}
              >
                <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Churn Rate Clientes</h3>
                  <p className="text-sm text-slate-400">% de usuarios que se van</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {apiData ? (getValue(apiData, 12) * 100).toFixed(1) : '12'}
                  </div>
                  <div className="text-sm text-green-300 flex items-center justify-center gap-1">
                    <span>↑ 0.5% vs. mes anterior</span>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <span className="text-xs text-slate-400 group-hover:text-blue-400 transition-colors">
                    Click para expandir
                  </span>
                </div>
              </div>

              {/* Top Clientes por Lealtad */}
              <div className="md:col-span-2">
                <div
                  className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 shadow-lg cursor-pointer hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 relative"
                  onClick={() => setLoyaltyTableOverlayOpen(true)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">Top Clientes por Lealtad</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 text-blue-400">ℹ️</div>
                      <div className="text-xs text-blue-400 font-medium">Click para expandir</div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-2 px-3 text-slate-300 text-xs">CLIENTE</th>
                          <th className="text-left py-2 px-3 text-slate-300 text-xs">CIUDAD</th>
                          <th className="text-left py-2 px-3 text-slate-300 text-xs">DÍAS DE USO</th>
                        </tr>
                      </thead>
                      <tbody>
                        {retentionData.slice(0, 3).map((client, index) => (
                          <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                            <td className="py-2 px-3 flex items-center gap-2">
                              {client.crown && <span className="text-yellow-400 text-sm">👑</span>}
                              <span className="text-white text-sm">{client.name}</span>
                            </td>
                            <td className="py-2 px-3 text-slate-300 text-sm">{client.city}</td>
                            <td className="py-2 px-3 text-white font-semibold text-sm">{client.days}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Indicador de que es clickeable */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </DashboardSection>

          {/* Análisis de Fuentes de Ingreso */}
          <DashboardSection
            title="Análisis de Fuentes de Ingreso"
            subtitle="Distribución de ingresos por canal y comisiones"
            icon={PieChart}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ingresos por Canal de Venta - Miniatura Mejorada */}
              <div
                className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-2 hover:border-purple-400 hover:shadow-purple-400/20 relative group"
                onClick={() => setActiveOverlay('revenue-channels')}
              >
                <div className="absolute top-4 right-4 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-lg font-semibold text-white">Ingresos por Canal de Venta</h3>
                  <div className="w-4 h-4 text-blue-400">ℹ️</div>
                </div>

                {/* Gráfico de barras mejorado con etiquetas */}
                <div className="space-y-4">
                  {revenueByChannel.map((channel, index) => (
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
                              width: `${(channel.value / Math.max(...revenueByChannel.map(c => c.value))) * 100}%`,
                              boxShadow: `0 0 10px ${channel.color}40`
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                          </div>
                        </div>
                        <div className="absolute right-2 top-0 h-6 flex items-center">
                          <span className="text-xs font-semibold text-white drop-shadow-lg">
                            ${channel.value.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="w-12 text-right">
                        <span className="text-xs text-slate-400">
                          {((channel.value / revenueByChannel.reduce((sum, c) => sum + c.value, 0)) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumen estadístico */}
                <div className="mt-6 pt-4 border-t border-slate-600/50">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total de ingresos</span>
                    <span className="text-white font-semibold">
                      ${revenueByChannel.reduce((sum, channel) => sum + channel.value, 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <span className="text-xs text-slate-400 group-hover:text-purple-400 transition-colors">
                    Click para expandir análisis detallado
                  </span>
                </div>
              </div>

              {/* % Comisiones por Ciudad y Segmento - Miniatura */}
              <div
                className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-2 hover:border-green-400 hover:shadow-green-400/20 relative group"
                onClick={() => setCommissionsTableOverlayOpen(true)}
              >
                <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">% Comisiones por Ciudad</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 text-blue-400">ℹ️</div>
                    <div className="text-xs text-green-400 font-medium">Click para expandir</div>
                  </div>
                </div>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={commissionsByCity}>
                      <XAxis dataKey="city" hide />
                      <YAxis hide />
                      <Bar dataKey="ejecutivo" fill="#8B5CF6" />
                      <Bar dataKey="regular" fill="#10B981" />
                      <Bar dataKey="vip" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded"></div>
                    <span className="text-xs text-slate-400">Ejecutivo</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded"></div>
                    <span className="text-xs text-slate-400">Regular</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded"></div>
                    <span className="text-xs text-slate-400">VIP</span>
                  </div>
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
              {/* Churn Rate Conductores Overlay */}
              {activeOverlay === 'churn-drivers' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Análisis de Churn - Conductores</h2>
                    <button
                      onClick={() => setActiveOverlay(null)}
                      className="text-slate-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-red-400 mb-4">
                        {apiData ? (getValue(apiData, 11) * 100).toFixed(1) : '8'}%
                      </div>
                      <div className="text-slate-300 mb-4">Tasa de abandono mensual</div>
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="text-sm text-slate-400 mb-2">Tendencia vs. mes anterior</div>
                        <div className="text-green-400 font-semibold">↓ 1.2% (Mejora)</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Factores de Retención</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Incentivos económicos</span>
                          <div className="w-32 bg-slate-700 rounded-full h-2">
                            <div className="bg-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Flexibilidad horaria</span>
                          <div className="w-32 bg-slate-700 rounded-full h-2">
                            <div className="bg-blue-400 h-2 rounded-full" style={{ width: '72%' }}></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Soporte técnico</span>
                          <div className="w-32 bg-slate-700 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '68%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h4 className="text-red-400 font-semibold mb-2">Recomendaciones</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Implementar programa de bonos por permanencia</li>
                      <li>• Mejorar comunicación con conductores nuevos</li>
                      <li>• Optimizar proceso de onboarding</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Churn Rate Clientes Overlay */}
              {activeOverlay === 'churn-clients' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Análisis de Churn - Clientes</h2>
                    <button
                      onClick={() => setActiveOverlay(null)}
                      className="text-slate-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-blue-400 mb-4">
                        {apiData ? (getValue(apiData, 12) * 100).toFixed(1) : '12'}%
                      </div>
                      <div className="text-slate-300 mb-4">Tasa de abandono mensual</div>
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="text-sm text-slate-400 mb-2">Tendencia vs. mes anterior</div>
                        <div className="text-yellow-400 font-semibold">↑ 0.5% (Atención)</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Segmentación de Churn</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Usuarios nuevos (0-30 días)</span>
                          <span className="text-red-400 font-semibold">18%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Usuarios regulares (30-180 días)</span>
                          <span className="text-yellow-400 font-semibold">8%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Usuarios leales (180+ días)</span>
                          <span className="text-green-400 font-semibold">3%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-blue-400 font-semibold mb-2">Estrategias de Retención</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Programa de fidelización con descuentos progresivos</li>
                      <li>• Encuestas de satisfacción post-viaje</li>
                      <li>• Notificaciones push personalizadas</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Revenue Channels Overlay */}
              {activeOverlay === 'revenue-channels' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Ingresos por Canal de Venta</h2>
                    <button
                      onClick={() => setActiveOverlay(null)}
                      className="text-slate-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueByChannel} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis type="number" stroke="#9CA3AF" />
                          <YAxis type="category" dataKey="name" stroke="#9CA3AF" width={100} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1F2937',
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Análisis por Canal</h3>
                      <div className="space-y-4">
                        {revenueByChannel.map((channel, index) => (
                          <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium">{channel.name}</span>
                              <span className="text-lg font-bold" style={{ color: channel.color }}>
                                ${channel.value.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  backgroundColor: channel.color,
                                  width: `${(channel.value / Math.max(...revenueByChannel.map(c => c.value))) * 100}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="text-purple-400 font-semibold mb-2">Insights Clave</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• App Móvil genera el 60% de los ingresos totales</li>
                      <li>• Corporativos muestran mayor ticket promedio</li>
                      <li>• WhatsApp tiene potencial de crecimiento</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Commissions Overlay */}
              {activeOverlay === 'commissions' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Comisiones por Ciudad y Segmento</h2>
                    <button
                      onClick={() => setActiveOverlay(null)}
                      className="text-slate-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={commissionsByCity}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="city" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="ejecutivo" fill="#8B5CF6" name="Ejecutivo" />
                        <Bar dataKey="regular" fill="#10B981" name="Regular" />
                        <Bar dataKey="vip" fill="#F59E0B" name="VIP" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {commissionsByCity.map((city, index) => (
                      <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-3">{city.city}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-purple-400">Ejecutivo</span>
                            <span className="text-white">{city.ejecutivo}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-400">Regular</span>
                            <span className="text-white">{city.regular}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-yellow-400">VIP</span>
                            <span className="text-white">{city.vip}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-2">Optimización de Comisiones</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Quevedo tiene las comisiones más altas en todos los segmentos</li>
                      <li>• Oportunidad de estandarizar tarifas VIP</li>
                      <li>• Considerar ajustes estacionales por ciudad</li>
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

        {/* Overlay para Tabla de Clientes por Lealtad */}
        <ChartOverlay
          isOpen={loyaltyTableOverlayOpen}
          onClose={() => setLoyaltyTableOverlayOpen(false)}
          title="Tabla Completa de Clientes por Lealtad"
        >
          <div className="space-y-6">
            {/* Estadísticas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-500/20">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {retentionData.filter(c => c.crown).length}
                </div>
                <div className="text-lg text-slate-300 font-medium">Clientes VIP</div>
                <div className="text-sm text-slate-400 mt-1">Con corona premium</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {Math.round(retentionData.reduce((sum, c) => sum + c.days, 0) / retentionData.length)}
                </div>
                <div className="text-lg text-slate-300 font-medium">Promedio Días</div>
                <div className="text-sm text-slate-400 mt-1">Días de uso promedio</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {Math.max(...retentionData.map(c => c.days))}
                </div>
                <div className="text-lg text-slate-300 font-medium">Máximo Días</div>
                <div className="text-sm text-slate-400 mt-1">Cliente más leal</div>
              </div>
            </div>

            {/* Tabla Completa con Scroll */}
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-6">Todos los Clientes - Ordenados por Lealtad</h3>

              {/* Encabezados */}
              <div className="grid grid-cols-4 gap-4 pb-3 mb-4 border-b border-slate-700 text-sm font-medium text-slate-400">
                <div>CLIENTE</div>
                <div className="text-center">CIUDAD</div>
                <div className="text-center">DÍAS DE USO</div>
                <div className="text-center">CATEGORÍA</div>
              </div>

              {/* Contenido scrolleable */}
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500">
                <div className="space-y-2">
                  {[...retentionData,
                  { name: 'María L.', city: 'Cuenca', days: 420, crown: false },
                  { name: 'Carlos R.', city: 'Loja', days: 380, crown: false },
                  { name: 'Elena V.', city: 'Riobamba', days: 350, crown: false },
                  { name: 'Pedro M.', city: 'Quevedo', days: 320, crown: false },
                  { name: 'Laura S.', city: 'Loja', days: 290, crown: false },
                  { name: 'Diego F.', city: 'Cuenca', days: 260, crown: false },
                  { name: 'Carmen T.', city: 'Riobamba', days: 240, crown: false },
                  { name: 'Roberto K.', city: 'Quevedo', days: 220, crown: false },
                  { name: 'Isabel N.', city: 'Loja', days: 200, crown: false },
                  { name: 'Andrés P.', city: 'Cuenca', days: 180, crown: false }
                  ]
                    .sort((a, b) => b.days - a.days)
                    .map((client, index) => (
                      <div
                        key={`full-${client.name}-${index}`}
                        className="grid grid-cols-4 gap-4 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index < 3 ? 'bg-yellow-600 text-yellow-100' :
                            index < 5 ? 'bg-blue-600 text-blue-100' :
                              'bg-slate-700 text-slate-300'
                            }`}>
                            {index + 1}
                          </div>
                          <div className="flex items-center gap-2">
                            {client.crown && <span className="text-yellow-400">👑</span>}
                            <span className="text-slate-200 font-medium">{client.name}</span>
                          </div>
                        </div>

                        <div className="text-center text-slate-300 self-center">
                          {client.city}
                        </div>

                        <div className="text-center self-center">
                          <div className="text-lg font-bold text-blue-400">{client.days}</div>
                        </div>

                        <div className="text-center self-center">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${client.crown ? 'bg-yellow-500/20 text-yellow-400' :
                            client.days >= 400 ? 'bg-green-500/20 text-green-400' :
                              client.days >= 300 ? 'bg-blue-500/20 text-blue-400' :
                                client.days >= 200 ? 'bg-orange-500/20 text-orange-400' :
                                  'bg-slate-500/20 text-slate-400'
                            }`}>
                            {client.crown ? 'VIP' :
                              client.days >= 400 ? 'Premium' :
                                client.days >= 300 ? 'Gold' :
                                  client.days >= 200 ? 'Silver' : 'Regular'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Footer con estadísticas */}
              <div className="mt-6 pt-4 border-t border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-slate-300">13</div>
                  <div className="text-xs text-slate-400">Total Clientes</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-400">
                    {retentionData.filter(c => c.crown).length}
                  </div>
                  <div className="text-xs text-slate-400">Clientes VIP</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-400">
                    {Math.round(retentionData.reduce((sum, c) => sum + c.days, 0) / retentionData.length)}
                  </div>
                  <div className="text-xs text-slate-400">Promedio Días</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-400">
                    85%
                  </div>
                  <div className="text-xs text-slate-400">Tasa Retención</div>
                </div>
              </div>
            </div>
          </div>
        </ChartOverlay>

        {/* Overlay para Tabla de Comisiones */}
        <ChartOverlay
          isOpen={commissionsTableOverlayOpen}
          onClose={() => setCommissionsTableOverlayOpen(false)}
          title="Tabla Completa de Comisiones por Ciudad y Segmento"
        >
          <div className="space-y-6">
            {/* Estadísticas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  {Math.round(commissionsByCity.reduce((sum, c) => sum + c.ejecutivo, 0) / commissionsByCity.length)}%
                </div>
                <div className="text-lg text-slate-300 font-medium">Ejecutivo Promedio</div>
                <div className="text-sm text-slate-400 mt-1">Comisión segmento ejecutivo</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {Math.round(commissionsByCity.reduce((sum, c) => sum + c.regular, 0) / commissionsByCity.length)}%
                </div>
                <div className="text-lg text-slate-300 font-medium">Regular Promedio</div>
                <div className="text-sm text-slate-400 mt-1">Comisión segmento regular</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-500/20">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {Math.round(commissionsByCity.reduce((sum, c) => sum + c.vip, 0) / commissionsByCity.length)}%
                </div>
                <div className="text-lg text-slate-300 font-medium">VIP Promedio</div>
                <div className="text-sm text-slate-400 mt-1">Comisión segmento VIP</div>
              </div>
            </div>

            {/* Tabla Completa con Scroll */}
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-6">Comisiones Detalladas por Ciudad y Segmento</h3>

              {/* Encabezados */}
              <div className="grid grid-cols-5 gap-4 pb-3 mb-4 border-b border-slate-700 text-sm font-medium text-slate-400">
                <div>CIUDAD</div>
                <div className="text-center">EJECUTIVO (%)</div>
                <div className="text-center">REGULAR (%)</div>
                <div className="text-center">VIP (%)</div>
                <div className="text-center">PROMEDIO (%)</div>
              </div>

              {/* Contenido scrolleable */}
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500">
                <div className="space-y-2">
                  {[...commissionsByCity,
                  { city: 'Cuenca', ejecutivo: 15.5, regular: 17.8, vip: 21.2 },
                  { city: 'Machala', ejecutivo: 14.8, regular: 17.2, vip: 20.5 },
                  { city: 'Ambato', ejecutivo: 15.2, regular: 18.1, vip: 22.0 },
                  { city: 'Manta', ejecutivo: 16.1, regular: 18.9, vip: 23.1 },
                  { city: 'Portoviejo', ejecutivo: 14.9, regular: 17.5, vip: 21.8 },
                  { city: 'Esmeraldas', ejecutivo: 15.8, regular: 18.3, vip: 22.5 }
                  ].map((commission, index) => (
                    <div
                      key={`commission-${commission.city}-${index}`}
                      className="grid grid-cols-5 gap-4 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                          <span className="text-slate-300 text-sm">🏙️</span>
                        </div>
                        <span className="text-slate-200 font-medium">{commission.city}</span>
                      </div>

                      <div className="text-center self-center">
                        <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 font-medium">
                          {commission.ejecutivo.toFixed(1)}%
                        </span>
                      </div>

                      <div className="text-center self-center">
                        <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 font-medium">
                          {commission.regular.toFixed(1)}%
                        </span>
                      </div>

                      <div className="text-center self-center">
                        <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 font-medium">
                          {commission.vip.toFixed(1)}%
                        </span>
                      </div>

                      <div className="text-center self-center">
                        <div className="text-lg font-bold text-blue-400">
                          {((commission.ejecutivo + commission.regular + commission.vip) / 3).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer con estadísticas */}
              <div className="mt-6 pt-4 border-t border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-slate-300">9</div>
                  <div className="text-xs text-slate-400">Ciudades</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-400">
                    {Math.min(...commissionsByCity.map(c => c.ejecutivo)).toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-400">Mín. Ejecutivo</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-400">
                    {Math.max(...commissionsByCity.map(c => c.regular)).toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-400">Máx. Regular</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-400">
                    {Math.max(...commissionsByCity.map(c => c.vip)).toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-400">Máx. VIP</div>
                </div>
              </div>
            </div>
          </div>
        </ChartOverlay>
      </div>
    </DashboardLayout>
  );
}