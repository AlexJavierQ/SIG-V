'use client';

import React from 'react';
import { Filter, ChevronDown, ChevronUp, RotateCcw, Search, Sparkles } from 'lucide-react';
import { useFilters } from '@/contexts/FiltersContext';

export default function AdvancedFilters() {
    const {
        filters,
        updateFilter,
        resetFilters,
        toggleExpanded,
        getActiveFiltersCount,
        getFiltersSummary
    } = useFilters();

    const activeFiltersCount = getActiveFiltersCount();
    const filtersSummary = getFiltersSummary();

    return (
        <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 mb-8 shadow-2xl overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-blue-600/5 to-blue-700/5 animate-pulse" />

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-2xl" />

            {/* Header */}
            <div className="relative flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl shadow-lg">
                        <Filter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            Filtros Avanzados
                            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-sm font-bold text-blue-700 dark:text-blue-300 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full border border-blue-400/30 shadow-lg">
                                {activeFiltersCount}
                            </span>
                            <span className="text-xs text-slate-600 dark:text-slate-400">filtros activos</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={toggleExpanded}
                    className="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 dark:from-slate-700/50 dark:to-slate-600/50 dark:hover:from-slate-600/60 dark:hover:to-slate-500/60 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg border border-blue-200/50 dark:border-slate-600/50"
                >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {filters.isExpanded ? 'Contraer' : 'Expandir'}
                    </span>
                    <div className="transform transition-transform duration-300 group-hover:scale-110">
                        {filters.isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-white" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-white" />
                        )}
                    </div>
                </button>
            </div>

            {/* All Filters - Expandable with smooth animation */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${filters.isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className="space-y-8 pt-6">
                    {/* Basic Filters */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" />
                            Filtros Básicos
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { key: 'app', label: 'Aplicativo', options: ['Clipp', 'Ktaxi', 'Todos los aplicativos'] },
                                { key: 'country', label: 'País', options: ['Ecuador', 'Colombia', 'Perú', 'Todos los países'] },
                                { key: 'city', label: 'Ciudad', options: ['Loja', 'Riobamba', 'Quevedo', 'Quito', 'Guayaquil', 'Cuenca', 'Todas las ciudades'] },
                                { key: 'period', label: 'Período', options: ['Este mes', 'Este año', 'Mes pasado', 'Mes siguiente', 'Personalizado'] }
                            ].map((filter, index) => (
                                <div key={filter.key} className="group space-y-3 animate-slideDown" style={{ animationDelay: `${index * 100}ms` }}>
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" />
                                        <span>{filter.label}</span>
                                    </div>
                                    <select
                                        value={filters[filter.key as keyof typeof filters] as string}
                                        onChange={(e) => updateFilter(filter.key as keyof typeof filters, e.target.value)}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300 hover:border-blue-400 dark:hover:border-slate-500 shadow-lg backdrop-blur-sm"
                                    >
                                        {filter.options.map(option => (
                                            <option key={option} value={option} className="bg-slate-800 text-white">
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    <div className="space-y-4 border-t border-slate-700/50 pt-6">
                        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" />
                            Filtros Avanzados
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group space-y-3 animate-slideDown" style={{ animationDelay: '400ms' }}>
                                <label className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors flex items-center gap-2">
                                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse" />
                                    Establecimiento
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                    <input
                                        type="text"
                                        value={filters.establishment}
                                        onChange={(e) => updateFilter('establishment', e.target.value)}
                                        placeholder="Filtrar por establecimiento específico"
                                        className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-slate-700/60 to-slate-600/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400/50 transition-all duration-300 hover:border-slate-500 shadow-lg backdrop-blur-sm"
                                    />
                                </div>
                            </div>

                            <div className="group space-y-3 animate-slideDown" style={{ animationDelay: '500ms' }}>
                                <label className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors flex items-center gap-2">
                                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
                                    Opciones Adicionales
                                </label>
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-700/40 to-slate-600/40 rounded-xl border border-slate-600/30 shadow-lg">
                                    <label className="flex items-center gap-3 cursor-pointer group/checkbox">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={!filters.includeNonTransactional}
                                                onChange={(e) => updateFilter('includeNonTransactional', !e.target.checked)}
                                                className="w-5 h-5 text-purple-600 bg-slate-700 border-slate-500 rounded focus:ring-purple-500 focus:ring-2 transition-all duration-200"
                                            />
                                            <div className="absolute inset-0 rounded bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover/checkbox:opacity-100 transition-opacity duration-200" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-300 group-hover/checkbox:text-white transition-colors">
                                            Solo datos transaccionales
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="relative flex items-center justify-between mt-8 pt-6 border-t border-gradient-to-r from-slate-700/30 via-slate-600/50 to-slate-700/30">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-slate-400">
                        Filtros aplicados automáticamente
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={resetFilters}
                        className="group flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-400 hover:text-white transition-all duration-300 hover:bg-slate-700/50 rounded-xl"
                    >
                        <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        Restablecer
                    </button>
                    <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl shadow-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-green-300">Auto-aplicado</span>
                    </div>
                </div>
            </div>
        </div>
    );
}