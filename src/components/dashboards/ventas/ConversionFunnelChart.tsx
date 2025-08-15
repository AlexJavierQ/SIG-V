import React from 'react';

interface ConversionFunnelChartProps {
    data: any;
}

export default function ConversionFunnelChart({ data }: ConversionFunnelChartProps) {
    return (
        <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Embudo de Conversión</h3>
                <p className="text-slate-400">Gráfico en desarrollo</p>
            </div>
        </div>
    );
}