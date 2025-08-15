'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

// --- Interfaces y Tipos ---
export interface FilterState {
    app: string;
    country: string;
    city: string;
    establishment: string;
    anio?: number;
    mes?: number;
    dia_semana?: string;
    fecha_exacta?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    includeNonTransactional: boolean;
}

interface FilterOptions {
    paises: string[];
    ciudades: string[];
    aplicativos: string[];
    establecimientos: string[];
    fechaRange: { min?: string; max?: string; };
}

interface FiltersContextType {
    filters: FilterState;
    filterOptions: FilterOptions;
    isLoadingOptions: boolean;
    applyFilters: (newFilters: Partial<FilterState>) => void;
    resetFilters: () => void;
    getActiveFiltersCount: () => number;
    getFiltersSummary: () => string;
}

// --- Estado Inicial y Reducer ---
const initialState: FilterState = {
    app: '',
    country: '',
    city: '',
    establishment: '',
    anio: undefined,
    mes: undefined,
    dia_semana: undefined,
    fecha_exacta: undefined,
    fecha_inicio: undefined,
    fecha_fin: undefined,
    includeNonTransactional: false,
};

type FilterAction = { type: 'SET_MULTIPLE'; payload: Partial<FilterState> } | { type: 'RESET_FILTERS' };

function filtersReducer(state: FilterState, action: FilterAction): FilterState {
    switch (action.type) {
        case 'SET_MULTIPLE':
            return { ...state, ...action.payload };
        case 'RESET_FILTERS':
            return { ...initialState };
        default:
            return state;
    }
}

// --- Provider ---
const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
    const [filters, dispatch] = useReducer(filtersReducer, initialState);

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        paises: [],
        ciudades: [],
        aplicativos: [],
        establecimientos: [],
        fechaRange: {},
    });
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            setIsLoadingOptions(true);
            try {
                const response = await fetch('http://127.0.0.1:8000/metadatos?tabla=marketing');
                if (!response.ok) {
                    throw new Error(`Error al obtener metadatos: ${response.statusText}`);
                }

                const data = await response.json();

                // Ajustamos el código para que lea la nueva estructura del JSON
                setFilterOptions({
                    paises: data.filtros_disponibles?.paises || [],
                    ciudades: data.filtros_disponibles?.ciudades || [],
                    aplicativos: data.filtros_disponibles?.aplicativos || [],
                    establecimientos: data.filtros_disponibles?.establecimientos || [],
                    fechaRange: {
                        min: data.rango_fechas?.fecha_minima,
                        max: data.rango_fechas?.fecha_maxima
                    }
                });

            } catch (error) {
                console.error("Error al cargar las opciones de los filtros:", error);
                setFilterOptions({ paises: [], ciudades: [], aplicativos: [], establecimientos: [], fechaRange: {} });
            } finally {
                setIsLoadingOptions(false);
            }
        };

        fetchFilterOptions();
    }, []);

    useEffect(() => {
        const savedFilters = localStorage.getItem('dashboard-filters');
        if (savedFilters) { try { dispatch({ type: 'SET_MULTIPLE', payload: JSON.parse(savedFilters) }); } catch (e) { console.warn(e); } }
    }, []);

    useEffect(() => {
        localStorage.setItem('dashboard-filters', JSON.stringify(filters));
    }, [filters]);

    const applyFilters = (newFilters: Partial<FilterState>) => {
        dispatch({ type: 'SET_MULTIPLE', payload: newFilters });
    };

    const resetFilters = () => {
        dispatch({ type: 'RESET_FILTERS' });
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.app) count++;
        if (filters.country) count++;
        if (filters.city) count++;
        if (filters.establishment) count++;
        if (filters.anio) count++;
        if (filters.mes) count++;
        if (filters.dia_semana) count++;
        if (filters.fecha_exacta) count++;
        if (filters.fecha_inicio) count++;
        if (filters.fecha_fin) count++;
        return count;
    };

    const getFiltersSummary = () => {
        const parts = [];
        if (filters.app) parts.push(`App: ${filters.app}`);
        if (filters.country) parts.push(`País: ${filters.country}`);
        if (filters.city) parts.push(`Ciudad: ${filters.city}`);
        if (filters.establishment) parts.push(`Est: ${filters.establishment}`);

        if (filters.fecha_exacta) {
            parts.push(`Fecha: ${filters.fecha_exacta}`);
        } else if (filters.fecha_inicio && filters.fecha_fin) {
            parts.push(`Rango: ${filters.fecha_inicio} a ${filters.fecha_fin}`);
        } else {
            if (filters.anio) parts.push(`Año: ${filters.anio}`);
            if (filters.mes) parts.push(`Mes: ${new Date(2000, filters.mes - 1).toLocaleString('es', { month: 'long' })}`);
            if (filters.dia_semana) parts.push(`Día: ${filters.dia_semana.charAt(0).toUpperCase() + filters.dia_semana.slice(1)}`);
        }

        return parts.join(' • ') || 'Sin filtros aplicados';
    };

    const value: FiltersContextType = {
        filters,
        filterOptions,
        isLoadingOptions,
        applyFilters,
        resetFilters,
        getActiveFiltersCount,
        getFiltersSummary,
    };

    return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
    const context = useContext(FiltersContext);
    if (context === undefined) {
        throw new Error('useFilters debe ser usado dentro de un FiltersProvider');
    }
    return context;
}