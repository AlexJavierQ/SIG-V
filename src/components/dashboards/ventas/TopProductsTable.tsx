import React from 'react';

interface TopProductsTableProps {
    products: any;
}

export default function TopProductsTable({ products }: TopProductsTableProps) {
    return (
        <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Productos Top</h3>
                <p className="text-slate-400">Tabla en desarrollo</p>
            </div>
        </div>
    );
}