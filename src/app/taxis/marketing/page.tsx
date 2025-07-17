"use client";

import { useState, useEffect, useCallback } from "react";
import { getMarketingData } from "@/lib/data";
import type { MarketingDashboardData, FilterOptions } from "@/lib/types";

// --- Components ---
import DashboardLayout from "@/components/layouts/DashboardLayout";
import MetricCard from "@/components/ui/MetricCard";
import HeaderFilters from "@/components/ui/HeaderFilters";
import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";

// --- Dynamic Imports for Charts ---
const ChartLoader = () => (
  <Card className="flex items-center justify-center h-full min-h-[350px]">
    <p className="text-slate-500 dark:text-slate-400">Cargando...</p>
  </Card>
);

const ConversionFunnelChart = dynamic(
  () => import("@/components/dashboards/marketing/ConversionFunnelChart"),
  { ssr: false, loading: () => <ChartLoader /> }
);
const RetentionBarChart = dynamic(
  () => import("@/components/dashboards/marketing/RetentionBarChart"),
  { ssr: false, loading: () => <ChartLoader /> }
);
// Corregimos el nombre del import para que coincida con el componente que creamos
const AcquisitionChannelChart = dynamic(
  () => import("@/components/dashboards/marketing/AcquisitionChannelChart"),
  { ssr: false, loading: () => <ChartLoader /> }
);
const CacTrendChart = dynamic(
  () => import("@/components/dashboards/marketing/CacTrendChart"),
  { ssr: false, loading: () => <ChartLoader /> }
);
const ActivityByTimeRangeChart = dynamic(
  () => import("@/components/dashboards/marketing/ActivityByTimeRangeChart"),
  { ssr: false, loading: () => <ChartLoader /> }
);
const EngagementRateChart = dynamic(
  () => import("@/components/dashboards/marketing/EngagementRateChart"),
  { ssr: false, loading: () => <ChartLoader /> }
);

export default function MarketingPage() {
  const [data, setData] = useState<MarketingDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    aplicativo: "Clipp",
    pais: "Ecuador",
    ciudad: "Loja",
    fechaInicio: "2025-07-01",
    fechaFin: "2025-07-31",
    transaccional: true,
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMarketingData(filters);
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Cargando Dashboard de Marketing...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <DashboardLayout
      title="Dashboard de Marketing y Crecimiento"
      description="Análisis 360° del ciclo de vida del usuario."
      filters={
        <HeaderFilters
          initialFilters={filters}
          onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
        />
      }
      onUpdateClick={fetchData}
    >
      {isLoading ? (
        <div className="py-10 text-center text-slate-500 dark:text-slate-400">
          Actualizando datos...
        </div>
      ) : (
        <div className="space-y-12">
          {/* === SECCIÓN 1: KPIs Principales (Resumen Ejecutivo) === */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard {...data.kpis.registradosNuevos} />
              <MetricCard {...data.kpis.cac} />
              <MetricCard {...data.kpis.efectividadNuevos} />
              <MetricCard {...data.kpis.abrenYNoPiden} />
            </div>
          </section>

          {/* === SECCIÓN 2: Análisis de Adquisición y Costos === */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              Análisis de Costo de Adquisición (CAC)
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AcquisitionChannelChart data={data.canalesAdquisicion} />
              <CacTrendChart data={data.cacHistorico} />
            </div>
          </section>

          {/* === SECCIÓN 3: Análisis de Conversión y Retención === */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              Análisis de Conversión y Retención
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ConversionFunnelChart data={data.embudoConversion} />
              <RetentionBarChart
                retencion7dias={data.kpis.retencion7dias.value as number}
                retencion30dias={data.kpis.retencion30dias.value as number}
              />
            </div>
          </section>

          {/* === SECCIÓN 4: Análisis de Comportamiento e Interacción === */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              Análisis de Comportamiento e Interacción
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ActivityByTimeRangeChart data={data.aperturaPorFranja} />
              </div>
              <div className="lg:col-span-1">
                <EngagementRateChart
                  opens={data.tasaInteraccion.opens}
                  interactions={data.tasaInteraccion.interactions}
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}
