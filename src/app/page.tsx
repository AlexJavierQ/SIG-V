"use client";

import { useEffect, useRef } from "react";
import DashboardLayout from "@/components/ui/DashboardLayout";
import CompactFilters from "@/components/ui/CompactFilters";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import OverviewSection from "@/components/dashboard/OverviewSection";
import ServicesSection from "@/components/dashboard/ServicesSection";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function HomePage() {
  const { toasts, success, error: showError, removeToast } = useToast();

  // El hook ahora devuelve todos los datos necesarios para el dashboard principal
  const { overviewKPIs, serviceStats, isLoading, error } = useDashboardData();

  const prevIsLoadingRef = useRef(true);

  // Efecto para mostrar notificaciones en cada carga de datos
  useEffect(() => {
    if (prevIsLoadingRef.current && !isLoading) {
      if (error) {
        showError('Error de Conexión', error);
      } else {
        success('Datos Actualizados', 'El dashboard ha sido sincronizado con éxito.');
      }
    }
    prevIsLoadingRef.current = isLoading;
  }, [isLoading, error, success, showError]);

  return (
    <DashboardLayout
      title="Dashboard Principal"
      subtitle="Vista general del sistema de analytics"
    >
      <div className="space-y-8">
        <WelcomeSection
          serviciosActivos={overviewKPIs.find(kpi => kpi.title === "Servicios Operativos")?.value || 2}
          isLoading={isLoading}
        />

        {/* El nuevo sistema de filtros robusto */}
        <CompactFilters />

        {/* La sección de KPIs generales sigue funcionando */}
        <OverviewSection kpis={overviewKPIs} isLoading={isLoading} />

        {/* La sección de servicios ahora recibe los datos dinámicos */}
        <ServicesSection
          isLoading={isLoading}
          serviceStats={serviceStats}
        />
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Se ha eliminado el componente FloatingSystemStatus */}
    </DashboardLayout>
  );
}