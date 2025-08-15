// src/components/ui/MetricCardSkeleton.tsx

export const MetricCardSkeleton = () => (
    <div className="bg-white/5 dark:bg-slate-800/50 p-6 rounded-xl animate-pulse">
        <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-slate-700/50 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-slate-700/50 rounded w-1/4"></div>
    </div>
);