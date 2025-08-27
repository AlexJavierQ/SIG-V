import React, { memo } from 'react';
import { ResponsiveContainer } from 'recharts';

interface OptimizedChartProps {
    children: React.ReactNode;
    height?: number | string;
    width?: string;
    className?: string;
}

// Componente optimizado para gráficos con memo
const OptimizedChart = memo<OptimizedChartProps>(({
    children,
    height = "100%",
    width = "100%",
    className = ""
}) => {
    return (
        <div className={className}>
            <ResponsiveContainer width={width} height={height}>
                {children}
            </ResponsiveContainer>
        </div>
    );
});

OptimizedChart.displayName = 'OptimizedChart';

export default OptimizedChart;