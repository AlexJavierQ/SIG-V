import React from 'react';

interface CampaignPerformanceTableProps {
    campaigns: any;
}

export default function CampaignPerformanceTable({ campaigns }: CampaignPerformanceTableProps) {
    return (
        <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Rendimiento de Campañas</h3>
                <p className="text-slate-400">Tabla en desarrollo</p>
            </div>
        </div>
    );
}