import React from 'react';

interface LoyalCustomersTableProps {
  customers: any;
}

export default function LoyalCustomersTable({ customers }: LoyalCustomersTableProps) {
  return (
    <div className="h-[300px] flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Clientes Leales</h3>
        <p className="text-slate-400">Tabla en desarrollo</p>
      </div>
    </div>
  );
}