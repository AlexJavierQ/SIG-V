"use client";

import { useState, useEffect, useCallback } from "react";
import { getOperationalData } from "@/lib/data";
import type { OperationalData, FilterOptions } from "@/lib/types";

// --- Layout & UI Components ---
import DashboardLayout from "@/components/layouts/DashboardLayout";
import MetricCard from "@/components/ui/MetricCard";
import HeaderFilters from "@/components/ui/HeaderFilters";
import Card from "@/components/ui/Card";
import dynamic from "next/dynamic";

// --- Dynamic Imports for Charts ---
const ChartLoader = () => (
  <Card className="flex items-center justify-center h-full min-h-[350px]">
    <p className="text-slate-500 dark:text-slate-400">Cargando gráfico...</p>
  </Card>
);

const DriverActivityBarChart = dynamic(
  () => import("@/components/charts/DriverActivityBarChart"),
  { ssr: false, loading: () => <ChartLoader /> }
);
const RankingChart = dynamic(() => import("@/components/charts/RankingChart"), {
  ssr: false,
  loading: () => <ChartLoader />,
});
const SolicitudesChart = dynamic(
  () => import("@/components/charts/SolicitudesChart"),
  { ssr: false, loading: () => <ChartLoader /> }
);
const TimeSeriesChart = dynamic(
  () => import("@/components/charts/TimeSeriesChart"),
  { ssr: false, loading: () => <ChartLoader /> }
);
const CancellationRateTable = dynamic(
  () => import("@/components/charts/CancellationRateTable"),
  { ssr: false, loading: () => <ChartLoader /> }
);

export default function OperacionalPage() {
  const [data, setData] = useState<OperationalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    aplicativo: "Clipp",
    pais: "Ecuador",
    ciudad: "Loja",
    fechaInicio: "2025-07-01",
    fechaFin: "2025-07-31",
    establecimiento: "",
    transaccional: true,
  });

  const fetchData = useCallback(() => {
    setIsLoading(true);
    // Usamos Promise.resolve para mantener la asincronía con los datos locales
    Promise.resolve(getOperationalData(filters)).then((data) => {
      setData(data);
      setIsLoading(false);
    });
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!data && isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Cargando Dashboard Operativo...
        </p>
      </div>
    );
  }

  if (!data) return null; // Guard para TypeScript una vez que la carga inicial ha pasado

  const { correctas: exitosos, erroneas: fallidos } = data.solicitudesDonut;

  return (
    <DashboardLayout
      title="Dashboard Operativo"
      description="Análisis estratégico del desempeño del servicio."
      filters={
        <HeaderFilters
          initialFilters={filters}
          onFilterChange={(f) => setFilters((p) => ({ ...p, ...f }))}
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
          {/* === SECCIÓN 1: RESUMEN DEL SERVICIO === */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              Resumen del Servicio
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard {...data.kpis.solicitudesTotales} />
              <MetricCard {...data.kpis.eficienciaOperativa} />
              <MetricCard {...data.kpis.efectividad} />
              <MetricCard {...data.kpis.tiempoPromedioAtencion} />
            </div>
          </div>

          {/* === SECCIÓN 2: ANÁLISIS DE FLOTA Y RENDIMIENTO TOP === */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              Análisis de Flota y Top Rendimiento
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <DriverActivityBarChart
                activos={data.kpis.conductoresActivos.value as number}
                atendieron={data.kpis.conductoresAtendieron.value as number}
              />
              <div className="lg:col-span-2">
                <RankingChart
                  data={data.viajesPorConductorData}
                  title="Top 5 Conductores por Viajes"
                  dataKey="viajes"
                  unit="viajes"
                  order="top"
                />
              </div>
            </div>
          </div>

          {/* === SECCIÓN 3: ANÁLISIS DE VIAJES Y RIESGO === */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              Análisis de Viajes y Riesgo
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card
                  title="Distribución de Viajes"
                  tooltipText="Proporción de viajes completados con éxito frente a los que fallaron."
                >
                  <div className="h-[300px]">
                    <SolicitudesChart exitosos={exitosos} fallidos={fallidos} />
                  </div>
                </Card>
              </div>
              <div className="lg:col-span-2">
                <CancellationRateTable drivers={data.monitoredDrivers} />
              </div>
            </div>
          </div>

          {/* === SECCIÓN 4: TENDENCIAS HISTÓRICAS === */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              Tendencias Históricas
            </h2>
            <TimeSeriesChart data={data.kpiHistory} />
          </div>

          {/* === SECCIÓN 5: ANÁLISIS DE RENDIMIENTO BAJO === */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              Conductores a Monitorear (Bajo Rendimiento)
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RankingChart
                data={data.viajesPorConductorData}
                title="Conductores con Menos Viajes"
                dataKey="viajes"
                unit="viajes"
                order="bottom"
              />
              <RankingChart
                data={data.driverRevenueRanking}
                title="Conductores con Menos Ingresos"
                dataKey="ingresos"
                unit="$"
                order="bottom"
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
