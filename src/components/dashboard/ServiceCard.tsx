// src/components/dashboard/ServiceCard.tsx

import Link from 'next/link';
import { ArrowRight, type LucideIcon } from 'lucide-react';

interface ServiceStats {
    primaryMetric?: { value: number; label: string };
    trend?: { value: number; label: string };
}

interface ServiceCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    color: string;
    bgColor: string;
    stats: {
        primary: string;
        secondary: string;
        tertiary: string;
    };
    isActive: boolean;
    badge?: string;
    liveStats?: ServiceStats;
}

export default function ServiceCard({
    title,
    description,
    icon: Icon,
    href,
    color,
    bgColor,
    stats,
    isActive,
    badge,
    liveStats,
}: ServiceCardProps) {

    // Usar estadísticas en vivo si están disponibles, sino usar las estáticas
    const displayStats = liveStats ? {
        primary: liveStats.primaryMetric?.value.toLocaleString() || stats.primary,
        secondary: liveStats.primaryMetric?.label || stats.secondary,
        tertiary: liveStats.trend ? `${liveStats.trend.value >= 0 ? '+' : ''}${liveStats.trend.value.toFixed(1)}%` : stats.tertiary
    } : stats;

    const CardContent = () => (
        <div
            className={`service-card-unified bg-gradient-to-br ${bgColor} relative h-full flex flex-col transition-all duration-300 ${isActive ? '' : 'opacity-75 hover:opacity-90'
                }`}
        >
            {badge && (
                <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-medium rounded-full animate-pulse">
                    {badge}
                </div>
            )}

            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${color} rounded-xl shadow-lg transition-transform duration-300 ${isActive ? 'group-hover:scale-110' : ''}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {isActive && (
                    <ArrowRight className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                )}
            </div>

            <div className="flex-grow">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors">
                    {title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                    {description}
                </p>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <div className={`text-2xl font-bold ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                        {displayStats.primary}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs">{displayStats.secondary}</div>
                </div>
                <div className="text-right">
                    <div className={`text-sm font-medium ${isActive ?
                            (liveStats?.trend && liveStats.trend.value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')
                            : 'text-slate-500'
                        }`}>
                        {displayStats.tertiary}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs">
                        {isActive ? (liveStats?.trend?.label || 'vs período anterior') : 'En desarrollo'}
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-600/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 dark:bg-green-400 animate-pulse' : 'bg-slate-400 dark:bg-slate-500'}`}></div>
                        <span className="text-slate-600 dark:text-slate-400 text-xs">
                            {isActive ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                    {isActive && <span className="text-blue-600 dark:text-blue-400 text-xs">Ver dashboard</span>}
                </div>
            </div>
        </div>
    );

    return isActive ? (
        <Link href={href} className="group h-full">
            <CardContent />
        </Link>
    ) : (
        <div className="cursor-not-allowed h-full">
            <CardContent />
        </div>
    );
}