"use client";

import React from 'react';
import { BarChart3, Star } from 'lucide-react';

export default function ProductAnalysisChart() {
    // Datos simulados para análisis de productos
    const productData = [
        {
            name: 'Premium Service',
            sales: 125000,
            units: 340,
            margin: 68.5,
            rating: 4.8,
            growth: 15.2,
            category: 'Premium'
        },
        {
            name: 'Basic Plan',
            sales: 98000,
            units: 1200,
            margin: 45.3,
            rating: 4.5,
            growth: 8.7,
            category: 'Básico'
        },
        {
            name: 'Enterprise',
            sales: 156000,
            units: 89,
            margin: 78.2,
            rating: 4.9,
            growth: 22.1,
            category: 'Empresarial'
        },
        {
            name: 'Starter',
            sales: 67000,
            units: 890,
            margin: 35.6,
            rating: 4.3,
            growth: -3.4,
            category: 'Básico'
        },
        {
            name: 'Pro',
            sales: 89000,
            units: 456,
            margin: 58.9,
            rating: 4.6,
            growth: 12.8,
            category: 'Profesional'
        },
    ];

    const totalSales = productData.reduce((sum, item) => sum + item.sales, 0);
    const maxSales = Math.max(...productData.map(item => item.sales));

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Premium': return 'bg-emerald-400';
            case 'Empresarial': return 'bg-purple-400';
            case 'Profesional': return 'bg-blue-400';
            case 'Básico': return 'bg-orange-400';
            default: return 'bg-slate-400';
        }
    };

    const getMarginColor = (margin: number) => {
        if (margin >= 70) return 'text-green-400';
        if (margin >= 50) return 'text-blue-400';
        if (margin >= 30) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                        Análisis de Productos
                    </h3>
                    <p className="text-slate-400 text-sm">Rendimiento y rentabilidad por producto</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-400">Total Portfolio</div>
                    <div className="text-lg font-semibold text-white">
                        ${(totalSales / 1000).toFixed(0)}K
                    </div>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                {productData.map((product, index) => (
                    <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${getCategoryColor(product.category)}`}></div>
                                <div>
                                    <span className="text-slate-300 font-medium">{product.name}</span>
                                    <div className="text-xs text-slate-400">{product.category}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-400 text-sm font-medium">{product.rating}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3 mb-3 text-sm">
                            <div className="text-center">
                                <div className="text-slate-400 text-xs">Ventas</div>
                                <div className="text-white font-semibold">
                                    ${(product.sales / 1000).toFixed(0)}K
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-slate-400 text-xs">Unidades</div>
                                <div className="text-blue-400 font-semibold">
                                    {product.units.toLocaleString()}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-slate-400 text-xs">Margen</div>
                                <div className={`font-semibold ${getMarginColor(product.margin)}`}>
                                    {product.margin}%
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-slate-400 text-xs">Crecimiento</div>
                                <div className={`font-semibold ${product.growth >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {product.growth >= 0 ? '+' : ''}{product.growth}%
                                </div>
                            </div>
                        </div>

                        {/* Barra de participación en ventas */}
                        <div className="relative">
                            <div className="w-full bg-slate-600 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-1000 ${getCategoryColor(product.category)}`}
                                    style={{ width: `${(product.sales / maxSales) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 text-xs">
                            <span className="text-slate-400">
                                {((product.sales / totalSales) * 100).toFixed(1)}% del total
                            </span>
                            <span className="text-slate-400">
                                Precio promedio: ${(product.sales / product.units).toFixed(0)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-slate-600/50">
                <div className="grid grid-cols-2 gap-4 text-center text-sm mb-4">
                    <div>
                        <div className="text-slate-400">Producto Top</div>
                        <div className="text-emerald-400 font-semibold">
                            {productData.reduce((best, current) =>
                                current.sales > best.sales ? current : best
                            ).name}
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400">Mejor Margen</div>
                        <div className="text-purple-400 font-semibold">
                            {productData.reduce((best, current) =>
                                current.margin > best.margin ? current : best
                            ).margin}%
                        </div>
                    </div>
                </div>

                {/* Leyenda de categorías */}
                <div className="flex items-center justify-center gap-4 text-xs">
                    {['Premium', 'Empresarial', 'Profesional', 'Básico'].map((category, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getCategoryColor(category)}`}></div>
                            <span className="text-slate-400">{category}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}