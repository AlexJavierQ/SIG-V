"use client";

import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { useFilters, FilterState } from '@/contexts/FiltersContext';
import ClientOnly from './ClientOnly';

export default function CompactFilters() {
    const {
        filters: globalFilters,
        applyFilters,
        resetFilters,
        filterOptions,
        isLoadingOptions,
        getActiveFiltersCount,
        getFiltersSummary,
    } = useFilters();

    const [localFilters, setLocalFilters] = useState(globalFilters);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => { setLocalFilters(globalFilters); }, [globalFilters]);

    const handleLocalFilterChange = (key: keyof FilterState, value: any) => {
        setLocalFilters(prev => {
            const newFilters = { ...prev, [key]: value };
            if (key === 'fecha_exacta' && value) {
                newFilters.anio = undefined; newFilters.mes = undefined; newFilters.dia_semana = undefined; newFilters.fecha_inicio = undefined; newFilters.fecha_fin = undefined;
            } else if ((key === 'fecha_inicio' || key === 'fecha_fin') && value) {
                newFilters.anio = undefined; newFilters.mes = undefined; newFilters.dia_semana = undefined; newFilters.fecha_exacta = undefined;
            } else if (['anio', 'mes', 'dia_semana'].includes(key) && value) {
                newFilters.fecha_exacta = undefined; newFilters.fecha_inicio = undefined; newFilters.fecha_fin = undefined;
            }
            return newFilters;
        });
    };

    const hasPendingChanges = JSON.stringify(localFilters) !== JSON.stringify(globalFilters);
    const isDateRangeActive = !!localFilters.fecha_inicio || !!localFilters.fecha_fin;
    const isExactDateActive = !!localFilters.fecha_exacta;
    const isPeriodActive = !!localFilters.anio || !!localFilters.mes || !!localFilters.dia_semana;
    const allFieldsDisabled = isLoadingOptions;
    const commonSelectClasses = "w-full mt-1 px-2 py-1.5 text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed";
    const commonInputClasses = "w-full mt-1 px-2 py-1.5 text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed";
    const commonLabelClasses = "text-xs font-medium text-slate-600 dark:text-slate-400";
    const activeCount = getActiveFiltersCount();
    const summaryText = getFiltersSummary();

    return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-sm mb-6">
            <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-1.5 bg-blue-100/80 dark:bg-blue-900/40 rounded-md"><Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /></div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filtros Aplicados</span>
                            {activeCount > 0 && (<span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-200/80 dark:bg-blue-800/50 rounded-full">{activeCount}</span>)}
                        </div>
                        <ClientOnly><div className="text-xs text-slate-500 dark:text-slate-400 truncate" title={summaryText}>{summaryText}</div></ClientOnly>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); resetFilters(); }} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" title="Restablecer"><RotateCcw className="w-3.5 h-3.5" /></button>
                    <span className="p-1.5 text-slate-400">{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
                </div>
            </div>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>{isLoadingOptions ? (<div className="text-center text-sm text-slate-500 py-8">Cargando opciones de filtros...</div>) : (<div className="p-4 pt-2"><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"><div><label className={commonLabelClasses}>Aplicativo</label><select value={localFilters.app} onChange={(e) => handleLocalFilterChange('app', e.target.value)} disabled={allFieldsDisabled} className={commonSelectClasses}><option value="">Todos</option>{filterOptions.aplicativos.map(o => <option key={o} value={o}>{o}</option>)}</select></div><div><label className={commonLabelClasses}>País</label><select value={localFilters.country} onChange={(e) => handleLocalFilterChange('country', e.target.value)} disabled={allFieldsDisabled} className={commonSelectClasses}><option value="">Todos</option>{filterOptions.paises.map(o => <option key={o} value={o}>{o}</option>)}</select></div><div><label className={commonLabelClasses}>Ciudad</label><select value={localFilters.city} onChange={(e) => handleLocalFilterChange('city', e.target.value)} disabled={allFieldsDisabled} className={commonSelectClasses}><option value="">Todas</option>{filterOptions.ciudades.map(o => <option key={o} value={o}>{o}</option>)}</select></div><div><label className={commonLabelClasses}>Establecimiento</label><select value={localFilters.establishment} onChange={(e) => handleLocalFilterChange('establishment', e.target.value)} disabled={allFieldsDisabled} className={commonSelectClasses}><option value="">Todos</option>{filterOptions.establecimientos.map(o => <option key={o} value={o}>{o}</option>)}</select></div><div><label className={commonLabelClasses}>Año</label><select value={localFilters.anio || ''} onChange={(e) => handleLocalFilterChange('anio', e.target.value ? Number(e.target.value) : undefined)} disabled={allFieldsDisabled || isDateRangeActive || isExactDateActive} className={commonSelectClasses}><option value="">Cualquiera</option>{[2025, 2024, 2023, 2022].map(year => <option key={year} value={year}>{year}</option>)}</select></div><div><label className={commonLabelClasses}>Mes</label><select value={localFilters.mes || ''} onChange={(e) => handleLocalFilterChange('mes', e.target.value ? Number(e.target.value) : undefined)} disabled={allFieldsDisabled || isDateRangeActive || isExactDateActive} className={commonSelectClasses}><option value="">Cualquiera</option>{Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{new Date(2000, i, 1).toLocaleString('es', { month: 'long' })}</option>)}</select></div><div><label className={commonLabelClasses}>Día Semana</label><select value={localFilters.dia_semana || ''} onChange={(e) => handleLocalFilterChange('dia_semana', e.target.value || undefined)} disabled={allFieldsDisabled || isDateRangeActive || isExactDateActive} className={commonSelectClasses}><option value="">Cualquiera</option>{['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].map(day => <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>)}</select></div><div><label className={commonLabelClasses}>Fecha Exacta</label><input type="date" value={localFilters.fecha_exacta || ''} onChange={(e) => handleLocalFilterChange('fecha_exacta', e.target.value || undefined)} min={filterOptions.fechaRange.min} max={filterOptions.fechaRange.max} disabled={allFieldsDisabled || isDateRangeActive || isPeriodActive} className={commonInputClasses} /></div><div className="col-span-2"><label className={commonLabelClasses}>Rango de Fechas</label><div className="flex items-center gap-2"><input type="date" placeholder="Inicio" value={localFilters.fecha_inicio || ''} onChange={(e) => handleLocalFilterChange('fecha_inicio', e.target.value || undefined)} min={filterOptions.fechaRange.min} max={localFilters.fecha_fin || filterOptions.fechaRange.max} disabled={allFieldsDisabled || isExactDateActive || isPeriodActive} className={commonInputClasses} /><span className="text-slate-400">-</span><input type="date" placeholder="Fin" value={localFilters.fecha_fin || ''} onChange={(e) => handleLocalFilterChange('fecha_fin', e.target.value || undefined)} min={localFilters.fecha_inicio || filterOptions.fechaRange.min} max={filterOptions.fechaRange.max} disabled={allFieldsDisabled || isExactDateActive || isPeriodActive} className={commonInputClasses} /></div></div></div><div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!localFilters.includeNonTransactional} onChange={(e) => handleLocalFilterChange('includeNonTransactional', !e.target.checked)} className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500" /><span className="text-xs text-slate-600 dark:text-slate-400">Solo transaccionales</span></label><div className="flex items-center gap-4"><div className="flex items-center gap-2 text-xs">{hasPendingChanges ? (<><AlertCircle className="w-4 h-4 text-yellow-500 animate-pulse" /><span className="text-yellow-600 dark:text-yellow-400 font-medium">Hay cambios sin aplicar</span></>) : (<><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-slate-500 dark:text-slate-400">Filtros sincronizados</span></>)}</div><button onClick={() => applyFilters(localFilters)} disabled={!hasPendingChanges || allFieldsDisabled} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-600 transition-all">Aplicar Filtros</button></div></div></div>)}</div>
        </div>
    );
}