import React from 'react';

interface UserAcquisitionChartProps {
    data: any;
}

export default function UserAcquisitionChart({ data }: UserAcquisitionChartProps) {
    return (
        <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Adquisición de Usuarios</h3>
                <p className="text-slate-400">Gráfico en desarrollo</p>
            </div>
        </div>
    );
}