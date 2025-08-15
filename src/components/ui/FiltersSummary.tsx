"use client";

import React from 'react';
import { Filter, Clock } from 'lucide-react';
import { useFilters } from '@/contexts/FiltersContext';
import ClientOnly from './ClientOnly';

export default function FiltersSummary() {
    const { filters, getActiveFiltersCount, getFiltersSummary } = useFilters();

    const activeCount = getActiveFiltersCount();

    if (activeCount === 0) return null;

    return (
        <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Filtros Aplicados
                        </h3>
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-200 dark:bg-blue-800/50 rounded-full">
                            {activeCount}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300 truncate">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <ClientOnly fallback={<span className="truncate">Cargando filtros...</span>}>
                            <span className="truncate">{getFiltersSummary()}</span>
                        </ClientOnly>
                    </div>
                </div>
            </div>
        </div>
    );
}