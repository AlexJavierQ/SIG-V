"use client";

import { useState, useEffect, useCallback } from "react";
import { getFinancialData } from "@/lib/data";
import type { FinancialDashboardData, FilterOptions } from "@/lib/types";

// --- Layout & UI Components ---
import DashboardLayout from "@/components/layouts/DashboardLayout";
import MetricCard from "@/components/ui/MetricCard";
import HeaderFilters from "@/components/ui/HeaderFilters";
import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";

// --- Dynamic Imports for Charts ---
const ChartLoader = () => (
  <Card className="flex items-center justify-center h-full min-h-[350px]">
    <p className="text-slate-500 dark:text-slate-400">Cargando gráfico...</p>
  </Card>
);

const RevenueByChannelChart = dynamic(
  () => import("@/components/dashboards/financiero/RevenueByChannelChart"),
  { ssr: false, loading: () => <ChartLoader /> }
);
const CommissionChart = dynamic(
  () => import("@/components/dashboards/financiero/CommissionChart"),
  { ssr: false, loading: () => <ChartLoader /> }
);
const LoyalCustomersTable = dynamic(
  () => import("@/components/dashboards/financiero/LoyalCustomersTable"),
  { ssr: false, loading: () => <ChartLoader /> }
);

export default function FinancieroPage() {
  const [data, setData] = useState<FinancialDashboardData | null>(null);
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

  const fetchData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    Promise.resolve(getFinancialData(filters))
      .then((data) => setData(data))
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Ocurrió un error inesperado."
        );
        setData(null);
      })
      .finally(() => setIsLoading(false));
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Renderizado del Componente ---
  if (!data && isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Cargando Dashboard Financiero...
        </p>
      </div>
    );
  }

  // Calculamos los KPIs derivados para la sección de rentabilidad
  const ingresos = (data?.kpis.ingresosTotales.value as number) || 0;
  const costos =
    ((data?.kpis.cacConductor.value as number) || 0) +
    ((data?.kpis.cacCliente.value as number) || 0);
  const margen = ingresos - costos;

  return (
    <DashboardLayout
      title="Dashboard Financiero Estratégico"
      description="Análisis enfocado en rentabilidad, fuentes de ingreso y retención."
      filters={
        <HeaderFilters
          initialFilters={filters}
          onFilterChange={(f) => setFilters((p) => ({ ...p, ...f }))}
        />
      }
      onUpdateClick={fetchData}
    >
      {isLoading && (
        <div className="py-10 text-center text-slate-500 dark:text-slate-400">
          Actualizando datos...
        </div>
      )}
      {error && (
        <div className="p-4 my-4 text-center text-red-700 bg-red-100 rounded-lg">
          Error al cargar: {error}
        </div>
      )}

      {!isLoading && !error && data && (
        <div className="space-y-12">
          {/* === SECCIÓN 1: ¿ESTAMOS GANANDO DINERO? (VISTA DE RENTABILIDAD) === */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              Resumen de Rentabilidad
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard {...data.kpis.ingresosTotales} />
              <MetricCard
                title="Costos Totales (CAC)"
                value={costos}
                description="Suma de CAC de conductor y cliente."
                icon="💸"
              />
              <MetricCard
                title="Margen Neto (Ingresos - Costos)"
                value={margen}
                description="Salud financiera del período."
                icon={margen > 0 ? "😊" : "😥"}
                iconColor={margen > 0 ? "text-green-500" : "text-red-500"}
              />
            </div>
          </div>

          {/* === SECCIÓN 2: ¿DE DÓNDE VIENE EL DINERO? (ANÁLISIS DE INGRESOS) === */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              Análisis de Fuentes de Ingreso
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueByChannelChart data={data.ingresosPorCanal} />
              <CommissionChart data={data.comisionesPorSegmento} />
            </div>
          </div>

          {/* === SECCIÓN 3: ¿ESTAMOS RETENIENDO A NUESTROS USUARIOS? (ANÁLISIS DE RETENCIÓN) === */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              Análisis de Retención y Lealtad
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 grid grid-cols-1 gap-6">
                <MetricCard {...data.kpis.churnRateConductores} />
                <MetricCard {...data.kpis.churnRateClientes} />
              </div>
              <div className="md:col-span-2">
                <LoyalCustomersTable data={data.clientesLeales} />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
