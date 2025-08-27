// src/hooks/useExecutiveDashboard.ts

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getExecutiveData } from '@/lib/data';
import type { ExecutiveDashboardData } from '@/lib/types';
import type { GlobalFilters } from '@/contexts/FiltersContext';

// Este hook encapsula toda la lógica de datos para el dashboard ejecutivo
export function useExecutiveDashboard(filters: GlobalFilters) {
    const [data, setData] = useState<ExecutiveDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(() => {
        setIsLoading(true);
        const apiFilters = {
            aplicativo: filters.app,
            pais: filters.country,
            ciudad: filters.city,
            fechaInicio: "2025-07-01",
            fechaFin: "2025-07-31",
            establecimiento: filters.establishment,
            transaccional: !filters.includeNonTransactional,
        };

        // Usamos Promise.resolve para manejar la data simulada como si fuera una API real
        Promise.resolve(getExecutiveData(apiFilters))
            .then(setData)
            .catch(error => console.error("Error fetching executive data:", error))
            .finally(() => setIsLoading(false));
    }, [filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Transformaciones de datos memoizadas para que solo se recalculen si los datos cambian
    const executiveKPIs = useMemo(() => {
        if (!data) return [];
        return [
            { title: "Ingresos Totales", value: data.kpis.ingresosTotales.value, trend: data.kpis.ingresosTotales.trend.value, format: "currency" as const },
            { title: "Usuarios Activos", value: data.kpis.usuariosActivos.value, trend: data.kpis.usuariosActivos.trend.value, format: "number" as const },
            { title: "ROI", value: data.kpis.roi.value, trend: data.kpis.roi.trend.value, format: "percentage" as const },
            { title: "Eficiencia Operativa", value: data.kpis.eficienciaOperativa.value, trend: data.kpis.eficienciaOperativa.trend.value, format: "percentage" as const }
        ];
    }, [data]);

    const exportData = useMemo(() => {
        if (!data) return [];
        return [
            ...data.businessMetrics.map(d => ({ tipo: 'Métrica', nombre: d.name, valor: d.value, objetivo: d.target, cumplimiento: d.achievement })),
            ...data.regionalPerformance.map(d => ({ tipo: 'Región', region: d.region, ingresos: d.revenue, usuarios: d.users, crecimiento: d.growth }))
        ];
    }, [data]);

    return {
        data,
        executiveKPIs,
        exportData,
        isLoading,
        refetch: fetchData
    };
}