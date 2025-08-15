import React from 'react';

interface RevenueByChannelChartProps {
  data: any;
}

export default function RevenueByChannelChart({ data }: RevenueByChannelChartProps) {
  return (
    <div className="h-[300px] flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Ingresos por Canal</h3>
        <p className="text-slate-400">Gráfico en desarrollo</p>
      </div>
    </div>
  );
}