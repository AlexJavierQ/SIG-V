import { servicesCards } from "@/lib/constants";
import ServiceCard from "@/components/dashboard/ServiceCard";
import DashboardSection from "@/components/ui/DashboardSection";
import { ServiceCardSkeleton } from "@/components/ui/ServiceCardSkeleton";
import type { ServiceStats } from '@/hooks/useDashboardData';
import { Eye } from "lucide-react";

interface ServicesSectionProps {
    isLoading: boolean;
    serviceStats: Record<string, ServiceStats>;
}

export default function ServicesSection({ isLoading, serviceStats }: ServicesSectionProps) {
    return (
        <DashboardSection
            title="Servicios Disponibles"
            subtitle="Accede a los diferentes dashboards de la plataforma"
            icon={Eye}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => <ServiceCardSkeleton key={i} />)
                    : servicesCards.map((service) => (
                        <ServiceCard
                            key={service.title}
                            {...service}
                            // Pasamos el objeto de estadísticas que corresponde a esta tarjeta
                            liveStats={serviceStats[service.title]}
                        />
                    ))
                }
            </div>
        </DashboardSection>
    );
}