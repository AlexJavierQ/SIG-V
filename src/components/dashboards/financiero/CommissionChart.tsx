import React from 'react';

interface CommissionChartProps {
  data: any;
}

export default function CommissionChart({ data }: CommissionChartProps) {
  return (
    <div className="h-[300px] flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Comisiones</h3>
        <p className="text-slate-400">Gráfico en desarrollo</p>
      </div>
    </div>
  );
}