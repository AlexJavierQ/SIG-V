import { useCallback, useMemo } from 'react';

export interface Driver {
    name: string;
    viajes: number;
    asignaciones: number;
    cancelacion: number;
    eficiencia: number;
    diasActivos: number;
    ingresos: number;
}

export const useDriverCalculations = (drivers: Driver[]) => {
    const getTopDrivers = useCallback((count: number, sortBy: 'viajes' | 'eficiencia' = 'viajes') => {
        if (!drivers || drivers.length === 0) return [];
        return drivers
            .sort((a, b) => sortBy === 'viajes' ? b.viajes - a.viajes : b.eficiencia - a.eficiencia)
            .slice(0, count);
    }, [drivers]);

    const getBottomDrivers = useCallback((count: number, sortBy: 'viajes' | 'eficiencia' = 'viajes') => {
        if (!drivers || drivers.length === 0) return [];
        return drivers
            .sort((a, b) => sortBy === 'viajes' ? a.viajes - b.viajes : a.eficiencia - b.eficiencia)
            .slice(0, count);
    }, [drivers]);

    const calculateAverage = useCallback((driverList: Driver[], field: keyof Driver) => {
        if (!driverList || driverList.length === 0) return 0;
        const sum = driverList.reduce((acc, driver) => acc + (driver[field] as number), 0);
        return Math.round(sum / driverList.length);
    }, []);

    const getActiveDrivers = useMemo(() => {
        return drivers?.filter(d => d.viajes > 0) || [];
    }, [drivers]);

    const getInactiveDrivers = useMemo(() => {
        return drivers?.filter(d => d.viajes === 0) || [];
    }, [drivers]);

    const getBestPerformer = useMemo(() => {
        if (!drivers || drivers.length === 0) return null;
        return drivers.reduce((best, current) =>
            current.viajes > best.viajes ? current : best
        );
    }, [drivers]);

    const getWorstPerformer = useMemo(() => {
        if (!drivers || drivers.length === 0) return null;
        return drivers.reduce((worst, current) =>
            current.eficiencia < worst.eficiencia ? current : worst
        );
    }, [drivers]);

    return {
        getTopDrivers,
        getBottomDrivers,
        calculateAverage,
        getActiveDrivers,
        getInactiveDrivers,
        getBestPerformer,
        getWorstPerformer,
        totalDrivers: drivers?.length || 0,
        activeCount: getActiveDrivers.length,
        inactiveCount: getInactiveDrivers.length
    };
};

export default useDriverCalculations;