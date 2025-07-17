"use client";

import { useState, useEffect, useCallback } from "react";
import { getSalesData } from "@/lib/data";
import type { SalesUsageData, FilterOptions } from "@/lib/types";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import MetricCard from "@/components/ui/MetricCard";
import HeaderFilters from "@/components/ui/HeaderFilters";
import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";
import RankingChart from "@/components/charts/RankingChart";

// --- Dynamic Imports for Charts ---
const ChartLoader = () => (
  <Card className="flex items-center justify-center h-full min-h-[350px]">
    <p className="text-slate-500 dark:text-slate-400">Cargando gráfico...</p>
  </Card>
);

const SalesByChannelChart = dynamic(
  () => import("@/components/dashboards/ventas/SalesByChannelChart"),
  { ssr: false, loading: () => <ChartLoader /> }
);
const PeakHoursChart = dynamic(
  () => import("@/components/dashboards/ventas/PeakHoursChart"),
  { ssr: false, loading: () => <ChartLoader /> }
);

export default function VentasPage() {
  const [data, setData] = useState<SalesUsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    aplicativo: "Clipp",
    pais: "Ecuador",
    ciudad: "Loja",
    fechaInicio: "2025-07-01",
    fechaFin: "2025-07-31",
    transaccional: true,
  });

  const fetchData = useCallback(() => {
    setIsLoading(true);
    // Usamos Promise.resolve para mantener la asincronía con los datos locales
    Promise.resolve(getSalesData(filters)).then((data) => {
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
          Cargando Dashboard de Ventas...
        </p>
      </div>
    );
  }
  if (!data) return null;

  return (
    <DashboardLayout
      title="Dashboard de Ventas y Uso"
      description="Análisis sobre la actividad de los usuarios y el rendimiento de las ventas."
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
          {/* === SECCIÓN 1: Resumen de Actividad y Ventas === */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              Resumen de Actividad y Ventas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard {...data.kpis.usuariosActivos} />
              <MetricCard {...data.kpis.solicitudesAtendidas} />
              <MetricCard {...data.kpis.ticketPromedio} />
              <MetricCard {...data.kpis.efectividadVentas} />
            </div>
          </div>

          {/* === SECCIÓN 2: Análisis de Canales y Demanda === */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              Análisis de Canales y Demanda
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesByChannelChart data={data.ventasPorCanal} />
              <PeakHoursChart data={data.topHorasDemanda} />
            </div>
          </div>

          {/* === SECCIÓN 3: Análisis Geográfico === */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              Análisis Geográfico de Zonas Populares
            </h2>
            <RankingChart
              data={data.topZonas}
              title="Top 5 Zonas de Origen/Destino"
              dataKey="viajes"
              unit="viajes"
              order="top"
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
