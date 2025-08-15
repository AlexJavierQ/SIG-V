import { useState, useEffect, useCallback } from 'react';
import { ApiService, AVAILABLE_TABLES, ApiResponse } from '@/lib/api-service';
import { useFilters } from '@/contexts/FiltersContext';

export interface UseApiDataOptions {
    tabla: string;
    autoFetch?: boolean;
}

export interface UseApiDataReturn {
    data: any[] | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    buildCurrentUrl: () => string;
    lastUpdated: number | null;
    isFromCache: boolean;
}

/**
 * Hook personalizado para obtener datos del endpoint /datos
 */
export function useApiData({ tabla, autoFetch = true }: UseApiDataOptions): UseApiDataReturn {
    const [data, setData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<number | null>(null);
    const [isFromCache, setIsFromCache] = useState(false);
    const { filters } = useFilters();

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result: ApiResponse = await ApiService.getTableData(tabla, filters);
            setData(result.data);
            setLastUpdated(result.timestamp);

            // Determinar si los datos vienen del caché comparando timestamps
            const now = Date.now();
            setIsFromCache(now - result.timestamp > 1000); // Si es más de 1 segundo, probablemente del caché

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener datos';
            setError(errorMessage);
            setData(null);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, [tabla, filters]);

    const buildCurrentUrl = useCallback(() => {
        const endpointFilters = ApiService.convertGlobalFiltersToEndpoint(filters, tabla);
        return ApiService.buildDataUrl(endpointFilters);
    }, [filters, tabla]);

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [fetchData, autoFetch]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
        buildCurrentUrl,
        lastUpdated,
        isFromCache
    };
}

/**
 * Hook específico para datos de marketing
 */
export function useMarketingData(autoFetch = true) {
    return useApiData({ tabla: AVAILABLE_TABLES.MARKETING, autoFetch });
}

/**
 * Hook específico para datos de finanzas
 */
export function useFinanzasData(autoFetch = true) {
    return useApiData({ tabla: AVAILABLE_TABLES.FINANZAS, autoFetch });
}

/**
 * Hook específico para datos operativos
 */
export function useOperativosData(autoFetch = true) {
    return useApiData({ tabla: AVAILABLE_TABLES.OPERATIVOS, autoFetch });
}

/**
 * Hook específico para datos de ventas
 */
export function useVentasData(autoFetch = true) {
    return useApiData({ tabla: AVAILABLE_TABLES.VENTAS, autoFetch });
}

/**
 * Hook específico para datos financieros
 */
export function useFinancialData(autoFetch = true) {
    return useApiData({ tabla: AVAILABLE_TABLES.FINANZAS, autoFetch });
}

/**
 * Hook específico para datos operacionales
 */
export function useOperationalData(autoFetch = true) {
    return useApiData({ tabla: AVAILABLE_TABLES.OPERATIVOS, autoFetch });
}