import { useMemo } from 'react';

export const useOptimizedData = <T>(
    data: T[] | null,
    processor: (data: T[]) => any,
    dependencies: any[] = []
) => {
    return useMemo(() => {
        if (!data || data.length === 0) return null;
        return processor(data);
    }, [data, ...dependencies]);
};

export const useChartData = (rawData: any[], chartType: 'pie' | 'bar' | 'line' | 'area') => {
    return useMemo(() => {
        if (!rawData || rawData.length === 0) return [];

        // Optimización específica por tipo de gráfico
        switch (chartType) {
            case 'pie':
                return rawData.slice(0, 6); // Limitar a 6 elementos para pie charts
            case 'bar':
                return rawData.slice(0, 10); // Limitar a 10 elementos para bar charts
            case 'line':
            case 'area':
                return rawData.slice(0, 12); // Limitar a 12 puntos para line/area charts
            default:
                return rawData;
        }
    }, [rawData, chartType]);
};

export default useOptimizedData;