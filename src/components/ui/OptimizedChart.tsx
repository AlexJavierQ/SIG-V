'use client';

import React, { memo, useMemo, useCallback } from 'react';
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';

interface OptimizedChartProps {
    data: any[];
    ChartComponent: React.ComponentType<any>;
    chartProps?: any;
    dependencies?: any[];
    className?: string;
}

export const OptimizedChart: React.FC<OptimizedChartProps> = memo(({
    data,
    ChartComponent,
    chartProps = {},
    dependencies = [],
    className = ''
}) => {
    const { memoizeData } = usePerformanceOptimization();

    // Memoize chart data to prevent unnecessary re-renders
    const memoizedData = useMemo(() => {
        return memoizeData(data, [data, ...dependencies]);
    }, [data, dependencies, memoizeData]);

    // Memoize chart props
    const memoizedProps = useMemo(() => ({
        data: memoizedData,
        ...chartProps
    }), [memoizedData, chartProps]);

    const handleChartInteraction = useCallback((event: any) => {
        // Handle chart interactions efficiently
        if (chartProps.onInteraction) {
            chartProps.onInteraction(event);
        }
    }, [chartProps]);

    return (
        <div className={`optimized-chart-container ${className}`}>
            <ChartComponent
                {...memoizedProps}
                onInteraction={handleChartInteraction}
            />
        </div>
    );
});

OptimizedChart.displayName = 'OptimizedChart';