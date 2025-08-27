import React from 'react';

interface DriverStatsProps {
    drivers: any[];
    title: string;
    count: number;
    sortBy?: 'viajes' | 'eficiencia';
    ascending?: boolean;
    className?: string;
}

export const DriverStats: React.FC<DriverStatsProps> = ({
    drivers,
    title,
    count,
    sortBy = 'viajes',
    ascending = false,
    className = ''
}) => {
    const getSortedDrivers = () => {
        if (!drivers || drivers.length === 0) return [];

        const sorted = [...drivers].sort((a, b) => {
            const comparison = sortBy === 'viajes' ? b.viajes - a.viajes : b.eficiencia - a.eficiencia;
            return ascending ? -comparison : comparison;
        });

        return sorted.slice(0, count);
    };

    const calculateAverage = (field: string) => {
        const sortedDrivers = getSortedDrivers();
        if (sortedDrivers.length === 0) return 0;
        return Math.round(sortedDrivers.reduce((sum, d) => sum + d[field], 0) / sortedDrivers.length);
    };

    const sortedDrivers = getSortedDrivers();

    return (
        <div className={`space-y-4 ${className}`}>
            <h4 className="text-lg font-semibold text-slate-200">{title}</h4>

            {/* Estadísticas resumidas */}
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <div className="text-lg font-semibold text-orange-400">
                        {calculateAverage('eficiencia')}%
                    </div>
                    <div className="text-xs text-slate-400">Eficiencia promedio</div>
                </div>
                <div>
                    <div className="text-lg font-semibold text-red-400">
                        {calculateAverage('viajes')}
                    </div>
                    <div className="text-xs text-slate-400">Viajes promedio</div>
                </div>
                <div>
                    <div className="text-lg font-semibold text-yellow-400">
                        {calculateAverage('cancelacion')}%
                    </div>
                    <div className="text-xs text-slate-400">Cancelación promedio</div>
                </div>
            </div>

            {/* Lista de conductores */}
            <div className="space-y-2">
                {sortedDrivers.map((driver, index) => (
                    <div
                        key={`${driver.name}-${index}`}
                        className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-300">
                                {index + 1}
                            </div>
                            <div className="font-medium text-slate-200 text-sm">
                                {driver.name.split(' ')[0]}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-blue-400">{driver.viajes}</div>
                            <div className="text-xs text-slate-400">{driver.eficiencia}%</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DriverStats;