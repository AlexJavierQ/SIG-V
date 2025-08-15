// src/components/dashboards/ejecutivo/RegionalPerformance.tsx

import DashboardSection from "@/components/ui/DashboardSection";
import { Users } from "lucide-react";

interface Region {
    region: string;
    revenue: number;
    users: number;
    growth: number;
}

interface RegionalPerformanceProps {
    data: Region[];
}

export default function RegionalPerformance({ data }: RegionalPerformanceProps) {
    return (
        <DashboardSection
            title="Rendimiento por Región"
            subtitle="Comparativa de desempeño geográfico"
            icon={Users}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.map((region, index) => (
                    <div key={index} className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-400 mb-2">
                                {region.region}
                            </div>
                            <div className="space-y-2">
                                <div className="text-slate-300">
                                    <span className="text-sm">Ingresos: </span>
                                    <span className="font-semibold">${region.revenue.toLocaleString()}</span>
                                </div>
                                <div className="text-slate-300">
                                    <span className="text-sm">Usuarios: </span>
                                    <span className="font-semibold">{region.users.toLocaleString()}</span>
                                </div>
                                <div className="text-slate-300">
                                    <span className={`font-semibold ${region.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {region.growth >= 0 ? '+' : ''}{region.growth}%
                                    </span>
                                    <span className="text-sm ml-1">Crecimiento</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardSection>
    );
}