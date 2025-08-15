// src/components/dashboard/OverviewSection.tsx

import DashboardSection from "@/components/ui/DashboardSection";
import MetricCard from "@/components/ui/MetricCard";
import { MetricCardSkeleton } from "@/components/ui/MetricCardSkeleton";
import { TrendingUp } from "lucide-react";
import type { Kpi } from "@/hooks/useDashboardData";

interface OverviewSectionProps {
    kpis: Kpi[];
    isLoading: boolean;
}

export default function OverviewSection({ kpis, isLoading }: OverviewSectionProps) {
    return (
        <DashboardSection
            title="Indicadores Ejecutivos de Taxis"
            subtitle="Métricas principales del servicio de taxis de Clipp"
            icon={TrendingUp}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
                    : kpis.map((kpi) => <MetricCard key={kpi.title} {...kpi} />)}
            </div>
            {/* ... (puedes añadir aquí el pie de sección con las fuentes de datos) ... */}
        </DashboardSection>
    );
}